// ─── Protein Queen · App Entry Point ────────────────────────────────────────

const App = (() => {

  // ── Settings (localStorage) ────────────────────────────────────────────────
  const Settings = {
    KEYS: { showCalories: "pq_showCalories" },
    get showCalories() { return localStorage.getItem(this.KEYS.showCalories) === "true"; },
    set showCalories(v) { localStorage.setItem(this.KEYS.showCalories, v); },
  };

  // ── Error display ──────────────────────────────────────────────────────────
  function showError(msg) {
    const el = document.getElementById("load-error");
    if (el) { el.textContent = msg; el.hidden = false; }
    const spinner = document.getElementById("spinner");
    if (spinner) spinner.hidden = true;
    console.error("[Protein Queen]", msg);
  }

  function hideSpinner() {
    const spinner = document.getElementById("spinner");
    if (spinner) spinner.hidden = true;
  }

  // ── Settings modal ─────────────────────────────────────────────────────────
  function initSettingsModal() {
    const btn    = document.getElementById("settings-btn");
    const modal  = document.getElementById("settings-modal");
    const close  = document.getElementById("settings-close");
    const toggle = document.getElementById("cal-toggle");
    const label  = document.getElementById("cal-toggle-label");

    if (!btn || !modal) return;

    // Sync toggle to current setting
    toggle.checked = Settings.showCalories;
    updateCalLabel();

    btn.addEventListener("click", () => { modal.hidden = false; });
    close.addEventListener("click", () => { modal.hidden = true; });
    modal.addEventListener("click", e => { if (e.target === modal) modal.hidden = true; });

    toggle.addEventListener("change", () => {
      Settings.showCalories = toggle.checked;
      updateCalLabel();
      document.dispatchEvent(new CustomEvent("pq:settingsChanged", { detail: { showCalories: toggle.checked } }));
    });

    function updateCalLabel() {
      // Don't reveal the word "calories" until the toggle is on
      label.textContent = toggle.checked ? "Showing additional nutrition info (calories)" : "Show additional nutrition info";
    }
  }

  // ── Shared: render a plate ratio bar ──────────────────────────────────────
  function renderPlateBar(mealId) {
    const ratio = Nutrition.plateRatio(mealId);
    const bar = document.createElement("div");
    bar.className = "plate-bar";
    bar.setAttribute("aria-label", `Plate: ${ratio.starchy}% starchy carbs, ${ratio.fibrous}% fibrous carbs, ${ratio.protein}% protein`);

    const segments = [
      { cls: "starchy", pct: ratio.starchy, label: "Starchy" },
      { cls: "fibrous", pct: ratio.fibrous, label: "Fibrous" },
      { cls: "protein", pct: ratio.protein, label: "Protein" },
    ];
    segments.forEach(({ cls, pct, label }) => {
      if (pct <= 0) return;
      const seg = document.createElement("span");
      seg.className = `plate-seg plate-seg--${cls}`;
      seg.style.width = `${pct}%`;
      seg.title = `${label}: ${pct}%`;
      bar.appendChild(seg);
    });

    const legend = document.createElement("div");
    legend.className = "plate-legend";
    segments.filter(s => s.pct > 0).forEach(({ cls, pct, label }) => {
      const item = document.createElement("span");
      item.className = `legend-item legend-item--${cls}`;
      item.textContent = `${label} ${pct}%`;
      legend.appendChild(item);
    });

    const wrap = document.createElement("div");
    wrap.className = "plate-bar-wrap";
    wrap.appendChild(bar);
    wrap.appendChild(legend);
    return wrap;
  }

  // ── Shared: render nutrition row ──────────────────────────────────────────
  function renderNutritionRow(nutrition, showCalories, isDay = false) {
    const row = document.createElement("div");
    row.className = "nutrition-row" + (isDay ? " nutrition-row--day" : "");

    const p = document.createElement("span");
    p.className = "nutr-val nutr-val--protein";
    p.innerHTML = `<strong>${Math.round(nutrition.protein)}g</strong> protein`;

    const f = document.createElement("span");
    f.className = "nutr-val nutr-val--fiber";
    f.innerHTML = `<strong>${Math.round(nutrition.fiber)}g</strong> fiber`;

    row.appendChild(p);
    row.appendChild(f);

    if (showCalories) {
      const c = document.createElement("span");
      c.className = "nutr-val nutr-val--cal";
      c.innerHTML = `<strong>${Math.round(nutrition.calories)}</strong> cal`;
      row.appendChild(c);
    }

    return row;
  }

  // ── Shared: render flag badges ─────────────────────────────────────────────
  function renderFlags(flags) {
    if (!flags.length) return null;
    const wrap = document.createElement("div");
    wrap.className = "flags";
    flags.forEach(({ msg }) => {
      const badge = document.createElement("span");
      badge.className = "flag-badge";
      badge.textContent = `⚠️ ${msg}`;
      wrap.appendChild(badge);
    });
    return wrap;
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  async function init(pageInit) {
    initSettingsModal();

    try {
      await DataStore.load();
      hideSpinner();
      pageInit({ showCalories: Settings.showCalories });
    } catch (err) {
      showError("Unable to load nutrition data. Check your connection and refresh.");
      console.error(err);
    }

    // Re-render when settings change
    document.addEventListener("pq:settingsChanged", (e) => {
      pageInit({ showCalories: e.detail.showCalories });
    });
  }

  return { init, Settings, showError, renderPlateBar, renderNutritionRow, renderFlags };
})();
