# progress.md — 開發歷史

> 反向時間序（最新在上）。每次改檔即更新。
> 小改可精簡為「日期 + 類型 + 摘要」。

---

## 2026-08-07（日）
- 類型：修正
- 影響檔案：`.nojekyll`（新增）, `CLAUDE.md`, `project-index.md`
- 摘要：加入根目錄 `.nojekyll`，修復 GitHub Pages 連續兩次建置逾時。
- 原因：自 `8045c54` 加入 5,042 個預生成音檔後，Pages 的 build job 連續兩次跑滿
  **15 分鐘硬性逾時**被取消（run #36 / #37），線上因此停留在 `a918bfa` 附近的版本。
  根因是根目錄缺少 `.nojekyll`，Pages 會對 5,305 個 mp3 跑完整 Jekyll 逐檔處理。
- **這個失敗最難察覺的地方**：本機完全正常、`git push` 也成功，
  只有 GitHub Actions 頁面看得出來。實際線上影響是
  `immigration.html` 404、**整個 `audio/` 目錄從未上線**，
  等於前一天做的整套 Azure 語音線上一個都沒生效，全站都在跑 Web Speech 備援。
- 診斷依據：
  - #33 / #34（`bb32c23`，音檔加入前）build 皆為 40 多秒成功；
    #36 / #37 皆為 15:01 被 cancel，分水嶺正是加入音檔的那次 commit
  - 實測線上 `audio/nanami/001336b6763098d8.mp3` 與 `immigration.html` 均為 404，
    而 `index.html` / `manifest.json` / `school-interview.html` 為 200
- 驗證（修復後）：
  - run #38 build **38 秒成功**（對比先前 15 分鐘逾時）
  - 六個音色目錄各抽一檔、七個核心檔案（三個引擎檔 + 三頁 + manifest）線上全數 200
  - **端對端**：用 `app.js` 的 `audioHash` 與 `scenarioVoices` 算出 `immigration.html`
    全部 274 個播放 URL，均勻抽 15 個查線上 —— 全數 200，線上不會退回 Web Speech
  - `node tools/gen-audio.mjs --dry`：27 頁、5,305 檔、尚未生成 0 個
- 待辦/已知問題：
  - `.nojekyll` 是空檔，容易在整理檔案時被誤刪。已在 `CLAUDE.md` §8.10 與 §8.13 標註不可刪。
  - 已在 §8.8 驗證清單補上「push 後確認線上真的更新」一項，
    避免日後再次發生「本機驗證全過但線上沒更新」。

## 2026-08-07（六）
- 類型：新增
- 影響檔案：`immigration.html`（新增）, `index.html`, `audio/`（新增 263 個 mp3）,
  `CLAUDE.md`, `project-index.md`
- 摘要：新增日本入境審查情境頁（`pageKey: immigration`，主色板岩藍 `#3C5468`），
  主題為**持工作簽證入境**。收錄 4 場景 x 4 情境 x 13 句 = 208 句、50 個單字、
  6 組易混詞、335 筆假名字典。於 `index.html` 旅行區塊補卡片與 `PAGES` 項目
  （全站情境頁 26 -> 27）。
- 原因：使用者即將持工作簽證赴日，希望出發前先熟悉入境現場可能遇到的官方問答。
- 內容設計：
  - 四場景涵蓋下飛機到出關的完整動線：入国審査（基本問答／勤務先／在留期間與住所／
    指紋與臉部拍攝）-> 在留カード（當場交付／認定証明書確認／住址登記說明／
    工作內容與資格確認）-> 税関（電子申報／免稅範圍／食品與藥品／現金申報）->
    追加確認（書類不足／別室詢問／行李開箱／放行）。
  - 依使用者選擇，三個場景走順利流程、第四場景練被追問的狀況。
  - 個人背景一律用通用佔位（株式会社さくら／エンジニア／
    技術・人文知識・国際業務／新宿区／在留一年），方便日後單點替換成本人資料。
- **刻意偏離規範**：§8.5 規定 staff 用服務業敬語，但審查官是公務員不是店家。
  本頁 `speakerLabels` 為 `{ staff: "審查官", customer: "旅客" }`，
  staff 改用公務窗口口吻（〜をお願いします／〜を教えてください／
  確認させていただきます／こちらへどうぞ／ご協力ありがとうございました），
  **不使用** いらっしゃいませ／かしこまりました／くださいませ。
  已在 `project-index.md` 與 `school-interview.html` 併列加註，避免日後被誤「修正」。
- 驗證：
  - `node --check` 通過；四資料區塊齊全、無殘留引擎碼、無 emoji、script 載入順序正確
  - 配色 14 必要變數齊全，深色基底 7 色與圓角 4 值與規範完全相符；
    主色偏暗，深色模式提亮為 `#8FAAC4` 並覆寫 `--accent-soft` / `--on-accent`
  - `pageKey` 與其餘 26 頁無衝突；`defaultCat` / `defaultScene` 均存在
  - **反向重建驗證**：用字典把每句 `jp` 還原成假名再與 `kana` 逐字比對，208 句全等。
    抓到一筆漏網（`ローマ字` 未收錄，重建後殘留漢字）
  - **furigana 端對端**：直接抄 `app.js` 的 `buildFuriganaHTML` 與排序邏輯跑一遍，
    產生 514 個 furi span，未被包住的漢字 0 句
  - `index.html` 卡片與 `PAGES` 交叉比對：27 對檔名／title 完全一致，無孤兒卡片
  - headless Chrome 實跑（本機 http server）：頁面正常渲染，四場景與單字分類進入 DOM，
    DOM 結構與 `hotel.html` 同型，無 console 錯誤
  - 語音生成：263 個成功、0 失敗；`--dry` 顯示「尚未生成 0 個」
  - **端對端音檔命中**：用 `app.js` 自身的 `audioHash` 與 `scenarioVoices` 算出本頁
    全部 276 個播放 URL，逐一確認檔案存在 —— 命中率 100%，不會退回 Web Speech
- 待辦/已知問題：
  - `app.js` 註解仍寫「音檔已由 tools/gen-audio.mjs 全量生成（5,042 個）」，
    實際已是 5,305 個。因屬鐵則 1 的檔案未擅自更動，僅為過時註解，不影響行為。
  - 本頁「行って」固定讀作 いって（字典無 おこなって）。若日後新增句子需要
    「行う」系讀音，須改用「行います／行いました」形式，否則字典無法區分。
  - `audio/` 增至 5,305 個檔、約 134MB。

## 2026-08-06（五）
- 類型：重構 / 新增
- 影響檔案：`app.js`, `tools/gen-audio.mjs`（新增）, `audio/`（新增 5,042 個 mp3）,
  `voice-check.html`（新增）, `.gitignore`（新增）, `.env.example`（新增）,
  26 個情境頁（僅改 script 引用）, `project-index.md`
- 摘要：語音層從瀏覽器 Web Speech 改為 **Azure Neural TTS 預生成音檔**，
  並從單一「店員女聲／客人男聲」擴充為 **6 音色、每個情境輪替配對**。
  - 新增 `tools/gen-audio.mjs`：以 `node:vm` 求值各情境頁的第一個 script 取出資料，
    呼叫 Azure REST TTS 批次生成，輸出 `audio/<音色>/<hash>.mp3`。
    支援 `--dry`（只統計）、`--sample`（試聽）、`--tier=s0`（付費層提速）、斷點續傳、孤兒回報。
  - `app.js` 播放層改為 audio-first，Web Speech 降為 fallback（音檔 404 或載入失敗時接手）。
  - 順帶修正 Web Speech 本身：**移除 pitch 位移**（原本 staff 1.15／customer 0.85，
    是「聽起來像機器人」的主因）、音色改用品質評分排序、性別判斷改用真實語音名稱對照表
    （原本的 `/female|女|f\b/` regex 命中率為零，實際是隨機取 `voices[0]`／`[1]`）。
- 原因：使用者反映全站對話語音機械化，且整站只有兩個聲音。
- 關鍵設計決定（皆有實測依據，勿隨意改動）：
  - **檔名用內容 hash**（`audio/<音色>/<16位hex>.mp3`）：同一句話跨情境頁自動共用，
    新增情境頁時已存在的句子不必重新生成。實測 5,741 個引用去重成 5,042 個檔。
  - **hash 用同步的 FNV-1a 變體，不用 `crypto.subtle`**：後者是非同步的，而 iOS Safari 要求
    `audio.play()` 必須在使用者手勢的同步呼叫堆疊內，`await` 之後會失去手勢授權而靜音。
  - **全站共用同一個 `<audio>` 元素**：iOS 只信任被手勢解鎖過的那一個，換句子只換 `src`。
  - **播放世代編號 `audioToken`**：切歌造成的 `AbortError` 不可被誤判成「檔案不存在」。
  - **`AUDIO_ENABLED` 開關**：音檔尚未生成時設 false，否則每次播放要先吃一個 404 才 fallback。
  - `scenarioVoices(pageKey, sceneKey, scenarioIndex)` 在 `app.js` 與 `gen-audio.mjs`
    **各有一份完全相同的實作**，任一邊改動都必須同步，否則組出的檔名對不上。
- 驗證：
  - `node --check app.js` 通過
  - hash 一致性：Node 與瀏覽器兩份實作比對 288 筆全等；全站 4,865 句零碰撞
  - `scenarioVoices` 一致性：240 組情境兩邊完全相符，涵蓋全部 18 種配對組合
  - 生成：5,000 成功、0 失敗；產出 5,042 檔，無零位元組或異常小檔
  - **端對端驗證**（最關鍵）：用 `app.js` 自己的程式碼算出 26 頁全部 5,741 個播放 URL，
    逐一確認檔案存在 —— 全數命中，沒有任何一句會退回 Web Speech
  - 使用者實機確認：單句播放、全部播放、跨情境換人聲、單字固定音色，皆正常
- 待辦/已知問題：
  - `audio/` 佔 **116MB**（5,042 檔，平均 23.5KB，24kHz/48kbps 單聲道 mp3）。
    GitHub Pages 站台上限 1GB，無虞，但 clone 會變慢。
  - **新增情境頁後必須補跑 `node tools/gen-audio.mjs`**，否則該頁會退回 Web Speech。
  - 音色池刻意排除 `aoi`（葵），使用者試聽後不喜歡；設定仍保留在 `VOICE_IDS` 以便改回。
  - HD 音色 `ja-JP-Sakura` / `ja-JP-Haruto`（MAI-Voice-2-Flash）在 F0 免費層回 502，
    需付費層才能用。
  - `voice-check.html` 是診斷用工具頁，非情境頁，不在 `index.html` 掛入口，可隨時刪除。

## 2026-08-06（四）
- 類型：新增
- 影響檔案：school-interview.html（新增）, index.html, project-index.md
- 摘要：新增語言學校面試情境頁（`pageKey: school-interview`，主色靛藍 `#3F3A70`），
  收錄 4 場景 x 4 情境 x 14 句 = 224 句面試問答、56 個單字、6 組敬語易混、518 筆假名字典。
  於 `index.html` 旅行區塊補卡片與 `PAGES` 項目（全站情境頁 25 -> 26）。
- 原因：使用者即將參加線上語言學校面試，需要針對真實背景演練可能的提問。
- **刻意偏離規範**：§8.5 規定 staff 用服務業敬語，但面試情境完全不適用。
  本頁 `speakerLabels` 改為 `{ staff: "老師", customer: "學生" }`，
  老師端用尊敬語提問（〜されていますか／ご〜／教えてください），
  學生端用謙讓語應答（〜と申します／〜ております／〜と考えております）。
  已在 `project-index.md` 情境頁表格加註，避免日後被誤「修正」回店家用語。
- 驗證：
  - `node --check` 通過；四資料區塊齊全、無殘留引擎碼（sort／buildFurigana／三個狀態宣告）
  - 配色 14 必要變數齊全，深色基底 7 色與圓角 4 值與規範完全相符
  - `pageKey` 與其餘 25 頁無衝突；`defaultCat: interview`／`defaultScene: intro` 均存在
  - KANJI_READINGS：以最長匹配模擬，224 句漢字零缺漏
  - **反向重建驗證**（新做法）：用字典把每句 `jp` 還原成假名再與 `kana` 欄位逐字比對，
    224 句全等。此法抓到覆蓋率檢查抓不到的錯誤（`母は` 應讀 ははは，原本漏一個 は）
  - `index.html` 卡片與 `PAGES` 交叉比對：26 對檔名／title 完全一致，無孤兒卡片
  - headless Chrome 實跑：深淺兩色模式渲染正常、四場景與對話內容進入 DOM、無 console 錯誤
- 待辦/已知問題：
  - 內容含三處佔位資料，使用者需自行替換為本人資訊：姓名（林）、出身地（台北）、
    面試官姓氏（佐藤）。其餘背景（材料資源工學、補習班數學講師、鎌倉親戚、
    J-POP 動機、經費自付＋父母資助）皆為使用者實際情況。
  - 「行って」在本頁固定讀作 おこなって；若日後新增句子需要 いって，
    請改用「行きます／行きました」形式，否則字典無法區分。

## 2026-08-06（三）
- 類型：修正
- 影響檔案：manifest.json（新增）, CLAUDE.md, project-index.md
- 摘要：補回缺失的 `manifest.json`。`start_url` / `scope` / `icons.src` 全用
  `/JP-situations/...` 絕對路徑，`display: standalone`，theme_color 對齊
  `index.html` 的 `<meta name="theme-color">`（`#1f3a5f`）。
- 原因：`index.html:7` 引用了此檔但它從未進入 repo，線上 404，PWA metadata 失效。
- 驗證：JSON 可解析；icons 宣告尺寸與實際 PNG 尺寸相符（192x192 / 512x512）。

## 2026-08-06（二）
- 類型：新增
- 影響檔案：electronics-store.html, index.html
- 摘要：新增家電量販店情境頁（`pageKey: electronics-store`，shape 分生活／廚房／影音家電），
  並在 `index.html` 買い物區塊補卡片與 `PAGES` 項目。
- 原因：補齊買い物類情境。
- 驗證：`node --check` 通過；四個資料區塊齊全、無殘留引擎碼；
  `defaultCat: appliance` 與 `defaultScene: consult` 皆存在；卡片 title 與 PAGES title 一致。

## 2026-08-06（一）
- 類型：重構 / 文件
- 影響檔案：CLAUDE.md, project-index.md（新增）, progress.md（新增）, CLAUDE-old.md（刪除）
- 摘要：執行專案初始化自舉。將 `CLAUDE-old.md` 的全部專案規範（檔案結構、鐵則、
  PAGE_CONFIG／配色／資料內容規格、新增情境流程、遷移流程、驗證清單、已知注意事項）
  整合進 `CLAUDE.md` §8，並補齊 Firebase、部署、資料源、自動化欄位；
  建立 `project-index.md` 與本檔。
- 原因：統一為單一規範檔，避免兩份文件並存分歧。
- 待辦/已知問題：
  - 舊規範「本機不使用 git、不要執行 git 指令」已作廢（repo 已有 git 與 GitHub remote），
    改依 `CLAUDE.md` §4 ABCD 規則。

---

<!-- 以下為初始化前的既有歷史，由 git log 摘錄，僅供對照 -->

## 更早（git log 摘錄）
- `e38bb7b` 加入電車（`train-subway.html`）
- `5fa2a9f` 修正四頁的 pageKey 與檔名一致
- `4c9d28a` Add files via upload
- `b31d72d` Update taxi.html
- `3081487` Update sushi.html
