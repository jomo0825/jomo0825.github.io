#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
掃描 slides/ 產生 chapters.json（章節 + 投影片清單），並可自動寫好 Facebook 分享資訊。

資料夾結構（多章節）：
    slides/
      ch01-intro/
        chapter.md          ← 章節標題與簡介（Markdown）
        slide-001.png …
      ch02-model-runner/
        chapter.md
        slide-001.png …

也支援「單一章節」：直接把 PNG 放在 slides/ 底下即可。

chapter.md 範例：
    ---
    title: 第二章 Model Runner 的角色
    order: 2
    ---
    本章說明 Ollama Server 如何啟動並維護 Model Runner。

    - 權重載入與 VRAM 配置
    - KV Cache 與 Context Window

    > 課前請先安裝 Ollama。

（沒有 --- 區塊也可以：第一行寫 `# 章節標題`，之後寫簡介。）

常用指令：
    python3 make_slides_json.py --init                      # 建立範例章節資料夾
    python3 make_slides_json.py --site "Ollama 課程"         # 產生 chapters.json
    python3 make_slides_json.py --rename                    # 順便統一投影片檔名
    python3 make_slides_json.py --base-url https://user.github.io/repo/ --site "Ollama 課程"
"""
import argparse, json, re, struct, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SLIDES = ROOT / "slides"
IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
MD_NAMES = ["chapter.md", "index.md", "README.md", "readme.md", "info.md"]

TEMPLATE = """---
title: 第一章 課程導論
order: 1
---
用一兩句話說明這一章在講什麼，會在章節目錄卡片與「簡介」視窗中顯示。

**本章重點**

- 重點一
- 重點二
- 重點三

> 課前準備：⋯⋯
"""


def natural_key(p):
    name = p.name if isinstance(p, Path) else str(p)
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


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


def parse_md(folder: Path):
    """回傳 (title, intro, meta)。找不到 md 時 title=None。"""
    md = None
    for n in MD_NAMES:
        if (folder / n).is_file():
            md = folder / n
            break
    if md is None:
        cand = sorted([p for p in folder.glob("*.md")], key=natural_key)
        md = cand[0] if cand else None
    if md is None:
        return None, "", {}

    text = md.read_text(encoding="utf-8-sig").replace("\r\n", "\n")
    meta = {}
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.S)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip().lower()] = v.strip().strip('"').strip("'")
        text = m.group(2)

    title = meta.get("title")
    body = text.strip("\n")
    h1 = re.match(r"^#\s+(.+?)\n?(.*)$", body, re.S)
    if h1:
        if not title:
            title = h1.group(1).strip()
        body = h1.group(2)
    return title, body.strip("\n"), meta


def rename_images(folder: Path):
    files = sorted([p for p in folder.iterdir()
                    if p.is_file() and p.suffix.lower() in IMG_EXT], key=natural_key)
    tmp = []
    for i, p in enumerate(files, 1):
        t = p.with_name(f"__tmp_{i:03d}{p.suffix.lower()}")
        p.rename(t)
        tmp.append(t)
    out = []
    for i, t in enumerate(tmp, 1):
        f = t.with_name(f"slide-{i:03d}{t.suffix.lower()}")
        t.rename(f)
        out.append(f)
    return out


def images(folder: Path):
    return sorted([p for p in folder.iterdir()
                   if p.is_file() and p.suffix.lower() in IMG_EXT], key=natural_key)


def main():
    ap = argparse.ArgumentParser(formatter_class=argparse.RawDescriptionHelpFormatter,
                                 description=__doc__)
    ap.add_argument("--site", default=None, help="網站標題")
    ap.add_argument("--base-url", default=None, help="網站根網址，例如 https://user.github.io/repo/")
    ap.add_argument("--rename", action="store_true", help="把每個章節內的圖片統一改名為 slide-001…")
    ap.add_argument("--init", action="store_true", help="建立範例章節資料夾與 chapter.md")
    a = ap.parse_args()

    SLIDES.mkdir(exist_ok=True)

    if a.init:
        d = SLIDES / "ch01-intro"
        d.mkdir(exist_ok=True)
        f = d / "chapter.md"
        if f.exists():
            print(f"已存在：{f}")
        else:
            f.write_text(TEMPLATE, encoding="utf-8")
            print(f"✓ 已建立 {f}\n  把第一章的投影片 PNG 放進 {d}／再執行一次本腳本即可。")
        return

    subdirs = sorted([p for p in SLIDES.iterdir() if p.is_dir()], key=natural_key)
    subdirs = [d for d in subdirs if images(d)]

    chapters = []
    if subdirs:                                   # ---- 多章節 ----
        for i, d in enumerate(subdirs, 1):
            if a.rename:
                rename_images(d)
            imgs = images(d)
            title, intro, meta = parse_md(d)
            chapters.append({
                "_order": float(meta.get("order", i)) if str(meta.get("order", i)).replace(".", "", 1).isdigit() else i,
                "id": meta.get("id") or d.name,
                "title": title or d.name,
                "intro": intro,
                "dir": f"slides/{d.name}/",
                "slides": [p.name for p in imgs],
            })
        chapters.sort(key=lambda c: (c["_order"], natural_key(c["id"])))
        for c in chapters:
            c.pop("_order", None)
    else:                                         # ---- 單一章節 ----
        if a.rename:
            rename_images(SLIDES)
        imgs = images(SLIDES)
        if not imgs:
            sys.exit(f"{SLIDES} 裡沒有找到任何圖片。\n"
                     f"請把 PNG 放進 slides/，或依章節建立 slides/ch01-xxx/ 等資料夾。\n"
                     f"（可先執行 python3 make_slides_json.py --init 建立範例）")
        title, intro, _ = parse_md(SLIDES)
        chapters.append({"id": "main", "title": title or "全部投影片", "intro": intro,
                         "dir": "slides/", "slides": [p.name for p in imgs]})

    site = a.site or (chapters[0]["title"] if len(chapters) == 1 else "投影片學習網")
    data = {"site": site, "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
            "chapters": chapters}
    (ROOT / "chapters.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    total = sum(len(c["slides"]) for c in chapters)
    print(f"✓ chapters.json 已寫入：{len(chapters)} 個章節、共 {total} 張投影片")
    for c in chapters:
        mark = "" if c["intro"] else "  ⚠ 沒有 chapter.md 簡介"
        print(f"   - [{c['id']}] {c['title']}（{len(c['slides'])} 張）  ?ch={c['id']}{mark}")

    if a.base_url:
        base = a.base_url if a.base_url.endswith("/") else a.base_url + "/"
        first_dir = chapters[0]["dir"]
        first_name = chapters[0]["slides"][0]
        first_url = base + first_dir + first_name
        html_path = ROOT / "index.html"
        html = html_path.read_text(encoding="utf-8")

        def rep(prop, val):
            nonlocal html
            html = re.sub(rf'(<meta\s+property="{re.escape(prop)}"\s+content=")[^"]*(")',
                          lambda m: m.group(1) + val + m.group(2), html, count=1)

        rep("og:image", first_url)
        rep("og:url", base)
        rep("og:title", site)
        html = re.sub(r"(<title>)[^<]*(</title>)", rf"\g<1>{site} · Slide Study\g<2>", html, count=1)
        sz = png_size(ROOT / first_dir / first_name)
        if sz:
            rep("og:image:width", str(sz[0]))
            rep("og:image:height", str(sz[1]))
        html_path.write_text(html, encoding="utf-8")
        print(f"\n✓ index.html 的 Facebook 分享資訊已更新：\n  og:image = {first_url}\n  og:url   = {base}")
        print("  部署後到 https://developers.facebook.com/tools/debug/ 貼上網址按『Scrape Again』。")


if __name__ == "__main__":
    main()
