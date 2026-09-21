# 投影片學習網（Slide Study）v2

純靜態、單一 HTML 檔的投影片瀏覽 + 筆記網站，放上 GitHub Pages 就能用。
**多章節**、全螢幕、縮放、翻頁跳頁、投影片手繪標註、獨立白板、筆記匯出入、載入進度顯示，
桌機與手機通用，並內建 Facebook 分享縮圖（Open Graph）。

```
slide-study-site/
├── index.html              ← 全部程式都在這裡（不依賴任何外部套件）
├── chapters.json           ← 章節與投影片清單（由腳本產生）
├── make_slides_json.py     ← 掃描 slides/ 產生 chapters.json、順便寫好 FB 分享設定
├── .nojekyll
└── slides/
    ├── ch01-intro/
    │   ├── chapter.md      ← 這一章的標題與簡介
    │   ├── slide-001.png
    │   └── ...
    ├── ch02-model-runner/
    │   ├── chapter.md
    │   └── slide-001.png ...
    └── ch03-deploy/ ...
```

> 只有一章也可以：直接把 PNG 放在 `slides/` 底下（章節選單會自動隱藏）。

---

## 一、放投影片與寫章節資訊

1. 每一章開一個資料夾放在 `slides/` 底下，**資料夾名稱就是網址參數**（建議用英數與 `-`，例如 `ch02-model-runner`）。
2. 每個資料夾裡放一個 `chapter.md`：

```markdown
---
title: 第二章 Model Runner 的角色
order: 2
---
本章說明 Ollama Server 如何啟動並維護 Model Runner。

- 權重載入與 VRAM 配置
- KV Cache 與 Context Window
- `Quantization` 的取捨

> 課前請先安裝 Ollama。
```

- `---` 區塊可省略；省略時會把第一行的 `# 標題` 當作章節標題。
- `order` 決定章節順序（沒寫就依資料夾名稱自然排序）。`id` 可覆寫網址參數用的代號。
- 簡介支援標題、清單、粗體、行內程式碼、程式區塊、引用、連結、分隔線。
- 簡介會顯示在「章節目錄」卡片與上方「簡介」視窗（`I` 鍵）。

3. 產生清單：

```bash
python3 make_slides_json.py --site "Ollama LLM Server 課程"
```

加 `--rename` 會把每章資料夾內的圖片依自然排序統一改名為 `slide-001.png…`：

```bash
python3 make_slides_json.py --rename --site "Ollama LLM Server 課程"
```

沒有章節資料夾時可先建範例：`python3 make_slides_json.py --init`

---

## 二、上傳到 GitHub Pages

```bash
cd slide-study-site
git init && git add . && git commit -m "投影片學習網"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

GitHub repo → **Settings → Pages** → Source `Deploy from a branch`、Branch `main` / `(root)` → Save。
一兩分鐘後網站上線於 `https://USERNAME.github.io/REPO/`。

---

## 三、Facebook 縮圖（第一張投影片）

網址確定後執行一次：

```bash
python3 make_slides_json.py \
  --base-url https://USERNAME.github.io/REPO/ \
  --site "Ollama LLM Server 課程"
git commit -am "設定 FB 分享資訊" && git push
```

腳本會把 `index.html` 的 `og:image`（第一章第一張投影片的完整網址）、`og:url`、`og:title`
與圖片長寬一併寫好。最後到 <https://developers.facebook.com/tools/debug/> 貼上網址按
**Scrape Again**（一定要做，否則 FB 會用舊快取）。

> 注意：`og:image` 是整個網站共用一張（第一章第一頁）。Facebook 不會針對 `?ch=` 參數
> 顯示不同縮圖，因為它只抓 HTML 裡的 meta 標籤。若某一章想要專屬縮圖，
> 可複製一份 `index.html` 成 `ch02.html` 並改掉它的 `og:image`。

---

## 四、網址參數

| 網址 | 行為 |
|---|---|
| `index.html` | 開啟第一章，並自動彈出「章節目錄」 |
| `index.html?ch=ch02-model-runner` | 直接開啟該章第 1 頁 |
| `index.html?ch=ch02-model-runner&p=5` | 直接開啟該章第 5 頁 |
| `index.html?ch=不存在的章節` | 顯示 **「無此章節」** 畫面：說明可能原因，並列出所有可用章節供點選 |

瀏覽時網址會自動同步成目前的章節與頁碼，直接複製網址給學生就會開在同一頁。

---

## 五、操作一覽

| 操作 | 說明 |
|---|---|
| `→` `←` `空白鍵` | 下一頁 / 上一頁；到章末再翻會自動進入下一章 |
| 頁碼欄輸入數字 + `Enter` | 跳頁 |
| `C` | 章節目錄（封面、簡介、頁數、已有筆記數） |
| `[` `]` | 上一章 / 下一章 |
| `I` | 本章簡介 |
| `G` | 本章投影片縮圖牆，有筆記的頁會有綠點 |
| `F` | 全螢幕 |
| `+` `-` `0`、滾輪、雙擊 | 縮放；放大後可拖曳平移（手機雙指縮放） |
| `D` | 標註模式：直接畫在投影片上（畫筆／螢光筆／橡皮擦、8 色、粗細可調） |
| `Ctrl/⌘ + Z` | 復原上一筆 |
| `N` | 文字筆記側欄（每章每頁各一份） |
| `B` | 白板：每頁另開一張空白 canvas，可存成 PNG |
| 工具列 ⬇ | 把「投影片 + 手繪標註」合成 PNG 下載 |

**載入指示**：開站時顯示百分比進度條；切頁時投影片上方有進度線與「載入中」轉圈；
進站後會在背景預載整章投影片，頂端顯示「預載 12/50」，預載完的頁面切換是瞬間的。

---

## 六、筆記的儲存與搬移

- 文字筆記、投影片標註、白板都存在使用者自己瀏覽器的 `localStorage`，**依章節分開存放**，不會上傳到伺服器。
- **備份**：點右上角「筆記檔」→ **匯出成 JSON 檔**，瀏覽器會下載一個 `投影片筆記-日期.json`。
- **載入**：點「筆記檔」→ **從 JSON 檔載入筆記** → 選檔案（也可以把 .json 直接拖到網頁上放開）。
  接著會顯示這個檔案包含哪些章節、各幾頁，再選 **合併**（保留現有筆記，同頁以匯入的為準）
  或 **完全取代**。確認後畫面上的標註、筆記、白板會立刻套用。
- 匯出的檔案也相容舊版（v1）單章節筆記檔，匯入時會併入目前所開的章節。
- 章節資料夾改名後，該章筆記仍以舊代號保存在檔案裡（匯入時會提示），改回名稱即可接回。

---

## 七、本機預覽

不能直接用 `file://` 開（fetch 會被瀏覽器擋），請用簡易伺服器：

```bash
cd slide-study-site
python3 -m http.server 8000
# 瀏覽器開 http://localhost:8000
```
