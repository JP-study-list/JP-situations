# project-index.md — 專案檔案索引

> JP-situations：日文情境學習工具集。純靜態、共用引擎架構、無框架無建置工具。
> 規範見 `CLAUDE.md`（§8 為本專案技術背景）。開發歷史見 `progress.md`。
> 檔案新增／刪除／職責變動時，**同步更新本檔**。

---

## 進入點

- **線上**：https://jp-study-list.github.io/JP-situations/
- **本機**：直接開 `index.html`（Firebase 走 CDN，需連網；無同步碼則純本機運作）
- **實際入口檔**：`index.html`（hub 首頁）→ 各 `<情境>.html`

---

## 架構關係圖

```
index.html  (hub：卡片入口 / 熱力圖 / 統計 / 收藏視窗)
   │  自帶完整 HTML 與樣式，不使用 app.css / app.js
   │  內含 PAGES 陣列（隨機學習、最少複習、收藏來源標籤的資料來源）
   │
   ├─→ hotel.html ─┐
   ├─→ ramen.html ─┤  每頁只含：配色 <style> + 四個資料區塊 + PAGE_CONFIG
   ├─→ ...        ─┤
   └─→ (共 27 頁) ─┘
                    │
                    ├─ app.css   全部情境頁樣式（只用 var()，不定義色值）
                    ├─ app.js    共用引擎：注入骨架 HTML + 全部互動邏輯
                    │              └─→ audio/<音色>/<hash>.mp3   預生成語音
                    └─ common.js ES module：收藏資料層 / Firebase 同步 / 回首頁鈕
                                  （index.html 與情境頁都載入）

載入順序不可調換：資料區塊 → app.js → common.js
情境頁引用 app.js 時帶版本號（`./app.js?v=2`），避免 iOS PWA 吃到舊快取
```

---

## 核心檔案

| 檔案 | 用途 | 備註 |
|------|------|------|
| `index.html` | hub 首頁。側欄、收藏 Modal（含收藏測驗）、學習熱力圖、統計、最近瀏覽、最少複習、同步碼設定 | 自成一體，**不吃** `app.css` / `app.js`；改情境頁時常需同步改此檔的卡片與 `PAGES` |
| `app.js` | 共用引擎。骨架注入、速查表（REF）、記憶卡／測驗（STUDY）、易混（CONFUSE）、常用句（PHRASE）、furigana、語音、主題切換 | **鐵則 1：不得擅自修改**，影響全部 27 頁。語音層見下方「語音系統」 |
| `app.css` | 情境頁全部樣式。顏色一律 `var(--xxx)` | **鐵則 1：不得擅自修改**；星號啟用色 `#C8A32C` 寫死於此 |
| `common.js` | 收藏 CRUD、Firestore 拉取／推送與合併、同步碼、主題偏好、standalone 回首頁鈕。掛 `window.JPHub` | **鐵則 1：不得擅自修改**；Firebase config 在此（apiKey 非密鑰） |
| `tools/gen-audio.mjs` | 語音生成腳本。抽取 27 頁資料 → 呼叫 Azure Neural TTS → 產出 `audio/` | 只在本機跑，不隨頁面載入。**新增情境頁後必須補跑** |
| `voice-check.html` | 診斷工具頁：列出裝置上的日文語音、品質評分、性別判定，可試聽 | 非情境頁，不掛 `index.html` 入口，可隨時刪除 |
| `.gitignore` | 保護 `.env`、`node_modules/` 等 | `.env.example` 刻意不忽略 |
| `.env.example` | Azure 金鑰設定範本 | 實際的 `.env` 絕不進 git（見 `CLAUDE.md` §4 規則 D） |
| `README.md` | 僅一行專案名 | 目前無實質內容 |
| `CLAUDE.md` | 開發規範 + 專案技術背景（§8） | 會 commit 上公開 repo，禁寫 secret |
| `progress.md` | 開發歷史（反向時間序） | 每次改檔即更新 |
| `project-index.md` | 本檔 | 每次改檔即同步 |

---

## 情境頁（27 頁）

`hotel.html` 是**結構範本**，新增或修改一律以它為基準。
每頁 `pageKey` 必須等於檔名主體且全站唯一（已驗證：27 頁無重複、無誤植）。

### 飲食
| 檔案 | 標題 | pageKey |
|------|------|---------|
| `izakaya.html` | 居酒屋 | izakaya |
| `italian.html` | 義大利餐廳 | italian |
| `ramen.html` | 拉麵店 | ramen |
| `gyudon.html` | 牛丼 | gyudon |
| `sushi.html` | 高級壽司店 | sushi |
| `yakiniku.html` | 燒肉店 | yakiniku |
| `starbucks.html` | 星巴克 | starbucks |
| `bakery.html` | 麵包店 | bakery |

### 買い物
| 檔案 | 標題 | pageKey |
|------|------|---------|
| `butcher.html` | 肉舖 | butcher |
| `greengrocer.html` | 蔬菜店 | greengrocer |
| `konbini.html` | 日本超商 | konbini |
| `pharmacy.html` | 藥局 | pharmacy |
| `clothing.html` | 服飾／試穿 | clothing |
| `pokemon-card.html` | 寶可夢卡店 | pokemon-card |
| `electronics-store.html` | 家電量販店 | electronics-store |

### 旅行・生活
| 檔案 | 標題 | pageKey |
|------|------|---------|
| `hotel.html` | 商務飯店（**範本**） | hotel |
| `reservation.html` | 電話訂位 | reservation |
| `shrine.html` | 神社 | shrine |
| `museum.html` | 美術館 | museum |
| `onsen.html` | 溫泉／錢湯 | onsen |
| `directions.html` | 問路 | directions |
| `taxi.html` | 計程車 | taxi |
| `car-rental.html` | 租車 | car-rental |
| `train-subway.html` | 電車・地下鐵 | train-subway |
| `post-office.html` | 郵局 | post-office |
| `school-interview.html` | 語言學校面試（**非服務業敬語頁**，見下） | school-interview |
| `immigration.html` | 入境審查（**非服務業敬語頁**，見下） | immigration |

> `school-interview.html` 與 `immigration.html` 是刻意偏離 §8.5 的兩頁：
> - 面試不適用服務業敬語，`staff`（老師）改用尊敬語提問、`customer`（學生）改用謙讓語應答。
> - 入境審查的 `staff` 是公務員不是店家，用「〜をお願いします／〜を教えてください／
>   確認させていただきます／こちらへどうぞ／ご協力ありがとうございました」。
>
> 修改這兩頁時**不要**套用 いらっしゃいませ／かしこまりました／くださいませ 等店家用語。

> `index.html` 的卡片 `card-title` 與 `PAGES` 的 `title` 必須完全相同，
> 否則收藏視窗的來源名稱會顯示錯誤。

---

## 語音系統

發音走**預生成音檔**，Web Speech 只在音檔缺漏時當備援。

```
audio/
  nanami/   七海（女）  單字與易混詞固定用此音色，另參與對話輪替
  mayu/     真夕（女）
  shiori/   志織（女）
  keita/    圭太（男）
  daichi/   大智（男）
  naoki/    直紀（男）
```

- 共 5,305 個檔（24kHz / 48kbps 單聲道 mp3，約 134MB）
- 檔名為日文原文的 hash，**同一句話跨情境頁共用同一個檔**
- 每個「情境」由 `scenarioVoices(pageKey, sceneKey, scenarioIndex)` 決定一組固定男女配對，
  對話內部不換聲音，變化來自跨情境；角色會互換，所以店員不一定是女聲。共 18 種組合

**維護時的三個地雷**

1. `audioHash` 與 `scenarioVoices` 在 `app.js` 與 `tools/gen-audio.mjs` 各有一份**完全相同**的
   實作。任一邊改動都必須同步，否則播放端組出的檔名對不上生成端的產物。
2. hash 刻意用同步的 FNV-1a 而非 `crypto.subtle`。後者是非同步的，而 iOS Safari 要求
   `audio.play()` 必須在使用者手勢的同步呼叫堆疊內，`await` 之後會失去授權而靜音。
   同理全站共用同一個 `<audio>` 元素，換句子只換 `src`。
3. **新增或修改情境頁的日文內容後，必須補跑 `node tools/gen-audio.mjs`**
   （需要 `.env` 的 Azure 金鑰），否則新句子會退回 Web Speech。
   跑之前可先 `--dry` 看要生成幾個，腳本會一併回報已無人引用的孤兒音檔。

Azure F0 免費層：每月 50 萬字元、每 60 秒 20 次請求（不可調整，全量重跑約 4.5 小時）。
全站目前 98,279 字元，單月額度綽綽有餘。

---

## 靜態資源

| 檔案 | 用途 |
|------|------|
| `icon-192.png` / `icon-512.png` | PWA 圖示 |
| `apple-touch-icon.png` | iOS 加到主畫面圖示（180x180） |
| `manifest.json` | PWA manifest。`start_url` / `scope` / `icons.src` 一律 `/JP-situations/...` 絕對路徑，僅由 `index.html` 引用 |

---

## 資料儲存

**localStorage**
- `jp-hub-favs` / `jp-hub-days` / `jp-hub-visits` / `jp-hub-recent` / `jp-hub-synccode`（hub 層，`common.js`）
- `hub-dark`：主題偏好，hub 與情境頁共用（`'1'`=深色、`'0'`=淺色）
- `{pageKey}-refZh` / `-autoSpeak` / `-showZh`：各情境頁開關狀態

**Firestore**（選用，未填同步碼則不啟用）
- `learners/{syncCode}` → `{ favs, days, visits, recent, updated }`

---

## git 備註

- 分支：`main`（GitHub Pages 來源）；本地另有 `backup` 備份分支，勿直接推送
