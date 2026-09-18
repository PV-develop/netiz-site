#!/usr/bin/env python3
"""Собирает страницы: src/*.html + partials → *.html в корне.
Подстановка: <!-- @include partials/header.html -->
Запуск: python3 build.py   (никаких зависимостей)"""
import re, pathlib
root = pathlib.Path(__file__).parent
def include(m):
    p = root / m.group(1).strip()
    return p.read_text(encoding='utf-8')
for src in (root / 'src').glob('*.html'):
    html = src.read_text(encoding='utf-8')
    html = re.sub(r'<!--\s*@include\s+(\S+)\s*-->', include, html)
    (root / src.name).write_text(html, encoding='utf-8')
    print('built', src.name)
