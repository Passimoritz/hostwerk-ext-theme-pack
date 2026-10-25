![Themes](banner.svg)

# Themes

Three carefully tuned themes for Hostwerk – “High contrast” for weaker eyesight, “Calm” and “Warm”, each in light and dark and checked for good readability.

[Deutsch](README.de.md) · An official [Hostwerk](https://github.com/Passimoritz/hostwerk-public) extension (theme package, Hostwerk 2.11 or newer)

## What it does

| Theme | Character | Weakest text contrast (dark / light) | Status colours (dark / light) |
|---|---|---|---|
| **High contrast** | Pure black and white, strong status colours, clearly visible lines, less rounding, more room | 9.2:1 / 7.0:1 (AAA) – main text 17:1 | 7.7:1 / 5.0:1 |
| **Calm** | Muted sage and slate, soft corners, a little more room | 5.3:1 / 5.4:1 | 5.6:1 / 4.2:1 |
| **Warm** | Sandy surfaces, terracotta accent, warm evening light | 5.8:1 / 5.4:1 | 6.5:1 / 4.2:1 |

Every value is checked on all five surfaces and the input fields. WCAG 2.2 AA asks for 4.5:1 (text) and 3:1 (status colours);
“High contrast” goes further: every text at least 7:1 (AAA), status colours at least 4.5:1, lines at least 3:1.
Each theme brings its own accent and a few suggestions – Hostwerk derives readable button, link and focus colours from them.
A colour you picked yourself (Settings → General) still wins.

## Install

1. In Hostwerk: **Extensions → Discover**, install “Themes”.
2. **Settings → General → Appearance → Theme** – the change is visible right away, in light and dark mode.
3. Removing the extension switches back to Hostwerk's own look immediately.

A theme is not a stylesheet: it only sets values for Hostwerk's fixed list of design variables, so nothing can be injected
and nothing loads from the internet. Needs Hostwerk with theme support (SDK 2.9).

## Develop

```bash
node --test tests/*.test.js          # contrast of every pair, calculated independently (stricter than the catalogue)
HOSTWERK_CHECK=<path>/sdk/check.js node --test tests/*.test.js   # additionally with Hostwerk's own theme check
node check.js . --strict             # same check as the catalogue (sdk/check.js)
```

The colours live in `manifest.json` → `contributes.themes`.

## License

MIT
