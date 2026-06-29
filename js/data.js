// ─── Protein Queen · Data Layer ─────────────────────────────────────────────
// Fetches and parses both Google Sheets tabs, caches in memory for the session.

const DataStore = (() => {
  let _ingredients = {};   // keyed by ingredient_id
  let _mealRows = [];      // flat array of all meal-ingredient rows
  let _loaded = false;

  // ── CSV Parser ────────────────────────────────────────────────────────────
  // Handles quoted fields (including commas inside quotes) and trims whitespace.
  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((h, i) => {
        row[h.trim()] = (values[i] ?? "").trim();
      });
      return row;
    }).filter(row => Object.values(row).some(v => v !== ""));
  }

  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current); current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  // ── Coerce types ──────────────────────────────────────────────────────────
  function toNum(v) { return parseFloat(v) || 0; }
  function toBool(v) { return v?.toUpperCase() === "TRUE"; }

  // ── Fetch ─────────────────────────────────────────────────────────────────
  async function fetchSheet(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    return res.text();
  }

  // ── Load (call once on page load) ─────────────────────────────────────────
  async function load() {
    if (_loaded) return;

    const [ingCSV, mealCSV] = await Promise.all([
      fetchSheet(SHEETS.ingredients),
      fetchSheet(SHEETS.mealIngredients),
    ]);

    // Parse ingredients → lookup object
    const ingRows = parseCSV(ingCSV);
    ingRows.forEach(row => {
      _ingredients[row.ingredient_id] = {
        id:              row.ingredient_id,
        name:            row.name,
        servingUnit:     row.serving_unit,
        servingSizeG:    toNum(row.serving_size_g),
        proteinG:        toNum(row.protein_g),
        fiberG:          toNum(row.fiber_g),
        calories:        toNum(row.calories),
        groceryCategory: row.grocery_category,
        source:          row.source || "usda",
      };
    });

    // Parse meal rows
    _mealRows = parseCSV(mealCSV).map(row => ({
      mealId:      row.meal_id,
      dayNum:      parseInt(row.day_num, 10),
      mealNum:     parseInt(row.meal_num, 10),
      dayTheme:    row.day_theme,
      mealName:    row.meal_name,
      ingredientId: row.ingredient_id,
      quantity:    toNum(row.quantity),
      isOptional:  toBool(row.is_optional),
      isStub:      toBool(row.is_stub),
      notes:       row.notes || "",
    }));

    _loaded = true;
  }

  // ── Accessors ─────────────────────────────────────────────────────────────
  function getIngredient(id) { return _ingredients[id] || null; }
  function getAllIngredients() { return _ingredients; }
  function getMealRows() { return _mealRows; }

  /** Returns one entry per unique meal, with day/meal metadata */
  function getMeals() {
    const seen = new Map();
    _mealRows.forEach(r => {
      if (!seen.has(r.mealId)) {
        seen.set(r.mealId, {
          mealId:   r.mealId,
          dayNum:   r.dayNum,
          mealNum:  r.mealNum,
          dayTheme: r.dayTheme,
          mealName: r.mealName,
          isStub:   r.isStub,
        });
      }
    });
    return Array.from(seen.values());
  }

  /** Returns unique days sorted by day number */
  function getDays() {
    const days = new Map();
    _mealRows.forEach(r => {
      if (!days.has(r.dayNum)) {
        days.set(r.dayNum, { dayNum: r.dayNum, dayTheme: r.dayTheme });
      }
    });
    return Array.from(days.values()).sort((a, b) => a.dayNum - b.dayNum);
  }

  /** Returns all rows for a given meal_id */
  function getRowsForMeal(mealId) {
    return _mealRows.filter(r => r.mealId === mealId);
  }

  /** Returns all rows for a given day */
  function getRowsForDay(dayNum) {
    return _mealRows.filter(r => r.dayNum === dayNum);
  }

  /** Returns all meals for a day, sorted by meal_num */
  function getMealsForDay(dayNum) {
    return getMeals()
      .filter(m => m.dayNum === dayNum)
      .sort((a, b) => a.mealNum - b.mealNum);
  }

  return { load, getIngredient, getAllIngredients, getMealRows, getMeals, getDays,
           getRowsForMeal, getRowsForDay, getMealsForDay };
})();
