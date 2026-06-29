// ─── Protein Queen · Grocery List ───────────────────────────────────────────

const GroceryList = (() => {

  // Canonical category order for output
  const CATEGORY_ORDER = [
    "Produce",
    "Protein & Dairy",
    "Frozen",
    "Pantry & Canned",
    "Bread & Grains",
    "Spices",
  ];

  /**
   * Given a Map of ingredient_id → { ingredient, totalQty },
   * returns an ordered array of { category, items[] } for rendering.
   * items: [{ name, quantity, unit, source }]
   */
  function groupByCategory(totalsMap) {
    const byCategory = {};

    totalsMap.forEach(({ ingredient, totalQty }) => {
      if (!ingredient) return;
      const cat = ingredient.groceryCategory || "Other";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push({
        name:     ingredient.name,
        quantity: totalQty,
        unit:     ingredient.servingUnit,
        source:   ingredient.source,
      });
    });

    // Sort items within each category alphabetically
    Object.values(byCategory).forEach(items => items.sort((a, b) => a.name.localeCompare(b.name)));

    // Return in canonical order, unknown categories appended
    const ordered = [];
    CATEGORY_ORDER.forEach(cat => {
      if (byCategory[cat]) ordered.push({ category: cat, items: byCategory[cat] });
    });
    Object.keys(byCategory).forEach(cat => {
      if (!CATEGORY_ORDER.includes(cat)) ordered.push({ category: cat, items: byCategory[cat] });
    });

    return ordered;
  }

  /** Format a quantity for display — fractional if needed */
  function fmtQty(n) {
    if (n % 1 === 0) return n.toString();
    // Try nice fractions
    const fracs = [[0.25,'¼'],[0.5,'½'],[0.75,'¾'],[0.33,'⅓'],[0.67,'⅔']];
    const whole = Math.floor(n);
    const frac  = n - whole;
    const match = fracs.find(([v]) => Math.abs(frac - v) < 0.04);
    if (match) return (whole > 0 ? whole : "") + match[1];
    return (Math.round(n * 10) / 10).toString();
  }

  /** Format a single grocery item as plain text (for copy/print) */
  function itemToText({ name, quantity, unit }) {
    return `${name} — ${fmtQty(quantity)} ${unit}`;
  }

  /** Format entire list as plain text */
  function toPlainText(groups, selectedDayNums) {
    const header = `🛒 Grocery List — ${selectedDayNums.map(d => `Day ${d}`).join(', ')}`;
    const lines  = [header, ""];
    groups.forEach(({ category, items }) => {
      lines.push(category.toUpperCase());
      items.forEach(item => lines.push(`• ${itemToText(item)}`));
      lines.push("");
    });
    return lines.join("\n").trim();
  }

  return { groupByCategory, fmtQty, itemToText, toPlainText };
})();
