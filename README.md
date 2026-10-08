# Test Drive Console — DAP → Leadverse prototype

A clickable, dynamic prototype of CARS24 UAE's DA Panel (DAP) test-drive journey, rebuilt using Leadverse's real UI patterns (`c24-lead-verse-ui`) — sidebar chrome, table/pipeline layout, journey stepper, modals — instead of a generic mockup.

No build step. Plain HTML/CSS/JS, mutable in-memory mock data (`data.js`).

## Run it

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or just open `index.html` directly in a browser (no server required for basic viewing; a local server avoids any `file://` quirks with the icon CDN).

## What's in here

- **`index.html`** — page shell: the four tabs (Test Drives, Test Drive Detail, Manager Oversight, Migration Plan), the faux-Leadverse chrome (sidebar/header) repeated per panel, and the Assign-DA / Compare-cars modal markup.
- **`style.css`** — all styling. Colors/radii/shadows are pulled from Leadverse's actual code, not invented. Supports light/dark/system theme.
- **`data.js`** — mock DAs, cars, VAS catalog, and orders. `ORDERS` is mutated in place as you click through the prototype — nothing here is a real backend.
- **`app.js`** — all rendering + interaction logic: role switching (Receptionist/DA), dynamic per-order journey steppers, the Assign-DA modal (with a DA daily-capacity cap), car selection + compare, VAS selection, and a mock QR/bank-transfer payment step.

## The two journeys this models

**Receptionist**, clicking into an order:
- Existing/pre-booked customer → 2 steps: **Check-in → Assign DA**.
- Walk-in with no booking yet → 5 steps: **Customer Details → Select Car (with compare) → Order Created → Check-in → Assign DA**.

**Delivery Associate**, clicking into an assigned order:
- 5 steps: **Conduct TD (disposition) → Select VAS → Confirm VAS → Payment (QR or bank transfer) → Token Paid**.

Use the "Acting as" toggle (top right of the meta strip) to switch between the two.

## Why it looks like this

See the **Migration Plan** tab inside the prototype itself — it explains what's a straight reuse of existing Leadverse components (e.g. the Assign-DA modal is Leadverse's existing `ManualAssignmentModal` pattern), what's an extension, and what's genuinely new.

## PISTON v2 screen spec (`piston/`)

The ideal test-drive journey (PISTON: Plan, Introduce, Sign-in, Tailor, On the road, Next step), one level deeper than the FigJam board: for every step its **source**, its **screen**, its **entry conditions** and its **exit conditions**, for three tracks (booked hub TD, walk-in hub TD, video TD). Screens follow the **Leadverse TD Journey** Figma design (white theme only): icon rail, lead pane with AI summary, stage bar, CarGPT with live transcription. One level further down, every screen has its **anatomy**: numbered parts (pins on the screen), fields, actions and states.

```bash
python3 -m http.server 8000
# open http://localhost:8000/piston/
```

- **Walkthrough**: journey rail, the Leadverse screen for the step, and its spec. A screen's buttons are its exits, so clicking one moves to the next step. Deep links look like `#booked-S1`, `#walkin-T2`, `#vtd-O2`.
- **Anatomy** (tab in the walkthrough): orange pins on the screen, with each part's widget, the fields, the actions and the states.
- **Blueprint**: the same depth as a table, at flow, phase and step level.
- **Fields**: every field on every screen in one data dictionary.
- **What changed**: the review notes applied (TD consent after TD start; handshake, then car finding), what that does to the Test Drive Console, and the decisions still open.

Files: `piston-data.js` (the spec: tracks, flows, phases, steps, mock people and cars), `piston-anatomy.js` (parts, fields, actions and states per screen), `piston-screens.js` (one screen per step), `piston.js` (the viewer), `piston.css` (viewer and the TD Journey components), `artifact-entry.html` (same page for publishing as a Claude artifact).

`board-v2.mmd` is the Mermaid source of the "PISTON v2" diagram on the FigJam board (https://www.figma.com/board/5QB2ojoArxc9QdjqWxuqlx), placed next to v1. Step IDs on the board match the IDs in the screen spec.
