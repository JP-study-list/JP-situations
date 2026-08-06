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

### 8.1 檔案結構
所有檔案平放在 repo 根目錄，**沒有子資料夾**。

| 檔案 | 說明 |
|------|------|
| `index.html` | hub 首頁：卡片入口、熱力圖、統計、收藏視窗、Firebase 同步 |
| `common.js` | 共用模組：收藏資料層、雲端同步、回首頁按鈕。以 ES module 載入 |
| `app.css` | 全部情境頁樣式。顏色一律 `var(--xxx)`，**不定義任何色值** |
| `app.js` | 共用引擎：注入頁面骨架 HTML ＋ 全部互動邏輯，讀取各頁的 `PAGE_CONFIG` |
| `<情境>.html` | 各情境頁。**只含三樣東西**：配色區塊、四個資料區塊、`PAGE_CONFIG` |

`hotel.html` 是情境頁的標準範本，任何新增或修改都以它為結構基準。
詳細檔案清單與職責見 `project-index.md`。

### 8.2 鐵則
1. **不得修改 `app.js`、`app.css`、`common.js`**。這三個檔案影響全部情境頁。
   若需求必須動它們，先明確告知使用者會影響所有情境頁，取得同意後才動工。
2. 情境頁結構必須與 `hotel.html` 完全一致，不多不少：
   ```
   head：meta、title、Google Fonts、<link rel="stylesheet" href="./app.css">、<style> 配色 </style>
   body：
     <script>  四個資料區塊 ＋ PAGE_CONFIG  </script>
     <script src="./app.js"></script>
     <script type="module" src="./common.js"></script>
   ```
   載入順序不可調換：資料 → `app.js` → `common.js`。
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

### 8.4 配色規格
情境頁的 `<style>` 只做兩件事：定義 `:root` 與 `html[data-theme="dark"]`。

**app.css / app.js 需要的 14 個變數，缺一不可**（少了會造成透明區塊或方角）：
```
--primary  --bg  --card  --card-alt  --line  --ink  --ink-soft  --muted
--accent-soft  --on-accent  --r-sm  --r-md  --r-lg  --r-pill
```
另建議一併定義 `--primary-deep`、`--secondary`、`--accent` 以維持與範本一致。

圓角固定值：`--r-sm:10px`、`--r-md:16px`、`--r-lg:22px`、`--r-pill:999px`。

**深色主題基底固定不變**：
```
--bg:#1C1B1A  --card:#262423  --card-alt:#302E2C  --line:#3F3D3A
--ink:#D9D5D0  --ink-soft:#A8A39C  --muted:#7A766F
```
主色為高彩度時（例如朱紅），深色模式須提供提亮版 `--primary`，
並覆寫 `--accent-soft`（改為暗色調）與 `--on-accent`（改為淺色）。

星號啟用色 `#C8A32C` 已寫死在 `app.css`，不隨主色改變，情境頁不需處理。

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
2. **同步更新 `index.html` 的兩個地方**（只改其一會造成功能缺漏）：
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
3. 執行 §8.8 驗證清單，並更新 `project-index.md` 與 `progress.md`

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
- [ ] KANJI_READINGS：以 Python 模擬最長匹配，確認對話中漢字詞零缺漏
- [ ] 新增情境時，`index.html` 的卡片與 `PAGES` 兩處都已更新且 title 一致

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
- 無 Apps Script、無 `.env`（目前專案不需要任何機密設定）
- 本地 `backup` branch 為備份分支，勿直接推送

### 8.11 專屬 API / 資料來源
- 無外部 API。發音走瀏覽器內建 Web Speech API（`speechSynthesis`），
  依 speaker 切換不同日文音色；iOS 與桌機可用音色不同屬正常。

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
- **iOS PWA 快取**：更新 `app.js` / `app.css` 後若手機沒吃到新版，
  在情境頁的引用加版本號強制刷新（`./app.js?v=2`）
- **PWA 圖示絕對路徑**：`index.html` 與 `manifest.json` 使用
  `/JP-situations/...` 絕對路徑，這是 GitHub Pages 子路徑託管下 iOS 抓圖示的必要寫法，
  **不要改成相對路徑**
- **主題偏好**：情境頁與 hub 共用 localStorage 的 `hub-dark` 鍵
  （`'1'`=深色、`'0'`=淺色），未設定過才依系統偏好
- **圖片／檔名格式**：寫死檔名前先確認實際副檔名

### 8.14 工作環境與輸出慣例
- 本專案**已納入 git 版本控制**且有 GitHub remote。
  （舊版 `CLAUDE-old.md` 記載「不使用 git、不要執行 git 指令」，已於 2026-08-06 作廢，
  改依 §4 的 ABCD 規則：可直接 commit，破壞性操作先問。）
- 每次任務結束仍**列出本次新增或修改的檔案清單**，方便使用者核對與上傳。
- 情境頁 HTML 內容很長，不在對話中貼出全文，直接寫檔。
- 結構差異無法直接套用本規範時，先說明差異與處理方式，不要靜默跳過。
- 進行大範圍修改前，先提醒使用者備份（或確認已 commit）。

