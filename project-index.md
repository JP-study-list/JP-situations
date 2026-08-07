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
   └─→ (共 29 頁) ─┘
                    │
                    ├─ app.css   全部情境頁樣式（只用 var()，不定義色值）
                    ├─ app.js    共用引擎：注入骨架 HTML + 全部互動邏輯
                    │              └─→ audio/<音色>/<hash>.mp3   預生成語音
                    └─ common.js ES module：收藏資料層 / Firebase 同步 / 回首頁鈕
                                  （**只有情境頁載入**；index.html 自帶一份 inline 同步邏輯）

載入順序不可調換：資料區塊 → app.js → common.js
情境頁引用 app.js 與 app.css 時都帶版本號（`./app.js?v=2`、`./app.css?v=2`），
避免 iOS PWA 吃到舊快取。改動任一檔，29 頁的對應版本號要一起進版
```

## 視覺風格（2026-08-07 起：暖簾 / Noren）

取材自日本實體設計語彙，刻意迴避 AI 生成 UI 的典型特徵
（紫藍漸層、玻璃擬態、大圓角配柔影、置中英雄區、emoji 圖示、Tailwind 色階）。

- **暖簾色帶**：頂欄／側欄標頭／收藏視窗標頭，底緣以 CSS mask 做出裂口垂片
- **商店街首頁**：29 張卡片各有專屬日本傳統色與線稿圖示，
  對照表在 `index.html` 檔尾的 `SCENE`（新增情境頁時要補一筆，未登記者退回預設藍鼠）
- **對話分鏡**：店員＝實色方角氣泡＋左尖角；客人＝描邊圓角氣泡＋右尖角（形狀不同，不只顏色不同）；
  說話者標牌為**縱書**，保留完整稱呼
- **字體**：標題與日文用明朝（`Noto Serif JP`），中文內文用黑體（`Noto Sans TC`）
- **動態**：進場 stagger、按壓 scale、答對脈衝／答錯 shake、星號 pop、測驗進度條。
  只用 transform / opacity，並包 `prefers-reduced-motion`
- **深色**：暖簾不調暗，改為「深底＋亮字＋亮細邊」的夜間招牌，由 `color-mix()` 自動推導

---

## 核心檔案

| 檔案 | 用途 | 備註 |
|------|------|------|
| `index.html` | hub 首頁。暖簾頁首、商店街卡片、側欄（收束列）、收藏 Modal（含收藏測驗）、學習熱力圖、統計、最近瀏覽、最少複習、同步碼設定 | 自成一體，**不吃** `app.css` / `app.js`；改情境頁時常需同步改此檔的卡片、`PAGES` 與檔尾的 `SCENE` 場景色／圖示表 |
| `app.js` | 共用引擎。骨架注入、速查表（REF）、記憶卡／測驗（STUDY）、易混（CONFUSE）、常用句（PHRASE）、furigana、語音、主題切換 | **鐵則 1：不得擅自修改**，影響全部 29 頁。語音層見下方「語音系統」 |
| `app.css` | 情境頁全部樣式（**暖簾風格**，2026-08-07 改版）。主色取自各頁 `--primary`，衍生色以 `color-mix()` 推導 | **鐵則 1：不得擅自修改**；語意色 `--ok` 鶯／`--ng` 紅梅／`--mark` 山吹（收藏星號）寫死於此。需 iOS 16.4+ |
| `common.js` | 收藏 CRUD、Firestore 拉取／推送與合併、同步碼、主題偏好、standalone 回首頁鈕（暖簾造型）。掛 `window.JPHub` | **鐵則 1：不得擅自修改**；Firebase config 在此（apiKey 非密鑰）。**只有情境頁載入，`index.html` 不載入**——hub 有自己的 inline Firebase module，兩邊各一份同步邏輯 |
| `tools/gen-audio.mjs` | 語音生成腳本。抽取 29 頁資料 → 呼叫 Azure Neural TTS → 產出 `audio/` | 只在本機跑，不隨頁面載入。**新增情境頁後必須補跑** |
| `voice-check.html` | 診斷工具頁：列出裝置上的日文語音、品質評分、性別判定，可試聽 | 非情境頁，不掛 `index.html` 入口，可隨時刪除 |
| `.nojekyll` | 空檔。讓 GitHub Pages 跳過 Jekyll，直接打包靜態檔 | **不可刪**。少了它，Pages 會對 5,798 個音檔逐檔跑 Jekyll，build 撐不過 15 分鐘逾時，線上會靜靜停在舊版本 |
| `.gitignore` | 保護 `.env`、`node_modules/` 等 | `.env.example` 刻意不忽略 |
| `.env.example` | Azure 金鑰設定範本 | 實際的 `.env` 絕不進 git（見 `CLAUDE.md` §4 規則 D） |
| `README.md` | 僅一行專案名 | 目前無實質內容 |
| `CLAUDE.md` | 開發規範 + 專案技術背景（§8） | 會 commit 上公開 repo，禁寫 secret |
| `progress.md` | 開發歷史（反向時間序） | 每次改檔即更新 |
| `project-index.md` | 本檔 | 每次改檔即同步 |

---

## 情境頁（29 頁）

`hotel.html` 是**結構範本**，新增或修改一律以它為基準。
每頁 `pageKey` 必須等於檔名主體且全站唯一（已驗證：29 頁無重複、無誤植）。

以下四個分類與**表內順序，皆與 `index.html` 的區塊及卡片排列完全一致**（2026-08-07 對齊）。
分類只是 `index.html` 的視覺分區，`PAGES` 與檔尾 `SCENE` 都不分類，移動卡片時兩者不需改動。

### 飲食（6）
| 檔案 | 標題 | pageKey |
|------|------|---------|
| `izakaya.html` | 居酒屋 | izakaya |
| `italian.html` | 義大利餐廳 | italian |
| `ramen.html` | 拉麵店 | ramen |
| `gyudon.html` | 牛丼 | gyudon |
| `sushi.html` | 高級壽司店 | sushi |
| `yakiniku.html` | 燒肉店 | yakiniku |

### 買い物（9）
| 檔案 | 標題 | pageKey |
|------|------|---------|
| `butcher.html` | 肉舖 | butcher |
| `pharmacy.html` | 藥局 | pharmacy |
| `konbini.html` | 日本超商 | konbini |
| `bakery.html` | 麵包店 | bakery |
| `starbucks.html` | 星巴克 | starbucks |
| `pokemon-card.html` | 寶可夢卡店 | pokemon-card |
| `greengrocer.html` | 蔬菜店 | greengrocer |
| `clothing.html` | 服飾／試穿 | clothing |
| `electronics-store.html` | 家電量販店 | electronics-store |

### 旅行（9）
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

### 日本在住者（5）
> 2026-08-07 新增的第四個分類，收在住日本者會遇到的情境（非觀光客視角）。
> `school-interview` / `immigration` / `post-office` 由「旅行」移入，頁面內容一字未改；
> `bank-account` 與 `student-immigration` 為本分類原生新增。

| 檔案 | 標題 | pageKey |
|------|------|---------|
| `school-interview.html` | 語言學校面試（**非服務業敬語頁**，見下） | school-interview |
| `student-immigration.html` | 留學生入境（**非服務業敬語頁**，見下） | student-immigration |
| `immigration.html` | 工作簽入境（**非服務業敬語頁**，見下） | immigration |
| `bank-account.html` | 銀行開戶 | bank-account |
| `post-office.html` | 郵局 | post-office |

> **兩頁入境是刻意並存的兩條簽證路線，勿合併**：
> - `student-immigration.html`：在留資格「留学」。軸心是**經費支弁者、學校照會、
>   資格外活動許可、別送品**，並收了「聽不懂時請求通譯」一個情境。
> - `immigration.html`：就労ビザ。軸心是勤務先、雇用契約、技術・人文知識・国際業務。
>
> 兩頁的 VOCAB **零重疊**（新頁 48 字全部避開舊頁那 48 字），CONFUSE 六組也全部不同。
> 唯一同主題的是税関的「食品與藥品」，句子全部重寫（新頁角度是從台灣帶來的常備藥與食物）。
>
> **`immigration.html` 的檔名與 `pageKey` 絕對不可改**（2026-08-07 只改了顯示標題）：
> 收藏 key 是 `` `immigration.html::word::…` ``，存在 localStorage 與 Firestore，
> 改檔名會讓既有收藏全部失聯。要改稱呼只動三處顯示標題
> （`PAGE_CONFIG.title`、`index.html` 的 `card-title` 與 `PAGES.title`）。

> `bank-account.html` 與 `post-office.html` 內容**刻意分工，勿合併也勿互相補齊**：
> `post-office.html` 的「郵局金融服務」場景已有一個 13 句的「開設帳戶」情境，
> 屬於淺層流程；`bank-account.html` 走的是**留學生開戶的資料準備與卡關應對**，
> 16 個情境 210 句。新增或修改任一頁時，`bank-account.html` 的 VOCAB
> **刻意避開** `post-office.html` 「郵局金融（ゆうちょ）」那 14 個字
> （口座／口座番号／暗証番号／キャッシュカード／通帳／振込／預金／残高／本人確認書類…），
> 唯一相近的是「本人確認」對上「本人確認書類」（動作 vs 文件，用法不同，刻意各留一個）。

> `school-interview.html`、`immigration.html`、`student-immigration.html`
> 是刻意偏離 §8.5 的三頁：
> - 面試不適用服務業敬語，`staff`（老師）改用尊敬語提問、`customer`（學生）改用謙讓語應答。
> - 兩頁入境的 `staff` 是公務員不是店家，用「〜をお願いします／〜を教えてください／
>   確認させていただきます／こちらへどうぞ／ご協力ありがとうございました」。
>   `immigration.html` 的稱呼是「審查官／旅客」，`student-immigration.html` 是
>   「職員／留學生」（後者橫跨入国審査、在留カード交付與税関三種窗口，故用泛稱）。
>
> 修改這三頁時**不要**套用 いらっしゃいませ／かしこまりました／くださいませ 等店家用語。

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

- 共 5,798 個檔（24kHz / 48kbps 單聲道 mp3，約 140MB）
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
全站目前 106,924 字元，單月額度綽綽有餘。

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
- **push 成功不等於上線**：要確認 Actions 的 `pages build and deployment` 也成功。
  build 失敗時線上會停在舊版本，本機與 git 都看不出異狀（2026-08-07 踩過，見 `progress.md`）
