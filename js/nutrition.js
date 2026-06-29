// ─── Protein Queen · Nutrition Calculator ───────────────────────────────────
// All calc happens in JS from raw Sheets data. No formula output consumed.

const Nutrition = (() => {

  function calcFromRows(rows) {
    return rows.reduce((acc, row) => {
      const ing = DataStore.getIngredient(row.ingredientId);
      if (!ing) return acc;
      acc.protein  += ing.proteinG  * row.quantity;
      acc.fiber    += ing.fiberG    * row.quantity;
      acc.calories += ing.calories  * row.quantity;
      return acc;
    }, { protein: 0, fiber: 0, calories: 0 });
  }

  /** Nutrition totals for one meal (per serving) */
  function forMeal(mealId) {
    const rows = DataStore.getRowsForMeal(mealId);
    return calcFromRows(rows);
  }

  /** Nutrition totals for a full day */
  function forDay(dayNum) {
    const rows = DataStore.getRowsForDay(dayNum);
    return calcFromRows(rows);
  }

  /**
   * Plate ratio for a meal — how calories break down across macro categories.
   * Uses a heuristic: protein cals = protein_g × 4, fiber/veg carbs
   * are estimated from fiber-heavy ingredients, starchy from the remainder.
   *
   * Returns { starchy: %, fibrous: %, protein: % } (integers summing to 100)
   */
  function plateRatio(mealId) {
    // Pull from static recipes.js if available
    const static_ = RecipeContent && RecipeContent.getPlateRatio
      ? RecipeContent.getPlateRatio(mealId)
      : null;
    if (static_) return static_;

    // Fallback: estimate from nutrition
    const { protein, fiber, calories } = forMeal(mealId);
    if (!calories) return { starchy: 33, fibrous: 33, protein: 34 };
    const proteinCal = protein * 4;
    const fiberCal   = fiber  * 2; // rough proxy
    const starchyCal = Math.max(0, calories - proteinCal - fiberCal);
    const total = proteinCal + fiberCal + starchyCal;
    return {
      starchy: Math.round((starchyCal / total) * 100),
      fibrous: Math.round((fiberCal   / total) * 100),
      protein: Math.round((proteinCal / total) * 100),
    };
  }

  /** Flags for a meal */
  function mealFlags(mealId, dayNum) {
    if (FLAG_EXEMPT_DAYS.includes(dayNum)) return [];
    const { protein } = forMeal(mealId);
    const flags = [];
    if (protein < THRESHOLDS.mealProteinMin) {
      flags.push({ type: "warn", msg: `Only ${Math.round(protein)}g protein` });
    }
    return flags;
  }

  /** Flags for a day */
  function dayFlags(dayNum, showCalories) {
    if (FLAG_EXEMPT_DAYS.includes(dayNum)) return [];
    const { protein, fiber, calories } = forDay(dayNum);
    const flags = [];
    if (protein  < THRESHOLDS.dayProteinMin) flags.push({ type: "warn", msg: `${Math.round(protein)}g protein (goal: ${THRESHOLDS.dayProteinMin}g)` });
    if (fiber    < THRESHOLDS.dayFiberMin)   flags.push({ type: "warn", msg: `${Math.round(fiber)}g fiber (goal: ${THRESHOLDS.dayFiberMin}g)` });
    if (showCalories && calories > THRESHOLDS.dayCaloriesMax) {
      flags.push({ type: "warn", msg: `${Math.round(calories)} cal (limit: ${THRESHOLDS.dayCaloriesMax})` });
    }
    return flags;
  }

  /** Format a number for display — one decimal if needed */
  function fmt(n) {
    const r = Math.round(n * 10) / 10;
    return r % 1 === 0 ? r.toString() : r.toFixed(1);
  }

  /**
   * Grocery aggregation.
   * selectedMeals: Array of { mealId, quantity (integer) }
   * Returns: Map of ingredient_id → { ingredient, totalQty }
   */
  function groceryList(selectedMeals) {
    const totals = new Map();
    selectedMeals.forEach(({ mealId, quantity }) => {
      DataStore.getRowsForMeal(mealId).forEach(row => {
        if (!totals.has(row.ingredientId)) {
          totals.set(row.ingredientId, { ingredient: DataStore.getIngredient(row.ingredientId), totalQty: 0 });
        }
        totals.get(row.ingredientId).totalQty += row.quantity * quantity;
      });
    });
    return totals;
  }

  return { forMeal, forDay, plateRatio, mealFlags, dayFlags, fmt, groceryList };
})();
