每一章開一個資料夾放在這裡，例如：

  slides/ch01-intro/      chapter.md + slide-001.png, slide-002.png ...
  slides/ch02-xxx/        chapter.md + slide-001.png ...

資料夾名稱就是網址參數：index.html?ch=ch01-intro
只有一章的話，也可以把 PNG 直接放在 slides/ 底下。

放好後在上層資料夾執行：
  python3 make_slides_json.py --rename --site "課程名稱"
