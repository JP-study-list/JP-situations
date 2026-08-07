# project-index.md — 專案檔案索引

> JP-situations：日文情境學習工具集。純靜態、共用引擎架構、無框架無建置工具。
> 規範見 `CLAUDE.md`（§8 為本專案技術背景）。開發歷史見 `progress.md`。
> 檔案新增／刪除／職責變動時，**同步更新本檔**。

---

## 後續規劃（新 session 開場先讀這段）

> 本區塊是**跨輪次的決策與待辦總表**，不隨單次任務失效。
> `progress.md` 的啟動 SOP 只讀最新 3~5 筆，舊決策會被推出讀取範圍，故集中放這裡。
> 完成任一項時，把該列從本區塊移除，並在 `progress.md` 記錄。

### 一、待新增的三個情境頁（使用者已選定的路線圖）

`city-hall.html`（2026-08-07）製作時已先問過使用者後續方向，並**刻意留下單字不收**，
把這些字讓給下列三頁當主場。做這三頁時**沿用此分工**，不要回頭改 `city-hall.html`。

| 待做頁面 | `city-hall.html` 已預留（刻意不收進 VOCAB）的字 |
|---------|--------------------------------------------|
| 手機門號契約 | 携帯電話番号、料金プラン |
| 醫院看診與健保 | 受診、診察券、処方箋、三割負担（`city-hall` 的健保只收「加入端」） |
| 打工面試與資格外活動 | アルバイト、シフト、週二十八時間 |

補充：
- 這些詞**照樣出現在 `city-hall.html` 的對話句子裡**，只是不佔單字卡，不算漏。
- 「資格外活動許可」的申請與條件已併入 `student-immigration.html` 第二場景
  （對話量約 10 句，撐不起獨立一頁）。做打工面試頁時軸心要放在**面試本身**，
  不要重做許可申請流程。
- 新增頁一律走 `CLAUDE.md` §8.6 的完整流程（含 `index.html` 三處、補跑 `gen-audio.mjs`）。

### 二、待處理的既有問題（都不是本輪造成的，需使用者決定是否另開一輪）

| # | 問題 | 規模 | 影響 |
|---|------|------|------|
| 1 | **假名 A 類：缺 `kana` 欄位** | 290 句（`car-rental` 98、`yakiniku` 192） | 收藏視窗不顯示假名。`index.html` 有防呆，不會壞 |
| 2 | **假名 B' 類：字典與 `kana` 同錯** | 已確認 6 頁（見下） | furigana **顯示錯讀音**，真的錯；`sushi` 那筆連單字卡都錯 |
| 3 | **假名 C 類：字典未收錄** | 1,304 句、20 頁 | 該詞沒有 tooltip，是少功能不是顯示錯誤 |
| 4 | 常用句分頁**橫向溢出** | `shrine` / `sushi` / `starbucks` 三頁 | scrollWidth 458 / 440 / 471 對 clientWidth 430。修改前後數值相同，屬既有版面問題 |
| 5 | `butcher.html` 三方對話的引擎限制 | 該頁 `staffB` 32 句 | `app.js` 說話者篩選列寫死兩方（「只看店員」不含店員B）；`audioVoiceDir` 對非 staff/customer 一律退回 `WORD_VOICE`，故 staffB 固定 nanami。屬鐵則 1 範圍，要動 `app.js` |

**關於 #2（2026-08-08 查證，優先度最高）**

2026-08-07（六）那輪修掉的 B 類（52 -> 0）是靠 `CLAUDE.md` §8.8 的第 2 道檢查
（用字典把 `jp` 反向重建成假名、與 `kana` 欄比對）抓出來的。
**這道檢查有一個結構性盲區：當字典讀音與 `kana` 欄位錯得一模一樣時，反向重建會完全吻合。**
所以 2026-08-07（五）合併字典時發現的跨頁衝突，有一批**至今仍未修**：

| 頁 | 詞 | 現況 | 應為 | 是否對使用者可見 |
|----|----|------|------|----------------|
| `sushi.html` | 小さめ | `こさめ` | `ちいさめ` | **字典 + 2 句 + VOCAB `シャリ小さめ`=`しゃりこさめ`（速查表與單字卡直接顯示）** |
| `butcher.html` | 本日入荷した / 今朝入荷した | `ほんじついにゅうしたした` / `けさいにゅうした` | `ほんじつにゅうかした` / `けさにゅうかした` | 字典 2 條 + 3 句（前者還多了一個「した」） |
| `italian.html` | 入荷 / 本日入荷したばかり | `いっか` | `にゅうか` | 字典 2 條 + 1 句 |
| `italian.html` | 三千円 | `さんせんえん` | `さんぜんえん` | 字典 + 1 句 |
| `izakaya.html` | 入荷 | `いっか` | `にゅうか` | 字典 + 1 句 |
| `directions.html` | 無事 | `むじ` | `ぶじ` | 字典 + 1 句 |
| `izakaya.html` | 少なめ | `すこなめ` | `すくなめ` | 僅字典（該頁無此詞的句子），暫時看不到但仍應修 |
| `hotel.html` | 三千円 | `さんせんえん` | `さんぜんえん` | 僅字典（該頁無此詞的句子），暫時看不到但仍應修 |
| `shrine.html` | フラッシュをお控えください | 句 `kana` 作 `…おこんかいください` | `…おひかえください` | 1 句。字典只收了「フラッシュ**は**お控えください」（且重複兩條），句子用的是「を」故沒吃到 |

對照組（**這些是對的，不要誤改**）：`pharmacy` / `pokemon-card` / `greengrocer` / `bakery`
的 `入荷` 皆為 `にゅうか`；`ramen` / `starbucks` 的 `少なめ` 皆為 `すくなめ`；
`clothing` 的 `小さめ` 為 `ちいさめ`、`無地` 為 `むじ`（與 `無事` 不同字）。

要修時新增第 3 道檢查：**拿正確的頁當 oracle，跨頁比對同一個詞的讀音是否一致**
（`pharmacy` 的 `入荷=にゅうか` 對上 `izakaya` 的 `いっか` 就會跳出來）。
修法一樣**只能改 `kana` 與字典讀音字串，`jp` 一個字都不能動**，
改完程式比對 `jp` 零變動即可確認音檔不受影響（見 `CLAUDE.md` §8.13）。

### 三、已定案、不要再回頭改的事

- `bank-account.html` 與 `city-hall.html` **刻意重疊 5 個字**（住民登録／転入届／区役所／
  住民票／マイナンバーカード）。使用者已裁定 `bank-account.html` 一個字不動。
- `bank-account.html` 舊句仍提及 2020 年已廢止的**通知カード**，屬既有內容，不回頭改。
- `immigration.html`（工作簽）與 `student-immigration.html`（留學）**兩條簽證路線並存**，
  勿合併。`bank-account.html` 與 `post-office.html` 的金融內容亦為刻意分工，勿互相補齊。
- 任何已上線頁的**檔名與 `pageKey` 一律不可改**（收藏 key 會失聯），
  改稱呼只動三處顯示標題。

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
   └─→ (共 30 頁) ─┘
                    │
                    ├─ app.css   全部情境頁樣式（只用 var()，不定義色值）
                    ├─ app.js    共用引擎：注入骨架 HTML + 全部互動邏輯
                    │              └─→ audio/<音色>/<hash>.mp3   預生成語音
                    └─ common.js ES module：收藏資料層 / Firebase 同步 / 回首頁鈕
                                  （**只有情境頁載入**；index.html 自帶一份 inline 同步邏輯）

載入順序不可調換：資料區塊 → app.js → common.js
情境頁引用 app.js 與 app.css 時都帶版本號（`./app.js?v=2`、`./app.css?v=2`），
避免 iOS PWA 吃到舊快取。改動任一檔，30 頁的對應版本號要一起進版
```

## 視覺風格（2026-08-07 起：暖簾 / Noren）

取材自日本實體設計語彙，刻意迴避 AI 生成 UI 的典型特徵
（紫藍漸層、玻璃擬態、大圓角配柔影、置中英雄區、emoji 圖示、Tailwind 色階）。

- **暖簾色帶**：頂欄／側欄標頭／收藏視窗標頭，底緣以 CSS mask 做出裂口垂片
- **商店街首頁**：30 張卡片各有專屬日本傳統色與線稿圖示，
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
| `app.js` | 共用引擎。骨架注入、速查表（REF）、記憶卡／測驗（STUDY）、易混（CONFUSE）、常用句（PHRASE）、furigana、語音、主題切換 | **鐵則 1：不得擅自修改**，影響全部 30 頁。語音層見下方「語音系統」 |
| `app.css` | 情境頁全部樣式（**暖簾風格**，2026-08-07 改版）。主色取自各頁 `--primary`，衍生色以 `color-mix()` 推導 | **鐵則 1：不得擅自修改**；語意色 `--ok` 鶯／`--ng` 紅梅／`--mark` 山吹（收藏星號）寫死於此。需 iOS 16.4+ |
| `common.js` | 收藏 CRUD、Firestore 拉取／推送與合併、同步碼、主題偏好、standalone 回首頁鈕（暖簾造型）。掛 `window.JPHub` | **鐵則 1：不得擅自修改**；Firebase config 在此（apiKey 非密鑰）。**只有情境頁載入，`index.html` 不載入**——hub 有自己的 inline Firebase module，兩邊各一份同步邏輯 |
| `tools/gen-audio.mjs` | 語音生成腳本。抽取 30 頁資料 → 呼叫 Azure Neural TTS → 產出 `audio/` | 只在本機跑，不隨頁面載入。**新增情境頁後必須補跑** |
| `voice-check.html` | 診斷工具頁：列出裝置上的日文語音、品質評分、性別判定，可試聽 | 非情境頁，不掛 `index.html` 入口，可隨時刪除 |
| `.nojekyll` | 空檔。讓 GitHub Pages 跳過 Jekyll，直接打包靜態檔 | **不可刪**。少了它，Pages 會對 5,798 個音檔逐檔跑 Jekyll，build 撐不過 15 分鐘逾時，線上會靜靜停在舊版本 |
| `.gitignore` | 保護 `.env`、`node_modules/` 等 | `.env.example` 刻意不忽略 |
| `.env.example` | Azure 金鑰設定範本 | 實際的 `.env` 絕不進 git（見 `CLAUDE.md` §4 規則 D） |
| `README.md` | 僅一行專案名 | 目前無實質內容 |
| `CLAUDE.md` | 開發規範 + 專案技術背景（§8） | 會 commit 上公開 repo，禁寫 secret |
| `progress.md` | 開發歷史（反向時間序） | 每次改檔即更新 |
| `project-index.md` | 本檔 | 每次改檔即同步 |

---

## 情境頁（30 頁）

`hotel.html` 是**結構範本**，新增或修改一律以它為基準。
每頁 `pageKey` 必須等於檔名主體且全站唯一（已驗證：30 頁無重複、無誤植）。

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

### 日本在住者（6）
> 2026-08-07 新增的第四個分類，收在住日本者會遇到的情境（非觀光客視角）。
> `school-interview` / `immigration` / `post-office` 由「旅行」移入，頁面內容一字未改；
> `bank-account`、`student-immigration` 與 `city-hall` 為本分類原生新增。
> 排列順序即留學生落地後的實際動線：面試 → 入境 → 區公所 → 開戶 → 郵局
> （區公所必須排在開戶之前：開戶要用住民票）。

| 檔案 | 標題 | pageKey |
|------|------|---------|
| `school-interview.html` | 語言學校面試（**非服務業敬語頁**，見下） | school-interview |
| `student-immigration.html` | 留學生入境（**非服務業敬語頁**，見下） | student-immigration |
| `immigration.html` | 工作簽入境（**非服務業敬語頁**，見下） | immigration |
| `city-hall.html` | 區公所（**唯一的 5 場景頁**，**非服務業敬語頁**，見下） | city-hall |
| `bank-account.html` | 銀行開戶 | bank-account |
| `post-office.html` | 郵局 | post-office |

> **`city-hall.html` 是全站唯一的 5 場景頁**（住民登録／マイナンバー／保険と年金／
> 困った時／印鑑登録，20 情境 269 句）。經使用者決定偏離 `CLAUDE.md` §8.5 的「4 場景」，
> **引擎不需修改**：`buildSceneTabs` 對 `PHRASE_KEYS` 動態迭代、`.scene-tabbar` 是
> `flex-wrap: wrap`，實測換成兩行且無橫向溢出。VOCAB 仍是 4 分類 48 字。
>
> **與 `bank-account.html` 有 5 個字刻意重疊**（住民登録／転入届／区役所／住民票／
> マイナンバーカード）。這是使用者的決定：這頁才是這些字的主場，
> `bank-account.html` 一個字不動（改既有頁會產生孤兒音檔並讓該頁收藏失聯）。
> 六組易混詞則全部不同，且新頁刻意用**更深的字**分工：転居届／転出届／世帯主／続柄／
> 個人番号通知書／資格確認書／資格取得届／学生納付特例／実印／認印／コンビニ交付。
>
> **VOCAB 依後續路線圖預留**（使用者選定的三條後續線）：不收 携帯電話番号・料金プラン
> （留給手機門號頁）、健保只收「加入端」不收 受診・診察券・処方箋（留給醫院看診頁）、
> 不收 アルバイト・シフト・週二十八時間（留給打工面試頁）。日後做這三頁時沿用此分工。
> **這條分工同時登記在本檔開頭的「後續規劃」§一，兩處需同步。**
>
> **兩處刻意保守**：手數料與時程一律寫「〜ほどです／自治体によって異なります」，
> 不寫死會過期或因地而異的規則；個人編號的紙本一律用**個人番号通知書**，
> 不用已於 2020 年廢止的**通知カード**（`bank-account.html` 舊句仍有提及，不回頭改）。

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

> `school-interview.html`、`immigration.html`、`student-immigration.html`、
> `city-hall.html` 是刻意偏離 §8.5 的四頁：
> - 面試不適用服務業敬語，`staff`（老師）改用尊敬語提問、`customer`（學生）改用謙讓語應答。
> - 兩頁入境的 `staff` 是公務員不是店家，用「〜をお願いします／〜を教えてください／
>   確認させていただきます／こちらへどうぞ／ご協力ありがとうございました」。
>   `immigration.html` 的稱呼是「審查官／旅客」，`student-immigration.html` 是
>   「職員／留學生」（後者橫跨入国審査、在留カード交付與税関三種窗口，故用泛稱）。
> - `city-hall.html` 的 `staff` 是區公所職員（公務窗口），稱呼同為「職員／留學生」。
>   語體比入管稍軟，用「〜をお願いします／ご記入ください／確認いたします／
>   恐れ入りますが／〜でございます」，但一樣不用店家用語。
>
> 修改這四頁時**不要**套用 いらっしゃいませ／かしこまりました／くださいませ 等店家用語。

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
