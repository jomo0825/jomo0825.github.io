#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
產生 slides.json，並（可選）自動寫好 index.html 裡的 Facebook 分享資訊。

用法：
  python3 make_slides_json.py
  python3 make_slides_json.py --title "Ollama LLM Server 課程"
  python3 make_slides_json.py --base-url https://USERNAME.github.io/REPO/ --title "我的課程"
  python3 make_slides_json.py --rename        # 先把檔名統一改成 slide-001.png…

--base-url 會把 index.html 的 og:image / og:url / og:title 一併改好（FB 縮圖必須是完整網址）。
"""
import argparse, json, re, struct, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SLIDES = ROOT / "slides"
EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}


def natural_key(p: Path):
    """讓 slide2.png 排在 slide10.png 前面。"""
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", p.name)]


def png_size(path: Path):
    try:
        with open(path, "rb") as f:
            head = f.read(32)
        if head[:8] == b"\x89PNG\r\n\x1a\n":
            w, h = struct.unpack(">II", head[16:24])
            return int(w), int(h)
    except Exception:
        pass
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--title", default="投影片學習網")
    ap.add_argument("--base-url", default=None, help="網站根網址，例如 https://user.github.io/repo/")
    ap.add_argument("--rename", action="store_true", help="依現有排序改名為 slide-001.png…")
    a = ap.parse_args()

    if not SLIDES.is_dir():
        SLIDES.mkdir()
        sys.exit(f"已建立 {SLIDES}／請先把投影片 PNG 放進去再執行一次。")

    files = sorted([p for p in SLIDES.iterdir()
                    if p.is_file() and p.suffix.lower() in EXT], key=natural_key)
    if not files:
        sys.exit(f"{SLIDES} 裡沒有找到圖片檔。")

    if a.rename:
        tmp = []
        for i, p in enumerate(files, 1):                      # 兩階段改名，避免覆蓋
            t = p.with_name(f"__tmp_{i:03d}{p.suffix.lower()}")
            p.rename(t); tmp.append(t)
        files = []
        for i, t in enumerate(tmp, 1):
            f = t.with_name(f"slide-{i:03d}{t.suffix.lower()}")
            t.rename(f); files.append(f)
        print(f"已改名 {len(files)} 個檔案為 slide-001…")

    data = {"title": a.title, "dir": "slides/", "slides": [p.name for p in files]}
    (ROOT / "slides.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ slides.json 已寫入，共 {len(files)} 張投影片：{files[0].name} … {files[-1].name}")

    if a.base_url:
        base = a.base_url if a.base_url.endswith("/") else a.base_url + "/"
        first = f"{base}slides/{files[0].name}"
        html_path = ROOT / "index.html"
        html = html_path.read_text(encoding="utf-8")
        size = png_size(files[0])

        def rep(prop, val, attr="property"):
            nonlocal html
            html = re.sub(rf'(<meta\s+{attr}="{re.escape(prop)}"\s+content=")[^"]*(")',
                          lambda m: m.group(1) + val + m.group(2), html, count=1)

        rep("og:image", first)
        rep("og:url", base)
        rep("og:title", a.title)
        html = re.sub(r'(<title>)[^<]*(</title>)', rf'\g<1>{a.title} · Slide Study\g<2>', html, count=1)
        if size:
            rep("og:image:width", str(size[0]))
            rep("og:image:height", str(size[1]))
        html_path.write_text(html, encoding="utf-8")
        print(f"✓ index.html 的 Facebook 分享資訊已更新：\n  og:image = {first}\n  og:url   = {base}")
        print("\n部署完成後，到 https://developers.facebook.com/tools/debug/ "
              "貼上網址按『Scrape Again』重新抓取縮圖。")


if __name__ == "__main__":
    main()
