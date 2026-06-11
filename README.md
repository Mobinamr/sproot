# sproot

A study dashboard where each subject is a draggable chapter graph — a linked map of what to learn and in which order.

## Features

- **Chapter maps** — every subject is a dot-grid canvas: the black circle is the subject, the circles around it are chapters, arrows show what leads to what. Drag to arrange, drag from a circle's edge to link, double-click to add, mark chapters done.
- **Multiple subjects** — switch, create and delete subjects from the pill bar on the dashboard.
- **Dashboard** — live map preview, study streak, tracked hours (counted while the app is open) with sparkline, schedule calendar, and a friends leaderboard with invites.
- Everything is saved locally in the browser (`localStorage`); Export/Import moves maps between machines as JSON.

## Run

No build step — it's plain HTML/CSS/JS:

```sh
open index.html          # or just double-click it
# or serve it:
python3 -m http.server 8000
```
