# progress.md — 開發歷史

> 反向時間序（最新在上）。每次改檔即更新。
> 小改可精簡為「日期 + 類型 + 摘要」。

---

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
