#!/usr/bin/env python3
"""Снимает все страницы из корня репозитория на десктопе и мобильном.

Локально:  python3 tools/screenshots.py
В CI:      запускается workflow'ом build.yml, результат — артефакт «screenshots».

Требует playwright:  pip install playwright && playwright install chromium
"""
import asyncio
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'tools' / 'screenshots'
VIEWPORTS = [(1440, 'desktop'), (390, 'mobile')]
SKIP = {'preview.html'}

SCROLL = """async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 40));
  }
  window.scrollTo(0, 0);
}"""


async def main():
    from playwright.async_api import async_playwright

    pages = sorted(p.name for p in ROOT.glob('*.html') if p.name not in SKIP)
    if not pages:
        print('Нет страниц в корне — сначала python3 build.py')
        return 1
    OUT.mkdir(parents=True, exist_ok=True)

    failed = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        for name in pages:
            for width, label in VIEWPORTS:
                page = await browser.new_page(viewport={'width': width, 'height': 900})
                errors = []
                page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
                page.on('pageerror', lambda e: errors.append(str(e)))
                await page.goto((ROOT / name).as_uri())
                await page.evaluate(SCROLL)
                await page.wait_for_timeout(500)
                shot = OUT / f'{name[:-5]}-{label}.png'
                await page.screenshot(path=str(shot), full_page=True)
                status = 'ok' if not errors else 'ОШИБКИ: ' + '; '.join(errors[:3])
                print(f'{name:22} {label:8} {status}')
                if errors:
                    failed.append((name, label, errors))
                await page.close()
        await browser.close()

    print(f'\nСнимки: {OUT.relative_to(ROOT)}')
    if failed:
        print(f'\nСтраницы с ошибками в консоли: {len(failed)}')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
