# 投影片學習網（Slide Study）

純靜態、單一 HTML 檔的投影片瀏覽 + 筆記網站，放上 GitHub Pages 就能用。
支援全螢幕、縮放、翻頁、跳頁、投影片手繪標註、獨立白板、筆記匯出入，桌機與手機通用，
並已內建 Facebook 分享縮圖（Open Graph）設定。

```
slide-study-site/
├── index.html              ← 全部程式都在這裡（不依賴任何外部套件）
├── slides.json             ← 投影片清單（由腳本產生，可手改）
├── make_slides_json.py     ← 掃描 slides/ 產生 slides.json、順便寫好 FB 分享設定
├── .nojekyll               ← 讓 GitHub Pages 不要用 Jekyll 處理檔案
└── slides/                 ← 把你的 50 多張 PNG 放這裡
    ├── slide-001.png
    ├── slide-002.png
    └── ...
```

---

## 一、放投影片

把 PNG 放進 `slides/`，命名為 `slide-001.png`、`slide-002.png`⋯（三位數，依播放順序）。

已經有一堆亂七八糟的檔名？在資料夾裡執行：

```bash
python3 make_slides_json.py --rename --title "Ollama LLM Server 課程"
```

`--rename` 會依「自然排序」（slide2 排在 slide10 前面）統一改成 `slide-001.png…`，
並產生 `slides.json`。

> 若懶得跑腳本也可以：只要檔名是 `slides/slide-001.png` 這種格式，網站會自動偵測到第幾張為止，
> 不需要 `slides.json`。但**有 `slides.json` 載入最快**（50 張一次載入清單，不用逐張試）。

---

## 二、上傳到 GitHub Pages

```bash
cd slide-study-site
git init
git add .
git commit -m "投影片學習網"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

到 GitHub repo → **Settings → Pages** →
Source 選 `Deploy from a branch`、Branch 選 `main` / `(root)` → Save。

一兩分鐘後網站就在 `https://USERNAME.github.io/REPO/`。

---

## 三、讓 Facebook 縮圖顯示第一張投影片（重要）

Facebook 只認**完整網址**的 `og:image`，所以網址確定後要設定一次：

```bash
python3 make_slides_json.py \
  --base-url https://USERNAME.github.io/REPO/ \
  --title "Ollama LLM Server 課程"
git commit -am "設定 FB 分享資訊" && git push
```

腳本會自動把 `index.html` 裡的這幾行改好（也可以自己手動改）：

```html
<meta property="og:image"  content="https://USERNAME.github.io/REPO/slides/slide-001.png">
<meta property="og:url"    content="https://USERNAME.github.io/REPO/">
<meta property="og:title"  content="Ollama LLM Server 課程">
```

最後一步（**一定要做**，否則 FB 會一直用舊的快取）：
開 <https://developers.facebook.com/tools/debug/> → 貼上你的網址 → 按 **Scrape Again**，
確認預覽圖出現第一張投影片。之後在 FB 貼文貼網址，縮圖就會正確。

小提醒：
- 第一張投影片最好是 **1200×630 以上**、長寬比接近 1.91:1（16:9 也可以，FB 會自動裁切上下）。
- 圖檔請 < 8MB。
- 網站右上角的「分享」鈕會直接開 FB 分享視窗（手機則叫出系統分享選單）。

---

## 四、功能與操作

| 操作 | 說明 |
|---|---|
| `→` `←` `空白鍵` | 下一頁 / 上一頁（手機：左右滑動） |
| 頁碼欄輸入數字 + `Enter` | 直接跳頁 |
| `G` | 投影片總覽縮圖牆，點一下跳頁；有筆記的頁會有綠點 |
| `F` | 全螢幕 |
| `+` `-` `0`、滾輪、雙擊 | 放大 / 縮小 / 還原（手機：雙指縮放，放大後單指拖曳平移） |
| `D` | 標註模式：直接畫在投影片上（畫筆／螢光筆／橡皮擦、8 色、粗細可調） |
| `Ctrl/⌘ + Z` | 復原上一筆 |
| `N` | 文字筆記側欄（每頁一份，邊打邊存） |
| `B` | 白板：每頁另開一張空白 canvas，可存成 PNG |
| 工具列 ⬇ 鈕 | 把「投影片 + 手繪標註」合成 PNG 下載 |

**資料儲存**：文字筆記、投影片標註、白板都存在使用者自己瀏覽器的 `localStorage`
（key 為網站路徑，換一個 repo 不會互相干擾），不會上傳到任何伺服器。
點「筆記檔」可**匯出 JSON 備份**或**匯入**（匯入時可選擇合併或取代）。
提醒學生：清除瀏覽器資料會連筆記一起清掉，重要筆記請匯出備份。

---

## 五、本機預覽

不能直接用 `file://` 開（fetch 會被擋），請用簡易伺服器：

```bash
cd slide-study-site
python3 -m http.server 8000
# 瀏覽器開 http://localhost:8000
```
