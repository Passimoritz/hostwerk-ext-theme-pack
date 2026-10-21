![Farbschemata](banner.svg)

# Farbschemata

Drei sorgfältig abgestimmte Farbschemata für Hostwerk – „Hoher Kontrast“ für schwächere Augen, „Ruhig“ und „Warm“, jeweils hell und dunkel und auf gute Lesbarkeit geprüft.

[English](README.md) · Eine offizielle [Hostwerk](https://github.com/Passimoritz/hostwerk-public)-Erweiterung (SDK 2.9, Farbschema-Paket)

## Die Schemata

| Schema | Charakter | Schwächster Textkontrast (dunkel / hell) | Zustandsfarben (dunkel / hell) |
|---|---|---|---|
| **Hoher Kontrast** | Reines Schwarz und Weiß, kräftige Zustandsfarben, deutlich sichtbare Linien, weniger Rundung, mehr Luft | 9,2:1 / 7,0:1 (AAA) – Haupttext 17:1 | 7,7:1 / 5,0:1 |
| **Ruhig** | Gedämpftes Salbei und Schiefer, weiche Ecken, etwas mehr Luft | 5,3:1 / 5,4:1 | 5,6:1 / 4,2:1 |
| **Warm** | Sandige Flächen, Terrakotta als Akzent, warmes Abendlicht | 5,8:1 / 5,4:1 | 6,5:1 / 4,2:1 |

Jeder Wert ist auf allen fünf Flächen und in Eingabefeldern nachgerechnet. WCAG 2.2 AA verlangt 4,5:1 (Text) und 3:1
(Zustandsfarben); „Hoher Kontrast“ geht weiter: jeder Text mindestens 7:1 (AAA), Zustandsfarben mindestens 4,5:1, Linien
mindestens 3:1. Jedes Schema bringt einen eigenen Akzent und ein paar Vorschläge mit – Hostwerk leitet daraus lesbare
Knopf-, Link- und Fokusfarben ab. Eine selbst gewählte Farbe (Einstellungen → Allgemein) hat weiter Vorrang.

## Benutzen

1. In Hostwerk: **Erweiterungen → Entdecken**, „Farbschemata“ installieren.
2. **Einstellungen → Allgemein → Darstellung → Farbschema** – der Wechsel ist sofort sichtbar, in Hell und Dunkel.
3. Wird die Erweiterung entfernt, gilt sofort wieder Hostwerks eigenes Aussehen.

Ein Farbschema ist kein Stylesheet: Es setzt nur Werte für Hostwerks feste Liste von Design-Variablen – nichts lässt sich
einschleusen, nichts lädt aus dem Internet. Braucht ein Hostwerk mit Farbschema-Unterstützung (SDK 2.9).

## Entwickeln

```bash
node --test tests/*.test.js          # Kontrast jedes Paars, unabhängig nachgerechnet (strenger als der Katalog)
HOSTWERK_CHECK=<pfad>/sdk/check.js node --test tests/*.test.js   # zusätzlich mit Hostwerks eigener Prüfung
node check.js . --strict             # dieselbe Prüfung wie der Katalog (sdk/check.js)
```

Die Farben stehen in `manifest.json` → `contributes.themes`.

## Lizenz

MIT
