#!/usr/bin/env node
/**
 * tools/gen-audio.mjs
 *
 * 用 Azure AI Speech 把全站日文句子預先生成 mp3，輸出到 audio/<voice>/<hash>.mp3。
 * app.js 播放時用同一套 hash 規則組出檔名，找不到就退回 Web Speech。
 *
 * 用法：
 *   node tools/gen-audio.mjs --dry        只統計不呼叫 API，先看要生成幾個檔
 *   node tools/gen-audio.mjs --sample     只生成 6 句試聽（不消耗多少額度）
 *   node tools/gen-audio.mjs              全量生成，已存在的檔會跳過
 *
 * 前置：專案根目錄的 .env 需含
 *   AZURE_SPEECH_KEY=...
 *   AZURE_SPEECH_REGION=japaneast
 *
 * F0 免費層限流為每 60 秒 20 次請求，腳本預設照此節流（約 3 秒一句）。
 * 若已升級 S0，加 --tier=s0 可提速到每秒 10 次。
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = path.join(ROOT, 'audio');

/* ---------- 音色設定 ---------- */
// Azure F0 免費層可用的 7 個 ja-JP 標準 Neural 音色。
// HD 音色（ja-JP-Sakura / ja-JP-Haruto，MAI-Voice-2-Flash）在 F0 會回 502，需付費層。
// 改動以下常數或 scenarioVoices 必須同步 app.js 的同名程式碼，否則檔名對不上。
const VOICE_IDS = {
  nanami: 'ja-JP-NanamiNeural',
  aoi: 'ja-JP-AoiNeural',   // 使用者試聽後排除，保留設定以便日後改回
  mayu: 'ja-JP-MayuNeural',
  shiori: 'ja-JP-ShioriNeural',
  keita: 'ja-JP-KeitaNeural',
  daichi: 'ja-JP-DaichiNeural',
  naoki: 'ja-JP-NaokiNeural',
};
const FEMALE_VOICES = ['nanami', 'mayu', 'shiori'];
const MALE_VOICES = ['keita', 'daichi', 'naoki'];
// 單字與易混詞是查詢用的參考清單而非對話，固定一個音色以維持一致性，
// 順便讓所有情境頁的單字共用同一批檔案。
const WORD_VOICE = 'nanami';

// 每個「情境」分配一組固定的男女配對：對話內部不換聲音，變化來自跨情境。
// 角色也會互換，避免整站都是女店員配男客人。
// 確定性演算法，Node 與瀏覽器必須算出相同結果。
function scenarioVoices(pageKey, sceneKey, scenarioIndex) {
  const h = audioHash(`${pageKey}|${sceneKey}|${scenarioIndex}`);
  const f = FEMALE_VOICES[parseInt(h.slice(0, 4), 16) % FEMALE_VOICES.length];
  const m = MALE_VOICES[parseInt(h.slice(4, 8), 16) % MALE_VOICES.length];
  const staffIsFemale = parseInt(h.slice(8, 12), 16) % 2 === 0;
  return staffIsFemale ? { staff: f, customer: m } : { staff: m, customer: f };
}

const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

/* ---------- 檔名 hash ---------- */
// FNV-1a 變體，以兩個 32 位元 lane 湊成 64 位元。
// 刻意不用 crypto：瀏覽器端的 crypto.subtle 是非同步的，而 iOS Safari 要求
// audio.play() 必須在使用者手勢的同步呼叫堆疊內，await 之後會失去手勢授權。
// 這個版本在 Node 與瀏覽器必須產生完全相同的結果，改動時務必同步 app.js。
export function audioHash(str) {
  const bytes = new TextEncoder().encode(str);
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < bytes.length; i++) {
    h1 = Math.imul(h1 ^ bytes[i], 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ bytes[i], 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

/* ---------- .env ---------- */
function loadEnv() {
  const p = path.join(ROOT, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

/* ---------- 從情境頁抽出資料 ---------- */
// 情境頁的第一個 script 只含五個 const 宣告，沒有 DOM 存取（已驗證全部 26 頁），
// 因此可以直接在 vm sandbox 內求值，比正規表示式擷取可靠。
function extractPageData(file) {
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<script>\r?\n([\s\S]*?)\r?\n<\/script>/);
  if (!m) return null;
  const src = m[1] + '\n;globalThis.__out = { VOCAB_DATA, CONFUSE_GROUPS, PHRASE_DATA, PAGE_CONFIG };';
  const sandbox = vm.createContext({});
  try {
    vm.runInContext(src, sandbox, { timeout: 10000 });
  } catch (err) {
    console.warn(`  ! ${path.basename(file)} 求值失敗：${err.message}`);
    return null;
  }
  return sandbox.__out || null;
}

function listScenarioFiles() {
  return fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'voice-check.html')
    .sort();
}

function collectTasks() {
  const tasks = new Map(); // `${dir}/${hash}` -> { text, dir, voiceId }
  const stats = { files: 0, phrases: 0, words: 0 };

  const add = (text, dir) => {
    if (!text || typeof text !== 'string') return;
    const hash = audioHash(text);
    const key = `${dir}/${hash}`;
    if (!tasks.has(key)) {
      tasks.set(key, { text, dir, hash, voiceId: VOICE_IDS[dir] });
    }
  };

  for (const f of listScenarioFiles()) {
    const data = extractPageData(path.join(ROOT, f));
    if (!data) continue;
    stats.files++;
    const pageKey = (data.PAGE_CONFIG && data.PAGE_CONFIG.pageKey) || path.basename(f, '.html');

    for (const cat of Object.values(data.VOCAB_DATA || {})) {
      for (const it of cat.items || []) { add(it.jp, WORD_VOICE); stats.words++; }
    }
    for (const g of data.CONFUSE_GROUPS || []) {
      for (const it of g.items || []) { add(it.jp, WORD_VOICE); stats.words++; }
    }
    for (const [sceneKey, scene] of Object.entries(data.PHRASE_DATA || {})) {
      (scene.scenarios || []).forEach((sc, i) => {
        const voices = scenarioVoices(pageKey, sceneKey, i);
        for (const it of sc.items || []) {
          add(it.jp, voices[it.speaker] || WORD_VOICE);
          stats.phrases++;
        }
      });
    }
  }

  return { tasks, stats };
}

/* ---------- Azure TTS ---------- */
function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function buildSsml(text, voiceId) {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ja-JP">`
       + `<voice name="${voiceId}">${escapeXml(text)}</voice></speak>`;
}

async function synthesize(text, voiceId, key, region) {
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': OUTPUT_FORMAT,
      'User-Agent': 'jp-situations-audio-gen',
    },
    body: buildSsml(text, voiceId),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const err = new Error(`HTTP ${res.status} ${res.statusText} ${body.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  return Buffer.from(await res.arrayBuffer());
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 主流程 ---------- */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry');
  const sampleOnly = args.includes('--sample');
  const tier = (args.find(a => a.startsWith('--tier=')) || '--tier=f0').split('=')[1];

  // F0 是每 60 秒 20 次且不可調整，留一點餘裕抓 3.2 秒；S0 預設 30 TPS，保守用 10 次/秒。
  const intervalMs = tier === 's0' ? 100 : 3200;

  loadEnv();

  console.log('掃描情境頁...');
  const { tasks, stats } = collectTasks();
  const all = [...tasks.values()];

  console.log(`  情境頁 ${stats.files} 個`);
  console.log(`  對話 ${stats.phrases} 句、單字與易混詞 ${stats.words} 條`);
  console.log(`  去重後需生成 ${all.length} 個音檔`);

  const chars = all.reduce((n, t) => n + t.text.length, 0);
  console.log(`  總字元數 ${chars.toLocaleString()}（Azure F0 免費層每月 500,000）`);

  const todo = all.filter(t => !fs.existsSync(path.join(AUDIO_DIR, t.dir, `${t.hash}.mp3`)));
  console.log(`  其中尚未生成 ${todo.length} 個`);

  // 資料內容或音色配置改動後，舊音檔會變成沒人引用的孤兒。只回報，不自動刪。
  const wanted = new Set(all.map(t => `${t.dir}/${t.hash}.mp3`));
  const orphans = [];
  if (fs.existsSync(AUDIO_DIR)) {
    for (const dir of fs.readdirSync(AUDIO_DIR)) {
      const dirPath = path.join(AUDIO_DIR, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;
      for (const name of fs.readdirSync(dirPath)) {
        if (name.endsWith('.mp3') && !wanted.has(`${dir}/${name}`)) orphans.push(`${dir}/${name}`);
      }
    }
  }
  if (orphans.length) {
    console.log(`  另有 ${orphans.length} 個孤兒音檔已無人引用，確認無誤後可手動刪除`);
  }

  if (dryRun) {
    const mins = Math.ceil(todo.length * intervalMs / 60000);
    console.log(`\n--dry 模式結束。實際生成預估耗時 ${mins} 分鐘（tier=${tier}）。`);
    return;
  }

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    console.error('\n缺少 AZURE_SPEECH_KEY 或 AZURE_SPEECH_REGION。');
    console.error('請在專案根目錄建立 .env（已列入 .gitignore）：');
    console.error('  AZURE_SPEECH_KEY=你的金鑰');
    console.error('  AZURE_SPEECH_REGION=japaneast');
    process.exitCode = 1;
    return;
  }

  let queue = todo;
  if (sampleOnly) {
    // 各音色取 3 句，用來確認金鑰、區域與音色設定都正確
    const byDir = {};
    for (const t of all) (byDir[t.dir] ||= []).push(t);
    queue = Object.values(byDir).flatMap(list => list.slice(0, 3));
    console.log(`\n--sample 模式：只生成 ${queue.length} 句試聽。`);
  }

  if (!queue.length) {
    console.log('\n沒有需要生成的音檔，結束。');
    return;
  }

  for (const dir of new Set(all.map(t => t.dir))) {
    fs.mkdirSync(path.join(AUDIO_DIR, dir), { recursive: true });
  }

  console.log(`\n開始生成，間隔 ${intervalMs}ms（tier=${tier}）。中斷後重跑會自動跳過已完成的檔。\n`);

  let done = 0;
  let failed = 0;
  const startedAt = Date.now();

  for (const t of queue) {
    const out = path.join(AUDIO_DIR, t.dir, `${t.hash}.mp3`);
    if (fs.existsSync(out)) { done++; continue; }

    let ok = false;
    for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
      try {
        const buf = await synthesize(t.text, t.voiceId, key, region);
        fs.writeFileSync(out, buf);
        ok = true;
      } catch (err) {
        if (err.status === 429 || err.status >= 500) {
          const backoff = intervalMs * attempt * 2;
          console.warn(`  限流或伺服器錯誤（${err.status}），${backoff}ms 後重試 ${attempt}/4`);
          await sleep(backoff);
        } else {
          console.error(`  失敗：${t.text.slice(0, 20)} -> ${err.message}`);
          break;
        }
      }
    }

    if (ok) done++; else failed++;

    const n = done + failed;
    if (n % 20 === 0 || n === queue.length) {
      const elapsed = (Date.now() - startedAt) / 1000;
      const rate = n / elapsed;
      const remain = Math.ceil((queue.length - n) / rate / 60);
      console.log(`  ${n}/${queue.length}  失敗 ${failed}  預估剩餘 ${remain} 分鐘`);
    }

    await sleep(intervalMs);
  }

  console.log(`\n完成。成功 ${done}、失敗 ${failed}。`);
  if (failed) console.log('失敗的項目重跑一次腳本即可補齊（已完成的會跳過）。');
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('gen-audio.mjs')) {
  main().catch(err => { console.error(err); process.exitCode = 1; });
}
