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
   └─→ (共 26 頁) ─┘
                    │
                    ├─ app.css   全部情境頁樣式（只用 var()，不定義色值）
                    ├─ app.js    共用引擎：注入骨架 HTML + 全部互動邏輯
                    └─ common.js ES module：收藏資料層 / Firebase 同步 / 回首頁鈕
                                  （index.html 與情境頁都載入）

載入順序不可調換：資料區塊 → app.js → common.js
```

---

## 核心檔案

| 檔案 | 用途 | 備註 |
|------|------|------|
| `index.html` | hub 首頁。側欄、收藏 Modal（含收藏測驗）、學習熱力圖、統計、最近瀏覽、最少複習、同步碼設定 | 自成一體，**不吃** `app.css` / `app.js`；改情境頁時常需同步改此檔的卡片與 `PAGES` |
| `app.js` | 共用引擎。骨架注入、速查表（REF）、記憶卡／測驗（STUDY）、易混（CONFUSE）、常用句（PHRASE）、furigana、語音、主題切換 | **鐵則 1：不得擅自修改**，影響全部 26 頁 |
| `app.css` | 情境頁全部樣式。顏色一律 `var(--xxx)` | **鐵則 1：不得擅自修改**；星號啟用色 `#C8A32C` 寫死於此 |
| `common.js` | 收藏 CRUD、Firestore 拉取／推送與合併、同步碼、主題偏好、standalone 回首頁鈕。掛 `window.JPHub` | **鐵則 1：不得擅自修改**；Firebase config 在此（apiKey 非密鑰） |
| `README.md` | 僅一行專案名 | 目前無實質內容 |
| `CLAUDE.md` | 開發規範 + 專案技術背景（§8） | 會 commit 上公開 repo，禁寫 secret |
| `progress.md` | 開發歷史（反向時間序） | 每次改檔即更新 |
| `project-index.md` | 本檔 | 每次改檔即同步 |

---

## 情境頁（26 頁）

`hotel.html` 是**結構範本**，新增或修改一律以它為基準。
每頁 `pageKey` 必須等於檔名主體且全站唯一（已驗證：26 頁無重複、無誤植）。

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
| `school-interview.html` | 語言學校面試（**唯一非服務業敬語頁**，見下） | school-interview |

> `school-interview.html` 是全站唯一刻意偏離 §8.5 的情境頁：
> 面試不適用服務業敬語，`staff`（老師）改用尊敬語提問、`customer`（學生）改用謙讓語應答。
> 修改此頁時**不要**套用 いらっしゃいませ／かしこまりました／くださいませ 等店家用語。

> `index.html` 的卡片 `card-title` 與 `PAGES` 的 `title` 必須完全相同，
> 否則收藏視窗的來源名稱會顯示錯誤。

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
