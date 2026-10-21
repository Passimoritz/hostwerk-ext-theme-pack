'use strict';
/*
 * Kontrastprüfung der Farbschemata – unabhängig von Hostwerk nachgerechnet (WCAG 2.2, relative Leuchtdichte).
 * Strenger als die Katalog-Prüfung: jedes Schema setzt ALLE Farben selbst (nichts erbt Hostwerks Werte), Linien bleiben
 * sichtbar, und „Hoher Kontrast“ erfüllt für Text sogar AAA (7:1).
 * Optional zusätzlich gegen Hostwerks eigene Prüfung: HOSTWERK_CHECK=<pfad>/sdk/check.js node --test tests/*.test.js
 */
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const manifest = require('../manifest.json');

const themes = manifest.contributes.themes;
const COLORS = ['--bg', '--bg-2', '--surface', '--surface-2', '--surface-3', '--line', '--line-2', '--text', '--text-2', '--muted', '--ok', '--ok-text', '--warn', '--warn-text', '--err', '--err-text', '--info', '--input-bg'];
const SURFACES = ['--bg', '--bg-2', '--surface', '--surface-2', '--surface-3', '--input-bg'];
const TEXT = ['--text', '--text-2', '--muted', '--ok-text', '--warn-text', '--err-text'];
const UI = ['--ok', '--warn', '--err', '--info'];

/** Relative Leuchtdichte nach WCAG 2.2 (sRGB). */
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function ratio(a, b) { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
/** Schwächster Kontrast einer Farbe auf allen Flächen eines Modus. */
const worst = (set, fg) => Math.min(...SURFACES.map((bg) => ratio(fg.startsWith('#') ? fg : set[fg], set[bg])));

test('Formel stimmt mit WCAG überein', () => {
  assert.strictEqual(Math.round(ratio('#000000', '#ffffff') * 10) / 10, 21);
  assert.strictEqual(Math.round(ratio('#767676', '#ffffff') * 100) / 100, 4.54); // bekannte AA-Grenze für Grau auf Weiß
});

test('drei Schemata mit eindeutiger id und Titel in beiden Sprachen', () => {
  assert.deepStrictEqual(themes.map((t) => t.id), ['high-contrast', 'calm', 'warm']);
  for (const t of themes) { assert.ok(t.title.de && t.title.en, t.id); assert.ok(t.description.de && t.description.en, t.id); }
});

for (const th of themes) {
  test(`${th.id}: hell und dunkel setzen alle Farben selbst (gültige #rrggbb)`, () => {
    for (const mode of ['dark', 'light']) for (const k of COLORS) assert.match(th.tokens[mode][k] || '', /^#[0-9a-f]{6}$/i, `${th.id} ${mode} ${k}`);
  });

  test(`${th.id}: dunkel bleibt dunkel, hell bleibt hell`, () => {
    for (const k of ['--bg', '--surface']) {
      assert.ok(lum(th.tokens.dark[k]) < 0.2, `${k} dunkel`);
      assert.ok(lum(th.tokens.light[k]) > 0.5, `${k} hell`);
    }
  });

  const strict = th.id === 'high-contrast';
  const minText = strict ? 7 : 4.5; // AAA beim hohen Kontrast, sonst AA
  const minUi = strict ? 4.5 : 3;
  const minLine = strict ? 3 : 1.15; // Linien: beim hohen Kontrast deutlich sichtbar (WCAG 1.4.11), sonst nur zart
  for (const mode of ['dark', 'light']) {
    const set = th.tokens[mode];
    test(`${th.id} (${mode}): Text ≥ ${minText}:1 auf allen Flächen`, () => {
      for (const fg of TEXT) assert.ok(worst(set, fg) >= minText, `${fg} ${set[fg]}: ${worst(set, fg).toFixed(2)}:1`);
    });
    test(`${th.id} (${mode}): Zustandsfarben ≥ ${minUi}:1 auf allen Flächen`, () => {
      for (const fg of UI) assert.ok(worst(set, fg) >= minUi, `${fg} ${set[fg]}: ${worst(set, fg).toFixed(2)}:1`);
    });
    test(`${th.id} (${mode}): Linien heben sich von den Flächen ab`, () => {
      for (const fg of ['--line', '--line-2']) assert.ok(Math.min(...['--bg', '--surface'].map((bg) => ratio(set[fg], set[bg]))) >= minLine, `${fg} ${set[fg]}`);
    });
    test(`${th.id} (${mode}): Flächen bleiben unterscheidbar, aber nah beieinander`, () => {
      // Stufen bg → surface-3 dürfen nie so weit auseinander liegen, dass Text auf einer davon schlechter lesbar wird
      assert.ok(ratio(set['--bg'], set['--surface-3']) < 1.6);
    });
  }

  test(`${th.id}: jeder Akzent ≥ 3:1 auf allen Flächen in hell und dunkel`, () => {
    const list = [th.accent, ...(th.accents || [])];
    assert.ok(list.length >= 2 && list.length <= 9);
    for (const a of list) for (const mode of ['dark', 'light']) assert.ok(worst(th.tokens[mode], a) >= 3, `${a} ${mode}: ${worst(th.tokens[mode], a).toFixed(2)}:1`);
  });

  test(`${th.id}: Rundung und Dichte im erlaubten Bereich`, () => {
    assert.ok(th.radius >= 0 && th.radius <= 2);
    assert.ok(['compact', 'normal', 'comfortable'].includes(th.density));
  });
}

test('Hostwerks eigene Prüfung (falls HOSTWERK_CHECK gesetzt)', { skip: !process.env.HOSTWERK_CHECK }, () => {
  const sdk = require(path.resolve(process.env.HOSTWERK_CHECK));
  for (const th of themes) assert.deepStrictEqual(sdk.themeReport(th).errors, [], th.id);
});
