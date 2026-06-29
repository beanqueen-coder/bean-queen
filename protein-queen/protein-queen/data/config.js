// ─── Protein Queen · Data Config ───────────────────────────────────────────
// Update SHEET_ID below with your actual Google Sheets document ID.
// The ID is the long string in your Sheets URL:
//   https://docs.google.com/spreadsheets/d/SHEET_ID/edit
//
// Both tabs must be published as CSV:
//   File → Share → Publish to web → select tab → CSV → Publish

const SHEET_ID = "YOUR_SHEET_ID_HERE";

const SHEETS = {
  ingredients: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Ingredients`,
  mealIngredients: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=MealIngredients`,
};

// Days that are fully exempt from nutrition flags (e.g. themed exception days)
const FLAG_EXEMPT_DAYS = [32];

// Nutrition thresholds for flags
const THRESHOLDS = {
  mealProteinMin: 25,   // g — warn if meal protein below this
  dayProteinMin: 140,   // g — warn if day protein below this
  dayFiberMin: 50,      // g — warn if day fiber below this
  dayCaloriesMax: 3000, // cal — warn if day calories above this (only when cal toggle on)
};
