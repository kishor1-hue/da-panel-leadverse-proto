// ---- Test Drive Console prototype: app state + rendering ----

const STATE = { role: "RECEPTIONIST", tab: "queue", orderId: null, stepIndex: 0, compareIds: [], payMethod: "qr" };

function icons() { if (window.lucide) lucide.createIcons(); }

// ---------------------------------------------------------------- header user

function renderHeaderUser(el) {
  const isDa = STATE.role === "DA";
  el.innerHTML = `
    <div class="who"><b>${isDa ? "Omar Hassan" : "Nand Kishor"}</b><span>${isDa ? "COMMON_DA &middot; Al Quoz hub" : "RECEPTIONIST &middot; Al Quoz hub"}</span></div>
    <div class="avatar">${isDa ? "OH" : "NK"}<span class="dot"></span></div>`;
}

// ---------------------------------------------------------------- Test Drives queue

function renderQueue() {
  const isDa = STATE.role === "DA";
  const rows = isDa
    ? ORDERS.filter(o => o.assignedDaId === "da1" && !o.isWalkIn)
    : ORDERS;
  const body = document.getElementById("queue-body");
  body.innerHTML = `
    ${isDa ? "" : `<div class="proto-note"><i data-lucide="sparkles" class="icon"></i><div><b>New top-level nav item.</b> Today only "Tasks" and "Leads" are wired into the sidebar &mdash; this is a third, for the DA's own fast-moving queue and the Receptionist's front-desk intake.</div></div>`}
    <div class="list-head">
      <div><h2>Test Drives</h2><div class="sub">${isDa ? "Your assigned test drives at Al Quoz" : "Today's bookings and walk-ins at Al Quoz"}</div></div>
      ${isDa ? "" : `<button class="btn primary" id="btn-checkin-walkin"><i data-lucide="user-plus" class="icon"></i>Check In Customer</button>`}
    </div>
    <div class="toolbar">
      <div class="search"><i data-lucide="search" class="icon"></i><input placeholder="Search by customer, order id, phone&hellip;"></div>
      <div class="select"><i data-lucide="filter" class="icon"></i>Filters</div>
      <div class="select">Today <i data-lucide="chevron-down" class="icon"></i></div>
    </div>
    <div class="dtable">
      <table>
        <thead><tr><th>Customer</th><th>Order</th><th>Car</th><th>Type</th><th>Status</th><th></th></tr></thead>
        <tbody id="queue-rows"></tbody>
      </table>
      <div class="pager"><button><i data-lucide="chevron-left" class="icon"></i></button><button class="cur">1</button><button>2</button><button><i data-lucide="chevron-right" class="icon"></i></button></div>
    </div>`;

  document.getElementById("queue-rows").innerHTML = rows.map(o => `
    <tr data-order="${o.id}">
      <td><div class="cust"><div class="av">${initials(o.customer.name || "New")}</div><div><div class="nm">${o.customer.name || "New walk-in"}</div><div class="ph">${o.customer.phone || "&mdash;"}</div></div></div></td>
      <td>${o.id}</td>
      <td>${o.car ? o.car.title : "&mdash;"}</td>
      <td><span class="chip neutral">${o.type}</span></td>
      <td><span class="chip ${o.tone}">${o.status}</span></td>
      <td><button class="kebab"><i data-lucide="more-vertical" class="icon"></i></button></td>
    </tr>`).join("") || `<tr><td colspan="6" style="text-align:center; color:var(--faint); padding:30px;">No test drives yet.</td></tr>`;

  document.querySelectorAll("#queue-rows tr[data-order]").forEach(tr => {
    tr.addEventListener("click", (e) => { if (e.target.closest(".kebab")) return; openOrder(tr.dataset.order); });
  });

  const checkinBtn = document.getElementById("btn-checkin-walkin");
  if (checkinBtn) checkinBtn.addEventListener("click", () => {
    const order = createDraftOrder();
    openOrder(order.id);
  });

  icons();
}

// ---------------------------------------------------------------- Manager oversight (static-ish, own dataset)

const OVERSIGHT_ROWS = [
  { order: "BK-88213", name: "Fatima Al Suwaidi", car: "Nissan Altima '23", type: "Hub", da: "Omar Hassan", slot: "Today, 2:30 PM", status: "Conduct TD", tone: "warn" },
  { order: "BK-88190", name: "Khalid Al Jaberi", car: "Toyota Camry '22", type: "Virtual", da: "&mdash;", slot: "Today, 3:00 PM", status: "Unassigned", tone: "bad" },
  { order: "BK-88177", name: "Maryam Rashidi", car: "Hyundai Tucson '23", type: "Hub", da: "Layla Ahmed", slot: "Today, 4:15 PM", status: "Assigned", tone: "neutral" },
  { order: "BK-88155", name: "Sultan Al Nuaimi", car: "Kia Sportage '22", type: "Home", da: "Yusuf Khan", slot: "Tomorrow, 11:00 AM", status: "Left Yard", tone: "warn" },
  { order: "BK-88141", name: "Aisha Al Mazrouei", car: "Nissan Sunny '21", type: "Hub", da: "Sara Ibrahim", slot: "Yesterday", status: "Complete", tone: "ok" },
  { order: "BK-88129", name: "Rashid Al Falasi", car: "Honda CR-V '23", type: "Virtual", da: "Omar Hassan", slot: "Yesterday", status: "Cancelled", tone: "bad" },
];

function renderOversight() {
  const body = document.getElementById("oversight-body");
  body.innerHTML = `
    <div class="proto-note"><i data-lucide="sparkles" class="icon"></i><div><b>Zero new nav.</b> This is the existing "Tasks" screen, unchanged &mdash; only the persona list grew a "Test Drive Scheduling" option. DATL/Receptionist oversight fits this shape exactly, because it already <i>is</i> a filterable order queue.</div></div>
    <div class="list-head"><div><h2>Tasks</h2><div class="sub">Order &middot; Test Drive Scheduling</div></div></div>
    <div class="toolbar">
      <div class="search"><i data-lucide="search" class="icon"></i><input placeholder="Search tasks"></div>
      <div class="select"><i data-lucide="filter" class="icon"></i>Filters</div>
      <div class="select" style="border-color:var(--lv); color:var(--lv);">Test Drive Scheduling <i data-lucide="chevron-down" class="icon"></i></div>
    </div>
    <div class="viewtabs"><span class="vt active">Order</span><span class="vt">Lead</span><span class="vt">Contact</span></div>
    <div class="dtable">
      <table>
        <thead><tr><th>Order Id</th><th>Customer</th><th>Car</th><th>Type</th><th>Scheduled slot</th><th>Assigned DA</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${OVERSIGHT_ROWS.map(o => `
            <tr>
              <td>${o.order}</td>
              <td><div class="cust"><div class="av">${initials(o.name)}</div><div class="nm">${o.name}</div></div></td>
              <td>${o.car}</td>
              <td><span class="chip neutral">${o.type}</span></td>
              <td>${o.slot}</td>
              <td>${o.da}</td>
              <td><span class="chip ${o.tone}">${o.status}</span></td>
              <td><button class="kebab"><i data-lucide="more-vertical" class="icon"></i></button></td>
            </tr>`).join("")}
        </tbody>
      </table>
      <div class="pager"><button><i data-lucide="chevron-left" class="icon"></i></button><button class="cur">1</button><button>2</button><button><i data-lucide="chevron-right" class="icon"></i></button></div>
    </div>`;
  icons();
}

// ---------------------------------------------------------------- Test Drive detail: step flows

function stepsFor(order) {
  if (STATE.role === "DA") {
    return [
      { key: "disposition", label: "Conduct TD" },
      { key: "vasSelect", label: "Select VAS" },
      { key: "vasConfirm", label: "Confirm VAS" },
      { key: "payment", label: "Payment" },
      { key: "done", label: "Token Paid" },
    ];
  }
  if (order.isWalkIn) {
    return [
      { key: "customer", label: "Customer Details" },
      { key: "car", label: "Select Car" },
      { key: "ordercreated", label: "Order Created" },
      { key: "checkin", label: "Check-in" },
      { key: "assignda", label: "Assign DA" },
    ];
  }
  return [
    { key: "checkin", label: "Check-in" },
    { key: "assignda", label: "Assign DA" },
  ];
}

function openOrder(orderId) {
  STATE.orderId = orderId;
  const order = findOrder(orderId);
  STATE.stepIndex = order.stage === "da_conduct" && STATE.role === "DA" ? 0 : 0;
  setTab("detail");
}

function renderDetail() {
  const order = findOrder(STATE.orderId) || ORDERS[0];
  STATE.orderId = order.id;
  const steps = stepsFor(order);
  if (STATE.stepIndex >= steps.length) STATE.stepIndex = steps.length - 1;

  document.getElementById("detail-crumb").textContent = order.customer.name || "New walk-in";
  renderHeaderUser(document.getElementById("header-user-2"));
  renderLeftPane(order);
  renderStepper(steps);
  renderStepBody(order, steps);
}

function renderLeftPane(order) {
  const el = document.getElementById("leftpane");
  const da = order.assignedDaId ? findDa(order.assignedDaId) : null;
  el.innerHTML = `
    <div class="lp-head">
      <div>
        <div class="lp-av">${initials(order.customer.name || "?")}</div>
        <div class="lp-name">${order.customer.name || "New walk-in"}</div>
        <span class="chip ${order.tone}">${order.status}</span>
      </div>
      <button class="kebab"><i data-lucide="more-vertical" class="icon"></i></button>
    </div>
    <div class="lp-tabs"><span class="active">Contact</span><span>Booking</span><span>Docs</span><span>Activity</span></div>
    <div class="lp-section">
      <div class="stitle">DETAILS &amp; CONTACT</div>
      <div class="lp-field"><span class="lbl">Order ID</span><span class="val">${order.id}</span></div>
      <div class="lp-field"><span class="lbl">Phone</span><div><span class="val">${order.customer.phone || "&mdash;"}</span>${order.customer.phone ? `<div class="actrow"><button><i data-lucide="phone" class="icon"></i></button><button><i data-lucide="message-circle" class="icon"></i></button></div>` : ""}</div></div>
      <div class="lp-field"><span class="lbl">Nationality</span><span class="val">${order.customer.nationality || "&mdash;"}</span></div>
      <div class="lp-field"><span class="lbl">Language</span><span class="val">${order.customer.language || "&mdash;"}</span></div>
    </div>
    <div class="lp-section">
      <div class="stitle">BOOKING</div>
      <div class="lp-field"><span class="lbl">Car</span><span class="val">${order.car ? order.car.title : "&mdash;"}</span></div>
      <div class="lp-field"><span class="lbl">TD type</span><span class="chip neutral">${order.type}</span></div>
      <div class="lp-field"><span class="lbl">Assigned DA</span><span class="val">${da ? da.name : "&mdash;"}</span></div>
      <div class="lp-field"><span class="lbl">Token paid</span><span class="chip ${order.tokenPaid ? "ok" : "warn"}">${order.tokenPaid ? "Paid" : "Pending"}</span></div>
    </div>`;
  icons();
}

function renderStepper(steps) {
  const el = document.getElementById("stepper");
  el.innerHTML = steps.map((s, i) => {
    const cls = i < STATE.stepIndex ? "done" : (i === STATE.stepIndex ? "active" : "");
    const dotContent = i < STATE.stepIndex ? `<i data-lucide="check" class="icon" style="width:13px;height:13px;"></i>` : (i + 1);
    return `<div class="step ${cls}"><button class="step-btn" data-step="${i}"><span class="dot">${dotContent}</span><span class="lbl">${s.label}</span></button></div>`;
  }).join("");
  document.querySelectorAll("#stepper .step-btn").forEach(btn => btn.addEventListener("click", () => { STATE.stepIndex = Number(btn.dataset.step); renderDetail(); }));
  icons();
}

function renderStepBody(order, steps) {
  const key = steps[STATE.stepIndex].key;
  const body = document.getElementById("journey-body");
  const bar = document.getElementById("bottombar");
  const isFirst = STATE.stepIndex === 0;
  const isLast = STATE.stepIndex === steps.length - 1;

  body.innerHTML = STEP_RENDER[key](order);
  icons();
  if (STEP_MOUNT[key]) STEP_MOUNT[key](order);

  bar.innerHTML = `
    <span class="left-hint">${STEP_HINT[key] || ""}</span>
    <div style="display:flex; gap:8px;">
      <button class="btn" id="btn-prev" ${isFirst ? "disabled style=\"opacity:.4;\"" : ""}>Previous</button>
      <button class="btn primary" id="btn-next">${STEP_NEXT_LABEL[key] ? STEP_NEXT_LABEL[key](order) : (isLast ? "Finish" : "Next")}</button>
    </div>`;
  document.getElementById("btn-prev").addEventListener("click", () => { if (!isFirst) { STATE.stepIndex--; renderDetail(); } });
  const nextBtn = document.getElementById("btn-next");
  if (key === "payment") { nextBtn.disabled = true; nextBtn.style.opacity = ".5"; } // payment gates this transition &mdash; use "Mark as paid" instead
  else nextBtn.addEventListener("click", () => {
    if (STEP_COMMIT[key]) STEP_COMMIT[key](order);
    if (isLast) { finishFlow(order); return; }
    STATE.stepIndex++;
    renderDetail();
  });
  icons();
}

function finishFlow(order) {
  if (STATE.role === "DA") { setTab("queue"); return; }
  if (!order.assignedDaId) { order.status = "Unassigned"; order.tone = "bad"; }
  else { order.status = "Assigned"; order.tone = "neutral"; }
  setTab("queue");
}

// ---- per-step render/mount/commit/hint/next-label ----

const STEP_HINT = {
  checkin: "POST work-order/customer-check-in &middot; hub/virtual only",
  assignda: "PUT work-order/assign-da",
  customer: "Same phone-number-as-id pattern as DAP's customer search",
  car: "Car listing mirrors DAP's own compare-car tool",
  ordercreated: "POST order/appointmentId/{id}/booking-initiate &rarr; booking-confirm",
  disposition: "test-drive-status action &middot; work order untouched",
  vasSelect: "GET vas/bundle &middot; DAP's price/VAS wizard, step 2",
  vasConfirm: "POST vas/order/{id}/save-vas-plan",
  payment: "New: in-app payment collection, not the read-only reflection DAP has today",
  done: "POST checkout/work-order/{id}/feedback &rarr; COMPLETE",
};

const STEP_NEXT_LABEL = {
  checkin: () => "Confirm Check-In",
  assignda: (o) => o.assignedDaId ? "Confirm & Finish" : "Skip for now",
  customer: () => "Next: Select Car",
  car: (o) => o.car ? "Next: Create Order" : "Select a car to continue",
  ordercreated: () => "Continue to Check-In",
  disposition: () => "Next: Select VAS",
  vasSelect: () => "Next: Confirm VAS",
  vasConfirm: () => "Confirm VAS & Continue",
  payment: () => "Waiting for payment&hellip;",
  done: () => "Back to my queue",
};

const STEP_RENDER = {
  checkin: (o) => `
    <div class="jcard"><h3>Customer check-in</h3><div class="desc">Hub or virtual only &mdash; Home skips this step entirely.</div>
      <div class="formgrid">
        <div class="fld"><label>Hub location</label><div class="box readonly">Al Quoz &middot; DXB_PH1_MHM</div></div>
        <div class="fld"><label>TD type</label><div class="box readonly">${o.type} visit</div></div>
      </div>
    </div>`,

  assignda: (o) => {
    const da = o.assignedDaId ? findDa(o.assignedDaId) : null;
    return `
    <div class="jcard"><h3>Assign a Delivery Associate</h3><div class="desc">Ranked by hub availability &mdash; blocked once a DA is at their daily capacity.</div>
      <div class="upload-row"><div class="l"><i data-lucide="user-check" class="icon"></i>Currently assigned</div><div class="status" style="color:${da ? "var(--ok-ink)" : "var(--bad-ink)"};">${da ? da.name : "Not yet assigned"}</div></div>
      <button class="btn btn-block" id="btn-open-assign" style="margin-top:14px;"><i data-lucide="users" class="icon"></i>${da ? "Change DA" : "Assign DA"}</button>
    </div>`;
  },

  customer: (o) => `
    <div class="jcard"><h3>Walk-in customer details</h3><div class="desc">Captured once &mdash; reused for check-in, docs, and the sales agreement later.</div>
      <div class="formgrid">
        <div class="fld"><label>Full name</label><input class="box" id="f-name" value="${o.customer.name}"></div>
        <div class="fld"><label>Mobile number</label><input class="box" id="f-phone" value="${o.customer.phone}"></div>
        <div class="fld"><label>Email</label><input class="box" id="f-email" value="${o.customer.email}"></div>
        <div class="fld"><label>Nationality</label><input class="box" id="f-nat" value="${o.customer.nationality}"></div>
        <div class="fld"><label>Driving licence number</label><input class="box" id="f-dl" value="${o.customer.dl}"></div>
        <div class="fld"><label>Home-country DL number</label><input class="box" id="f-dlc" value="${o.customer.dlCountry}"></div>
      </div>
    </div>`,

  car: (o) => `
    <div class="jcard" style="max-width:100%;"><h3>Select a car</h3><div class="desc">Click a card to open its full listing in a new tab, or tick two to compare.</div>
      <div class="car-grid" id="car-grid">${CARS.map(c => carCardHtml(c, o)).join("")}</div>
      <div class="compare-bar"><span id="cmp-count">Compare 0/2 selected</span><button class="btn" id="btn-compare" disabled style="opacity:.5;"><i data-lucide="git-compare" class="icon"></i>Compare selected</button></div>
    </div>`,

  ordercreated: (o) => `
    <div class="jcard"><h3>Order created</h3><div class="desc">This is the confirmation step &mdash; DAP's booking-initiate + booking-confirm collapse into one screen here.</div>
      <div class="formgrid full">
        <div class="fld"><label>Order ID</label><div class="box readonly">${o.id}</div></div>
        <div class="fld"><label>Car</label><div class="box readonly">${o.car ? o.car.title : "&mdash;"} &middot; ${o.car ? o.car.price : ""}</div></div>
        <div class="fld"><label>Customer</label><div class="box readonly">${o.customer.name} &middot; ${o.customer.phone}</div></div>
      </div>
    </div>`,

  disposition: (o) => `
    <div class="jcard"><h3>Test drive conducted &mdash; disposition</h3><div class="desc">The declaration/licence checklist from DAP's checkout form lives here too (omitted for brevity in this prototype).</div>
      <div class="radio-list" id="disp-list">${DISPOSITION_OPTIONS.map(opt => `
        <label class="radio-opt ${o.disposition === opt ? "checked" : ""}"><input type="radio" name="disp" value="${opt}" ${o.disposition === opt ? "checked" : ""}> ${opt}</label>`).join("")}
      </div>
    </div>`,

  vasSelect: (o) => `
    <div class="jcard"><h3>Value-added services</h3><div class="desc">Present VAS options against this order + car.</div>
      <div id="vas-rows">${VAS_CATALOG.map(v => `
        <label class="vas-row"><input type="checkbox" data-vid="${v.id}" ${o.vasSelected.some(x => x.id === v.id) ? "checked" : ""}><span class="n">${v.name}</span><span class="p">${moneyAED(v.price)}</span></label>`).join("")}
      </div>
      <div class="vas-total"><span>Total</span><span id="vas-total-amt">${moneyAED(0)}</span></div>
    </div>`,

  vasConfirm: (o) => `
    <div class="jcard"><h3>Confirm VAS selection</h3><div class="desc">Read-only recap before generating a payment request.</div>
      ${o.vasSelected.length ? o.vasSelected.map(v => `<div class="lp-field"><span class="lbl">${v.name}</span><span class="val">${moneyAED(v.price)}</span></div>`).join("") : `<div class="desc">No VAS selected.</div>`}
      <div class="vas-total"><span>Total</span><span>${moneyAED(o.vasSelected.reduce((s, v) => s + v.price, 0))}</span></div>
    </div>`,

  payment: (o) => {
    const total = 5000 + o.vasSelected.reduce((s, v) => s + v.price, 0);
    return `
    <div class="jcard"><h3>Collect payment</h3><div class="desc">Token amount + VAS, due now &mdash; ${moneyAED(total)}.</div>
      <div class="pay-tabs"><button data-m="qr" class="${STATE.payMethod === "qr" ? "active" : ""}">QR code</button><button data-m="bank" class="${STATE.payMethod === "bank" ? "active" : ""}">Bank transfer</button></div>
      <div id="pay-body"></div>
      <button class="btn primary btn-block" id="btn-mark-paid" style="margin-top:16px;"><i data-lucide="check-circle" class="icon"></i>Mark as paid</button>
    </div>`;
  },

  done: (o) => `
    <div class="jcard"><h3>Token paid</h3><div class="desc">Order ${o.id} is now token paid. In DAP/Leadverse today this flips to a read-only reflection everywhere else the order appears.</div>
      <div class="lp-field"><span class="lbl">Amount collected</span><span class="val">${moneyAED(5000 + o.vasSelected.reduce((s, v) => s + v.price, 0))}</span></div>
      <div class="lp-field"><span class="lbl">Method</span><span class="val">${STATE.payMethod === "qr" ? "QR / instant transfer" : "Bank transfer"}</span></div>
    </div>`,
};

function carCardHtml(c, o) {
  const selected = o.car && o.car.id === c.id;
  return `
    <div class="car-card ${selected ? "selected" : ""}" data-car="${c.id}">
      <div class="thumb" style="background:${c.color}"><i data-lucide="car" class="icon"></i></div>
      <div class="body">
        <div class="t">${c.title}</div>
        <div class="p">${c.price}</div>
        <div class="m">${c.km} &middot; ${c.trans}</div>
      </div>
      <div class="row">
        <label class="cmp"><input type="checkbox" data-cmp="${c.id}" ${STATE.compareIds.includes(c.id) ? "checked" : ""}>Compare</label>
        <a class="linkout" href="${c.url}" target="_blank" rel="noopener">Full listing <i data-lucide="external-link" class="icon" style="width:11px;height:11px;"></i></a>
      </div>
      <div class="row" style="padding-top:0;"><button class="btn btn-block" data-select="${c.id}" style="${selected ? "background:var(--lv);color:#fff;border-color:var(--lv);" : ""}">${selected ? "Selected" : "Select this car"}</button></div>
    </div>`;
}

const STEP_MOUNT = {
  assignda: (o) => { const b = document.getElementById("btn-open-assign"); if (b) b.addEventListener("click", () => openAssignModal(o)); },

  car: (o) => {
    document.querySelectorAll('[data-select]').forEach(btn => btn.addEventListener("click", (e) => {
      e.stopPropagation();
      o.car = CARS.find(c => c.id === btn.dataset.select);
      renderDetail();
    }));
    document.querySelectorAll('[data-cmp]').forEach(cb => cb.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = cb.dataset.cmp;
      if (cb.checked) { if (STATE.compareIds.length >= 2) { cb.checked = false; return; } STATE.compareIds.push(id); }
      else STATE.compareIds = STATE.compareIds.filter(x => x !== id);
      document.getElementById("cmp-count").textContent = `Compare ${STATE.compareIds.length}/2 selected`;
      const btn = document.getElementById("btn-compare");
      btn.disabled = STATE.compareIds.length !== 2;
      btn.style.opacity = STATE.compareIds.length === 2 ? "1" : ".5";
    }));
    const cmpBtn = document.getElementById("btn-compare");
    if (cmpBtn) cmpBtn.addEventListener("click", () => openCompareModal());
    document.querySelectorAll('.linkout').forEach(a => a.addEventListener("click", (e) => e.stopPropagation()));
  },

  disposition: (o) => {
    document.querySelectorAll('#disp-list input[name="disp"]').forEach(r => r.addEventListener("change", () => {
      document.querySelectorAll('#disp-list .radio-opt').forEach(l => l.classList.remove("checked"));
      r.closest(".radio-opt").classList.add("checked");
    }));
  },

  vasSelect: (o) => {
    const recompute = () => {
      const total = VAS_CATALOG.filter(v => document.querySelector(`[data-vid="${v.id}"]`).checked).reduce((s, v) => s + v.price, 0);
      document.getElementById("vas-total-amt").textContent = moneyAED(total);
    };
    document.querySelectorAll('#vas-rows input[type="checkbox"]').forEach(cb => cb.addEventListener("change", recompute));
    recompute();
  },

  payment: (o) => {
    const draw = () => document.getElementById("pay-body").innerHTML = STATE.payMethod === "qr" ? qrHtml() : bankHtml();
    draw();
    document.querySelectorAll('.pay-tabs button').forEach(b => b.addEventListener("click", () => {
      STATE.payMethod = b.dataset.m;
      document.querySelectorAll('.pay-tabs button').forEach(x => x.classList.toggle("active", x === b));
      draw();
    }));
    document.getElementById("btn-mark-paid").addEventListener("click", () => {
      o.tokenPaid = true; o.status = "Token Paid"; o.tone = "ok";
      const steps = stepsFor(o);
      STATE.stepIndex = steps.findIndex(s => s.key === "done");
      renderDetail();
    });
  },
};

const STEP_COMMIT = {
  customer: (o) => {
    o.customer.name = val("f-name"); o.customer.phone = val("f-phone"); o.customer.email = val("f-email");
    o.customer.nationality = val("f-nat"); o.customer.dl = val("f-dl"); o.customer.dlCountry = val("f-dlc");
  },
  checkin: (o) => { o.status = "Checked In"; o.tone = "neutral"; },
  ordercreated: (o) => { o.status = "Order Created"; },
  disposition: (o) => { const r = document.querySelector('#disp-list input[name="disp"]:checked'); if (r) o.disposition = r.value; o.status = "Conducted"; },
  vasSelect: (o) => { o.vasSelected = VAS_CATALOG.filter(v => document.querySelector(`[data-vid="${v.id}"]`)?.checked); },
};

function val(id) { const el = document.getElementById(id); return el ? el.value : ""; }

// ---- QR / bank placeholders ----
function qrHtml() {
  let cells = "";
  const n = 9, size = 12;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const isFinder = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
    const on = isFinder ? ((x + y) % 4 !== 3) : (((x * 13 + y * 7 + x * y) % 5) < 2);
    if (on) cells += `<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="currentColor"/>`;
  }
  return `<div class="qr-box"><svg width="${n * 12}" height="${n * 12}" viewBox="0 0 ${n * size} ${n * size}" style="color:var(--ink); background:var(--surface);">${cells}</svg><div style="font-size:11.5px; color:var(--faint);">Scan to pay &middot; expires in 15:00</div></div>`;
}
function bankHtml() {
  return `<div class="bank-box">
    <div class="bank-row"><span>Account name</span><b>CARS24 UAE Trading LLC</b></div>
    <div class="bank-row"><span>IBAN</span><b>AE07 0331 0000 0123 4567 890</b></div>
    <div class="bank-row"><span>Reference</span><b>${STATE.orderId}</b></div>
  </div>`;
}

// ---------------------------------------------------------------- Assign DA modal

function openAssignModal(order) {
  renderDaList(order);
  document.getElementById("assign-modal").classList.add("open");
}
function renderDaList(order) {
  document.getElementById("da-list").innerHTML = DAS.map(d => {
    const atCapacity = d.todayCount >= d.maxPerDay;
    const selected = order.assignedDaId === d.id;
    const dot = d.status === "AVAILABLE" ? "#22C55E" : d.status === "ON_BREAK" ? "#F59E0B" : "#94A3B8";
    return `
    <div class="da-row ${selected ? "selected" : ""} ${atCapacity ? "disabled" : ""}" data-da="${d.id}">
      <div class="av">${initials(d.name)}<span class="stat" style="background:${dot}"></span></div>
      <div class="info"><div class="n">${d.name}</div><div class="m">${d.status.replace("_", " ")} &middot; ${d.todayCount}/${d.maxPerDay} today</div>${atCapacity ? `<div class="cap">At daily capacity</div>` : ""}</div>
      <div class="score"><div class="n">${d.score}</div><div class="m">score</div></div>
    </div>`;
  }).join("");
  document.querySelectorAll(".da-row").forEach(row => row.addEventListener("click", () => {
    if (row.classList.contains("disabled")) return;
    document.querySelectorAll(".da-row").forEach(r => r.classList.remove("selected"));
    row.classList.add("selected");
  }));
  icons();
}
document.getElementById("modal-close").addEventListener("click", () => document.getElementById("assign-modal").classList.remove("open"));
document.getElementById("modal-cancel").addEventListener("click", () => document.getElementById("assign-modal").classList.remove("open"));
document.getElementById("modal-assign").addEventListener("click", () => {
  const sel = document.querySelector(".da-row.selected");
  const order = findOrder(STATE.orderId);
  if (sel) order.assignedDaId = sel.dataset.da;
  document.getElementById("assign-modal").classList.remove("open");
  renderDetail();
});

// ---------------------------------------------------------------- Compare modal

function openCompareModal() {
  const cars = STATE.compareIds.map(id => CARS.find(c => c.id === id));
  const rows = [
    ["Price", c => c.price],
    ["Odometer", c => c.km],
    ["Fuel", c => c.fuel],
    ["Transmission", c => c.trans],
    ["Rating", c => c.rating + " / 5"],
  ];
  document.getElementById("cmp-table").innerHTML = `
    <thead><tr><th></th>${cars.map(c => `<th>${c.title}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(([label, fn]) => `<tr><td>${label}</td>${cars.map(c => `<td>${fn(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  document.getElementById("cmp-modal").classList.add("open");
}
document.getElementById("cmp-close").addEventListener("click", () => document.getElementById("cmp-modal").classList.remove("open"));
document.getElementById("cmp-close-2").addEventListener("click", () => document.getElementById("cmp-modal").classList.remove("open"));

// ---------------------------------------------------------------- tabs + role toggle

function setTab(tab) {
  STATE.tab = tab;
  document.querySelectorAll("#tabbar button").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + tab));
  if (tab === "queue") { renderHeaderUser(document.getElementById("header-user")); renderQueue(); }
  if (tab === "detail") { if (!STATE.orderId) STATE.orderId = ORDERS[0].id; renderDetail(); }
  if (tab === "oversight") { renderHeaderUser(document.getElementById("header-user-3")); renderOversight(); }
}

document.getElementById("tabbar").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tab]");
  if (btn) setTab(btn.dataset.tab);
});

document.getElementById("role-toggle").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-role]");
  if (!btn) return;
  STATE.role = btn.dataset.role;
  document.querySelectorAll("#role-toggle button").forEach(b => b.classList.toggle("active", b === btn));
  STATE.stepIndex = 0;
  if (STATE.tab === "queue") renderQueue();
  if (STATE.tab === "detail") renderDetail();
});

// ---------------------------------------------------------------- boot

setTab("queue");
icons();
