# CLAUDE.md — 開發規範與專案脈絡（單一檔）

> 本檔為通用規範 + 本專案技術背景的合併檔，放在專案根目錄，Claude Code 啟動時自動載入。
> 新 repo 只需複製本檔（§0~§7 通用部分照抄），第一次對 Claude Code 說「初始化這個專案」，
> 其餘檔案（project-index.md、progress.md）與 §8 專案背景會自動長出來（見 §1 自舉）。
>
> ⚠️ 本檔會 commit 上公開 repo。**嚴禁寫入任何 secret**（見 §4 規則 D 的可寫/不可寫清單）。

---

## 0. 語言與溝通
- 一律使用**繁體中文**回覆。
- 解釋精簡、切中要點，節省 token。

---

## 1. 啟動 SOP（每次新 session 開場）

### 一般啟動
1. 讀 `project-index.md`（全部）——掌握結構與各檔用途，**不重掃全部原始碼**。
2. 讀 `progress.md` **最新 3~5 筆**——掌握上次進度與待辦。
3. 需動到某檔時，才針對性讀該檔。

### 首次進專案 / 使用者說「初始化這個專案」時（自舉）
依序執行，**全程只新增、不刪除、不覆蓋**：
1. **讀**現有全部檔案（唯讀，不動任何一個）。
2. 若 `project-index.md` **不存在** → 自動生成；若已存在 → 更新，**絕不覆蓋既有內容**。
3. 若 `progress.md` **不存在** → 建立空模板；若已存在 → 保留。
4. 訪談使用者補齊 §8 專案技術背景，寫進本檔 §8 區塊。
   - **只問非機密項**（Project ID、collection 結構、部署 branch 等）。
   - 遇到金鑰類（`/exec` URL、API key）→ **不寫進本檔**，改提醒使用者放 `.env`，本檔只記指標。

> **自舉硬規則**：初始化流程明文禁止任何 `rm`、覆寫、`git reset` 等破壞既有檔案的操作。只建立不存在的檔。

---

## 2. 開發流程規範（嚴格執行）

收到任何工具／功能開發請求時，**不得立即寫程式碼**。依序：

### Phase 1：需求確認（必做）
1. 用自己的話覆述需求。
2. 提釐清問題，涵蓋：使用情境（手機／桌機／網頁、頻率）、核心功能（MVP vs. 加分）、UI 偏好（語言預設繁中、深/淺色、版面）、資料處理（需持久化？存哪？）、技術限制（單一 HTML？React？GitHub Pages？）。
3. 一次最多 3~5 個關鍵問題，不洗版。

### Phase 2：提案（必做）
- 功能清單（MVP vs. 未來擴充）
- 技術方案 + 一句話理由
- UI 結構文字描述（免圖）
- 結尾問：「確認後才動工，有要調整的嗎？」

### Phase 3：實作
- 僅在明確說「start／確認／go ahead」後開始寫碼。
- 驗證與 review 嚴謹徹底；交付前自我檢查功能完整性。

### 例外
- 瑣碎請求（一行 CSS、明顯 bug）可跳過，但先說「Simple request, proceeding directly」。

### 中途變更
- 需求中途更動且影響架構 → **先指出影響範圍**再動手。

---

## 3. 交付原則（本機環境）
- 直接讀寫本機檔案，不再提供「完整檔案手動貼回／ZIP」。
- 偏好乾淨美學：衝突時，簡潔 > 附加功能；果斷、直接。
- 期望根因診斷，不要表面修復。

---

## 4. 本機環境安全與協作規則（ABCD）

### A. Commit 規範
- **允許直接 commit**，不需事前確認。
- 訊息格式：`feat:` / `fix:` / `refactor:` / `docs:` / `chore:` 前綴 + 繁中摘要。
  - 例：`fix: 修正背景卡 shiny 切換未同步 Firestore`

### B. 破壞性操作前先確認（最高優先，不因 A 而放寬）
- 以下操作**必須先說明影響範圍並等待明確同意**：
  - 刪除檔案、`rm`
  - `git reset --hard`、`git push -f`、`git rebase`
  - 大範圍重構、跨多檔結構性變更
- Commit 可逆，故 A 放行；上述不可逆，故一律先問。不確定是否具破壞性時，先問。

### C. 本機測試優先於宣稱完成
- 宣稱「完成」前，能本機驗證的先驗證：起 server、看 console、跑既有測試。
- 不憑「讀過碼看起來對」就宣稱完成。

### D. Secrets 不進 git（含本 CLAUDE.md）
本檔會上公開 repo，界線如下：

**可寫進本檔（非機密）：**
- Firebase **Project ID**（本就出現在前端 config，非機密）
- Firestore collection 結構、key 設計原則
- 部署 branch、GitHub Pages 網域
- 使用的 API、資料來源、cron 時間
- 已知地雷

**絕不寫進本檔（外置到 `.env` / `config.local.js`，並列入 `.gitignore`）：**
- Apps Script `/exec` URL（等同後端入口，視為機密）
- 任何 API key / token / 私鑰、service account 憑證

本檔只記**指標**，例：`Apps Script /exec URL 存於 .env 的 APPS_SCRIPT_URL（不進 git）`。

> 註：Firebase 前端 `apiKey` 並非密鑰，本就暴露於客戶端，靠 Firestore Security Rules 保護；重點是 Rules 有沒有寫好，而非藏 key。Apps Script `/exec` URL 則須當機密。

---

## 5. 檔案維護機制

### progress.md — 開發歷史（每次改檔即更新）
- 反向時間序（最新在上）。
- 欄位：
  ```
  ## YYYY-MM-DD
  - 類型：新增 / 修正 / 重構
  - 影響檔案：xxx.html, yyy.js
  - 摘要：做了什麼
  - 原因：為什麼
  - 待辦/已知問題：（可留空）
  ```
- 小改允許精簡：只填「日期 + 類型 + 摘要」。

### project-index.md — 專案檔案索引（首次建立，每次改檔同步）
- 每個檔案的用途、彼此關係、進入點。
- 檔案新增／刪除／職責變動 → 同步更新。

---

## 6. 技術教訓（跨專案通用原則）

> 以下為既往踩坑固化的原則。**若當下發現更優解，先提出與使用者討論，不擅自沿用舊規則、也不默默改掉。**

- **Firestore key 設計**：用穩定 ID（`p###`、costume ID）當 key，seed 變動不破壞既有紀錄；只存狀態，不存顯示資料。
- **Apps Script 部署**：一律**編輯現有 deployment**（鉛筆 → 新版本 → 部署）保留 `/exec` URL，絕不新建 deployment。
- **Base64 圖片**：存 Firestore <700KB；iOS Shortcut Base64 encode 關閉換行。
- **GitHub Actions cron**：避開 UTC 午夜，偏移如 `43 0 * * *`。
- **日期／時區**：Taiwan UTC+8，日期邏輯用 local time 格式化，**不用 `toISOString()`**。
- **Google Maps API**：tile 依 ToS 不可快取；離線資料由 Firestore `persistentLocalCache` 處理。
- **靜態站資料源**：AniList GraphQL 支援 CORS 免金鑰；Nominatim 1 req/sec、免金鑰。
- **iOS Shortcut 分享**：LINE Flex Message 擷取走「截圖 → OCR」最可靠。
- **fast-flights**：用 `FlightQuery` / `create_query`（v3.x）；`FlightData` 為破壞性移除。
- **圖片格式**：背景卡等圖片 jpg/png/webp 混雜，寫死檔名前**先確認格式**。

---

## 7. 環境差異備註（vs. Artifact）
- 本機開發可用 localStorage／IndexedDB 除錯；線上部署 GitHub Pages 時，持久化仍走 Firestore。
- 本機可實跑、可 git、可 build/test —— review 標準相應提高。

---

## 8. 專案技術背景（JP-situations）

> 本節整合自舊版 `CLAUDE-old.md`（2026-08-06 併入後刪除）。金鑰類不寫此處。

### 8.0 一行摘要
日文情境學習工具集，**純靜態 + 共用引擎架構**，無框架、無建置工具，
託管於 GitHub Pages（`jp-study-list.github.io/JP-situations/`）。介面語言為台灣繁體中文。
（`tools/gen-audio.mjs` 是離線的語音內容生成腳本，不是建置流程，網站仍是原樣送出。）

### 8.1 檔案結構
所有網頁檔平放在 repo 根目錄，只有 `audio/` 與 `tools/` 兩個子資料夾。

| 檔案 | 說明 |
|------|------|
| `index.html` | hub 首頁：卡片入口、熱力圖、統計、收藏視窗、Firebase 同步 |
| `common.js` | 共用模組：收藏資料層、雲端同步、回首頁按鈕。以 ES module 載入 |
| `app.css` | 全部情境頁樣式（暖簾風格）。主色系一律 `var(--xxx)` 取自各頁，衍生色以 `color-mix()` 推導；僅語意色 `--ok` / `--ng` / `--mark` 三個日本傳統色寫死於此 |
| `app.js` | 共用引擎：注入頁面骨架 HTML ＋ 全部互動邏輯，讀取各頁的 `PAGE_CONFIG` |
| `<情境>.html` | 各情境頁。**只含三樣東西**：配色區塊、四個資料區塊、`PAGE_CONFIG` |
| `audio/<音色>/` | 預生成語音 mp3，檔名為日文原文的 hash。不手動編輯 |
| `tools/gen-audio.mjs` | 語音生成腳本，只在本機跑，不隨頁面載入。詳見 §8.11 |
| `voice-check.html` | 語音診斷頁，非情境頁，不掛 `index.html` 入口 |
| `.nojekyll` | 空檔。讓 GitHub Pages 跳過 Jekyll，**不可刪**，見 §8.13 |

`hotel.html` 是情境頁的標準範本，任何新增或修改都以它為結構基準。
詳細檔案清單與職責見 `project-index.md`。

### 8.2 鐵則
1. **不得修改 `app.js`、`app.css`、`common.js`**。這三個檔案影響全部情境頁。
   若需求必須動它們，先明確告知使用者會影響所有情境頁，取得同意後才動工。
2. 情境頁結構必須與 `hotel.html` 完全一致，不多不少：
   ```
   head：meta、title、Google Fonts、<link rel="stylesheet" href="./app.css?v=2">、<style> 配色 </style>
   body：
     <script>  四個資料區塊 ＋ PAGE_CONFIG  </script>
     <script src="./app.js?v=2"></script>
     <script type="module" src="./common.js"></script>
   ```
   載入順序不可調換：資料 → `app.js` → `common.js`。
   `app.js` **與 `app.css` 都帶版本號**，用於強制刷新 iOS PWA 快取。
   改動任一檔時，30 頁的對應版本號要一起進版（2026-08-07 暖簾改版時 `app.css` 首次進版為 `?v=2`）。
3. **全檔禁止 emoji**（包含資料內容、註解、UI 文字）。
4. 檔名用英文或 romaji 小寫，可含連字號（如 `car-rental.html`）。
5. 不使用任何前端框架或建置工具。外部資源只有 Google Fonts 與 Firebase CDN。

### 8.3 PAGE_CONFIG 規格
```js
const PAGE_CONFIG = {
  pageKey: "hotel",                                   // 必須等於檔名主體，全站唯一
  title: "商務飯店",                                   // 頂欄標題，2-5 字
  speakerLabels: { staff: "店員", customer: "客人" },  // 對話雙方稱呼，依情境調整
  defaultCat: "frontdesk",                            // 預設單字分類，須存在於 VOCAB_DATA
  defaultScene: "checkin",                            // 預設常用句場景，須存在於 PHRASE_DATA
  shapeLabels: { all: "全部" },                        // 無 shape 欄位時只留 all
};
```
- `pageKey` 是 localStorage 前綴（`{pageKey}-refZh`、`-autoSpeak`、`-showZh`）。
  **重複或誤植會導致不同情境的開關狀態互相覆蓋**，是最容易發生且最不易察覺的錯誤。
- `speakerLabels` 目前所有情境都是兩種說話者。若未來出現三種以上，
  需修改 `app.js` 的說話者篩選邏輯，屬於鐵則 1 的範圍。

### 8.4 配色規格（2026-08-07 暖簾改版後）
情境頁的 `<style>` 只做兩件事：定義 `:root` 與 `html[data-theme="dark"]`。

**app.css / app.js 實際需要的 10 個顏色變數，缺一不可**：
```
--primary  --bg  --card  --card-alt  --line  --ink  --ink-soft  --muted
--accent-soft  --on-accent
```
另建議一併定義 `--primary-deep`、`--secondary`、`--accent` 以維持與範本一致。

**`--r-sm` / `--r-md` / `--r-lg` / `--r-pill` 現已不被 `app.css` 使用**。
暖簾風格改用近方角，圓角統一由 `app.css` 自己的 `--r-sheet: 2px` 控制。
這四個變數在 30 頁中保留不刪（無害，且改版若要回退時仍需要），
新增情境頁時照抄 `hotel.html` 即可，不必特別處理。

**衍生色由 `app.css` 以 `color-mix()` 從 `--primary` 推導**
（`--tint`、`--edge-strong`、深色暖簾的底與字等），
所以新增情境頁**不需要**、也不應該自己定義這些衍生變數。
`color-mix()` 需要 iOS 16.4+ / Safari 16.2+ / Chrome 111+。

**深色主題基底固定不變**：
```
--bg:#1C1B1A  --card:#262423  --card-alt:#302E2C  --line:#3F3D3A
--ink:#D9D5D0  --ink-soft:#A8A39C  --muted:#7A766F
```
深色的暖簾走「深底＋亮字＋亮細邊」的夜間招牌，由 `app.css` 自動推導，
情境頁不需處理。主色為高彩度時（例如朱紅）仍建議提供提亮版 `--primary`，
並覆寫 `--accent-soft`（改為暗色調）與 `--on-accent`（改為淺色）。

語意色寫死在 `app.css` 的 `:root`，不隨主色改變，情境頁不需處理：
`--ok` 鶯 `#66753A`、`--ng` 紅梅 `#A9515C`、`--mark` 山吹 `#BF8E2E`（收藏星號）。
深色模式各自提亮。

### 8.5 資料內容規格
四個資料區塊依序放在情境頁的第一個 `<script>` 內。

**VOCAB_DATA**：4 個分類（key 英文小寫、label 中文 2-8 字），每類 10-14 個 `{ jp, kana, zh }`。
`kana` 為全平假名，`zh` 為台灣慣用繁體翻譯。
僅在該分類適合子分類篩選時才加 `shape` 欄位，並於 `PAGE_CONFIG.shapeLabels` 補中文標籤。

**CONFUSE_GROUPS**：5-6 組，`title` 格式「〇〇易混：A vs B vs C」，每組 2-3 個 items。
`zh` 寫**區辨說明**（說明彼此差異），不是單純翻譯。

**PHRASE_DATA**：4 個場景（key 英文小寫、label 中文 2-6 字），每場景固定 4 個情境
（label 格式「情境一：〇〇」到「情境四：〇〇」），每情境 12-14 句
`{ speaker: "staff"|"customer", jp, kana, zh }`。

> **場景數可以是 5**（2026-08-07 `city-hall.html` 首例，經使用者決定）。
> `app.js` 的 `buildSceneTabs` 是對 `PHRASE_KEYS` 動態迭代、`app.css` 的 `.scene-tabbar`
> 是 `flex-wrap: wrap` 置中，**5 個場景不需要修改引擎，只會多換一行**（已實測不溢出）。
> 但這是例外不是預設：一頁 5 場景等於 20 情境約 260 句、音檔多三成，
> 只在主題本身撐得起時才用。VOCAB 仍固定 4 分類。
- 對話須自然連貫：招呼或請求開場 → 中段詢問與回應 → 道謝或送別收尾，兩方大致交替
- staff 用服務業敬語：いらっしゃいませ、かしこまりました、承知いたしました、
  恐れ入ります、〜でございます、〜くださいませ
- customer 用禮貌體：です・ます、〜をお願いします、〜ていただけますか
- `kana` 為整句平假名，標點原樣保留
- `zh` 逗號用全形「,」，語氣自然口語

**KANJI_READINGS**：`[漢字詞, 全平假名讀音]` 的二維陣列，用於常用句的假名 tooltip。
- 引擎會自動由長到短排序，但字典本身要**同時收錄長短兩種切法**以避免誤切
- 必須涵蓋 `PHRASE_DATA` 所有 `jp` 句中含漢字的詞組
- 情境頁**不得**包含 `KANJI_READINGS.sort(...)` 或 `buildFuriganaHTML` 函式，
  這些已在 `app.js`。同理不得宣告 `PHRASE_KEYS`、`currentPhraseScene`、`currentScenarioIndex`

### 8.6 新增情境的完整流程
1. 以 `hotel.html` 為結構範本建立 `<情境>.html`
2. **同步更新 `index.html` 的三個地方**（漏任一個都會造成缺漏）：
   - 卡片入口，放進對應分類區塊（飲食／買い物／旅行）：
     ```html
     <a class="card" href="./檔名.html">
       <div class="card-title">中文名稱</div>
       <div class="card-sub">一句話說明</div>
     </a>
     ```
   - `const PAGES` 陣列加入 `{ file: "檔名.html", title: "中文名稱" }`
     供隨機學習、最少複習、收藏來源標籤使用。
     **`title` 必須與 `card-title` 完全相同**，否則收藏視窗的來源名稱會顯示錯誤
   - **檔尾的 `SCENE` 對照表**加入 `'檔名.html': ['#色值', 'SVG path d']`
     （2026-08-07 暖簾改版新增）。色值取日本傳統色，並避開同區塊相鄰卡片的顏色；
     圖示是 24x24 viewBox 的單一 path 線稿。
     **漏掉不會報錯**，該卡片只會退回預設藍鼠、與其他卡片同色，失去場景辨識度
3. **生成語音音檔**（漏掉這步不會報錯，新頁面只會安靜地退回 Web Speech）：
   ```
   node tools/gen-audio.mjs --dry    先看要生成幾個
   node tools/gen-audio.mjs          實際生成，已存在的自動跳過
   ```
   前置條件是根目錄的 `.env` 有 Azure 金鑰（見 §8.11）。
   單一情境頁約需生成 230 個檔，F0 免費層限流下約 12 分鐘。
4. 執行 §8.8 驗證清單，並更新 `project-index.md` 與 `progress.md`

### 8.7 遷移舊版情境頁
舊版是自包含單檔（樣式與邏輯都內嵌）。遷移時只做三件事，其餘一律刪除：
1. **逐字節保留**四個資料區塊，一個字都不改
   （但刪除其中屬於引擎的 `KANJI_READINGS.sort`、`buildFuriganaHTML`、三個狀態宣告）
2. 保留配色**色值**，只把變數名對齊本規範（主色改為 `--primary` 系列）
3. 從舊檔的 `SPEAKER_LABELS`、預設分類、預設場景、`SHAPE_LABELS` 組出 `PAGE_CONFIG`

舊檔的 UI 與邏輯全部丟棄，由 `app.js` / `app.css` 取代。
遷移後 `index.html` 不需改動（卡片與 PAGES 項目本來就存在）。

### 8.8 驗證清單（修改或新增情境頁後，交付前逐項確認）
- [ ] `node --check` 通過（將情境頁的第一個 script 內容抽出成 .js 後檢查）
- [ ] 四個資料區塊齊全；遷移案須與舊檔逐字節相同（比對字元數）
- [ ] 配色定義涵蓋 §8.4 的 14 個必要變數
- [ ] `pageKey` 等於檔名主體，且與其他情境頁不重複
- [ ] `defaultCat` / `defaultScene` 指向的 key 確實存在於資料中
- [ ] script 載入順序為：資料 → `app.js` → `common.js`
- [ ] 無殘留舊變數名（如 `--navy`）、無 emoji
- [ ] KANJI_READINGS **兩道檢查**（抄 `app.js` 的最長匹配邏輯跑，Node 或 Python 皆可）：
      1. **零缺漏**——掃過每一句 `jp`，不得有任何漢字沒被字典吃掉
      2. **反向重建**——用字典把 `jp` 還原成假名，與 `kana` 欄逐字比對須全等
      第 2 道會抓到第 1 道抓不到的**讀音誤植**（如「本人様」誤含「ご」、
      `kana` 打錯字），2026-08-07 兩頁各靠它抓出 44 與 51 句問題
- [ ] 新增情境時，`index.html` 的卡片、`PAGES`、檔尾 `SCENE` 三處都已更新，
      且 `PAGES.title` 與 `card-title` 完全一致、`SCENE` 的 key 與 `href` 完全一致
- [ ] 語音音檔已生成：生成腳本回報「**失敗 0**」（失敗時重跑，見 §8.13），
      且 `node tools/gen-audio.mjs --dry` 顯示「尚未生成 0 個」
- [ ] 端對端命中：用 `app.js` 自身的 `audioHash` 與 `scenarioVoices` 算出該頁每一句的
      音檔 URL，逐一確認檔案存在，命中率須為 100%（否則該頁會退回 Web Speech）。
      **改動既有頁時，該頁也要重跑這項當回歸**
- [ ] **headless 渲染實跑**：走 CDP（`--remote-debugging-port` + Node 內建 `WebSocket`），
      **不要用 `--dump-dom`（會永不返回）**，並加 `--disable-background-networking`。
      淺色驗證前先 `localStorage.setItem('hub-dark','0')` 再重新載入（見 §8.13）。
      至少驗：三個主分頁、四個單字分類與張數、四個場景與情境、對話句數、
      furigana 標記、說話者標牌、無橫向溢出、無未捕捉例外、深色對比度
- [ ] **push 之後確認線上真的更新**：Actions 的 `pages build and deployment` 為成功
      （**用 `head_sha` 比對本次 commit**，見 §8.13），
      且新頁面與其音檔線上回 200。build 失敗時線上會停在舊版本，本機看不出來
- [ ] 線上內容確認**非快取舊檔**：抓線上 HTML 驗 `pageKey`、主色、句數與關鍵詞

### 8.9 Firebase
- Project ID：`jpsituations`
- 前端 config 直接寫在 `common.js`（apiKey 非密鑰，靠 Security Rules 保護）
- collection 與結構：`learners/{syncCode}`，欄位 `favs` / `days` / `visits` / `recent` / `updated`
- key 設計：收藏 key 為 `` `${page}::${type}::${id}` ``
  （例 `hotel.html::word::チェックイン`、`hotel.html::phrase::checkin-0-3`）
- Auth 方式：**無 Auth**，以使用者自填的同步碼當 document id
- 同步為**選用**：未設定同步碼時純本機運作，同步碼絕不自動產生
- 合併策略：收藏以 `ts` 較新者為準；計數取 max

### 8.10 部署
- GitHub Pages：`main` branch 根目錄；remote `github.com/JP-study-list/JP-situations`
- 網域：`https://jp-study-list.github.io/JP-situations/`
- 無 Apps Script。`.env` 存 Azure 語音金鑰（見 §8.11），已列入 `.gitignore`，絕不進 git
- 本地 `backup` branch 為備份分支，勿直接推送
- 根目錄的 `.nojekyll` 讓 Pages 跳過 Jekyll，直接打包靜態檔。**此檔不可刪**，
  詳見 §8.13
- **push 之後要確認 Actions 的 `pages build and deployment` 真的成功**。
  push 成功不等於上線；build 失敗時線上會靜靜停在舊版本，本機完全看不出來

### 8.11 語音系統
發音走**預生成音檔**，Web Speech 只在音檔缺漏時當備援。

- 音檔由 `tools/gen-audio.mjs` 呼叫 **Azure Neural TTS** 離線批次生成，
  輸出 `audio/<音色>/<日文原文的 hash>.mp3`（24kHz / 48kbps 單聲道）
- 金鑰存於根目錄 `.env` 的 `AZURE_SPEECH_KEY` 與 `AZURE_SPEECH_REGION`（**不進 git**，
  範本見 `.env.example`）。Azure 定價層為 **F0 免費層**：每月 50 萬字元、
  每 60 秒 20 次請求（不可調整）。全站目前約 10.7 萬字元
- 音色池 6 個：女聲 `nanami` / `mayu` / `shiori`，男聲 `keita` / `daichi` / `naoki`。
  刻意排除 `aoi`（使用者試聽後不喜歡）；HD 音色 `Sakura` / `Haruto` 在 F0 會回 502
- 每個「情境」由 `scenarioVoices(pageKey, sceneKey, scenarioIndex)` 決定一組固定男女配對，
  對話內部不換聲音，角色會互換（店員不一定是女聲），共 18 種組合。
  單字與易混詞固定用 `nanami`

**三個維護地雷**

1. `audioHash` 與 `scenarioVoices` 在 `app.js` 與 `tools/gen-audio.mjs`
   **各有一份完全相同的實作**。任一邊改動都必須同步，否則播放端組出的檔名對不上產物
2. hash 刻意用同步的 FNV-1a 而非 `crypto.subtle`。後者是非同步的，而 iOS Safari 要求
   `audio.play()` 必須在使用者手勢的同步呼叫堆疊內，`await` 之後會失去授權而靜音。
   同理全站共用同一個 `<audio>` 元素，換句子只換 `src`
3. 修改任何情境頁的 `jp` 內容後都要補跑生成腳本，舊音檔會變成孤兒（腳本會回報，不自動刪）

### 8.12 自動化
- GitHub Actions：無
- iOS Shortcut：無
- 使用方式以 iOS 加到主畫面（PWA / standalone）為主

### 8.13 已知地雷（本專案特有）
- **`manifest.json` 的路徑**：`start_url` / `scope` / `icons.src` 全部用
  `/JP-situations/...` 絕對路徑（GitHub Pages 子路徑託管的必要寫法）。
  `scope` 少了尾斜線或改成相對路徑，PWA 會脫離 standalone 模式，
  連帶讓 `common.js` 的回首頁按鈕不出現。
  （此檔曾長期缺失導致線上 404，2026-08-06 補回。）
- **iOS PWA 快取**：情境頁目前引用 `./app.js?v=2`。改動 `app.js` 後手機若沒吃到新版，
  把 30 頁的版本號一起遞增（`?v=3`）強制刷新。`app.css` 尚未帶版本號，
  日後若改動它而手機沒更新，比照辦理
- **repo 體積**：`audio/` 佔約 140MB（5,798 個檔）。clone 會偏慢屬正常，
  且已進 git 歷史刪不掉。新增情境頁時每頁再增加約 5MB
- **根目錄的 `.nojekyll` 不可刪**：少了它，GitHub Pages 會對 5,798 個音檔跑完整
  Jekyll 逐檔處理，build job 撐不過 15 分鐘硬性逾時而被取消，整站停留在舊版本。
  症狀是新頁面線上 404、全站語音退回 Web Speech，但**本機一切正常**、
  git 也顯示推送成功，只有 Actions 頁面看得出來
  （2026-08-06 曾連續兩次部署失敗，2026-08-07 補上此檔後 build 從逾時降為 38 秒）
- **PWA 圖示絕對路徑**：`index.html` 與 `manifest.json` 使用
  `/JP-situations/...` 絕對路徑，這是 GitHub Pages 子路徑託管下 iOS 抓圖示的必要寫法，
  **不要改成相對路徑**
- **主題偏好**：情境頁與 hub 共用 localStorage 的 `hub-dark` 鍵
  （`'1'`=深色、`'0'`=淺色），未設定過才依系統偏好
- **圖片／檔名格式**：寫死檔名前先確認實際副檔名
- **情境頁的檔名與 `pageKey` 一旦上線就不可改**：收藏 key 是
  `` `${檔名}::${type}::${id}` ``，存在 localStorage 與 Firestore。
  改檔名或 `pageKey` 會讓該頁既有收藏全部失聯，且無法回復。
  要改頁面稱呼只動**三處顯示標題**：`PAGE_CONFIG.title`、
  `index.html` 的 `card-title` 與 `PAGES.title`
  （2026-08-07「入境審查」改稱「工作簽入境」即照此辦理，該頁 diff 僅一行）
- **`gen-audio.mjs` 失敗不中止**：個別音檔失敗（Azure 偶發回 `terminated`）只會計入
  「失敗 N」並繼續跑完，**腳本仍以 exit 0 結束**。看到失敗數非 0 要**重跑一次**
  （已完成的自動跳過，只補失敗的），直到 `--dry` 顯示「尚未生成 0 個」。
  漏補的話該詞會靜靜退回 Web Speech，本機與線上都不會報錯
- **線上與本機比對前要先正規化換行**：本機 `core.autocrlf=true`，工作區是 **CRLF**，
  但 repo 與 GitHub Pages 送出的是 **LF**。直接比字串長度會整批「不一致」，
  看起來完全像部署失敗，實際差值剛好等於**行數**。
  比對前先 `text.split('\r\n').join('\n')`。
  新建的檔案不會踩到（還沒被 git 重新 checkout），只有改既有檔時會遇到
  （2026-08-07 修假名時 17 頁全部誤判）
- **假名資料的三類問題要分開看**（2026-08-07 全站盤點的分類，日後沿用）：
  **A 缺 `kana` 欄位**（收藏視窗不顯示假名，`index.html` 有防呆不會壞）、
  **B 字典讀音錯**（furigana tooltip 顯示錯讀音，**真的錯**）、
  **C 字典沒收錄**（該詞沒有 tooltip，少功能不是錯）。
  §8.8 的兩道檢查會把 B 與 C 混在一起報，要另外分類才知道哪些非修不可。
  另有兩條快速判準：**讀音或 `kana` 欄位裡出現漢字一定是錯的**；
  **`kana` 欄位的拗音／促音要用小假名**（`しょうしょう` 不是 `しようしよう`）。
  修這類問題**只能改 `kana` 與字典讀音字串，`jp` 一個字都不能動**
  （動了就產生孤兒音檔），改完要程式比對 `jp` 確實零變動
- **小假名不能用樣式比對做 blanket replace**：`自由=じゆう`、`清めて=きよめて`、
  `費用=ひよう`、`使用=しよう`、`訳=やく` 都是**正確**的，誤報極高。
  也不要拿合併全站字典當 oracle 反推——合併字典本身帶著其他頁的錯。
  要用逐詞白名單，並印出全部 before/after 逐條複核
- **push 後查 Actions 要用 `head_sha` 比對本次 commit**：push 完立刻查，
  最新一筆 run 往往還是**上一顆 commit** 的（新 run 尚未排進佇列）。
  只看「最新一筆是否 completed」會誤判成已部署完成。
  本機無 `gh` CLI，改走公開 REST API：
  `https://api.github.com/repos/JP-study-list/JP-situations/actions/runs`（public repo 免認證）
- **headless Chrome 預設 `prefers-color-scheme: dark`**：驗證情境頁時若不先寫
  `localStorage.setItem('hub-dark','0')` 再重新載入，拿到的「淺色截圖」其實是深色版，
  淺色配色等於完全沒驗到。另見 §8.8 的渲染驗證方式

### 8.14 工作環境與輸出慣例
- 本專案**已納入 git 版本控制**且有 GitHub remote。
  （舊版 `CLAUDE-old.md` 記載「不使用 git、不要執行 git 指令」，已於 2026-08-06 作廢，
  改依 §4 的 ABCD 規則：可直接 commit，破壞性操作先問。）
- 每次任務結束仍**列出本次新增或修改的檔案清單**，方便使用者核對與上傳。
- 情境頁 HTML 內容很長，不在對話中貼出全文，直接寫檔。
- 結構差異無法直接套用本規範時，先說明差異與處理方式，不要靜默跳過。
- 進行大範圍修改前，先提醒使用者備份（或確認已 commit）。

