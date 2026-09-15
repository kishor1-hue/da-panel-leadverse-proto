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
