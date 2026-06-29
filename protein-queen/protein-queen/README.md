# Protein Queen 👑

Interactive recipe and nutrition planning site. Fetches data from Google Sheets, runs all calculations in the browser, hosted free on GitHub Pages.

---

## Setup

### 1. Create your GitHub repo

1. Go to [github.com](https://github.com) → New repository
2. Name it `protein-queen` (or anything you like)
3. Set to **Public** (required for free GitHub Pages)
4. Don't initialize with README — you'll push these files

```bash
git init
git add .
git commit -m "Initial build"
git remote add origin https://github.com/YOUR_USERNAME/protein-queen.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repo → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Save

Your site will be live at `https://YOUR_USERNAME.github.io/protein-queen/` within a minute.

---

### 3. Set up Google Sheets

Create a new Google Sheet with **two tabs**:

#### Tab 1: `Ingredients`

| ingredient_id | name | serving_unit | serving_size_g | protein_g | fiber_g | calories | grocery_category | source |
|---|---|---|---|---|---|---|---|---|
| black_beans_canned | Black beans, canned, drained | 1 cup | 172 | 15 | 16 | 227 | Pantry & Canned | usda |
| chicken_breast_cooked | Chicken breast, cooked | 3 oz | 85 | 26 | 0 | 128 | Protein & Dairy | usda |

Valid `grocery_category` values:
- `Produce`
- `Protein & Dairy`
- `Frozen`
- `Pantry & Canned`
- `Bread & Grains`
- `Spices`

Set `source` to `package_label` for store-bought items (Aldi Parmesan chicken, Bob Evans mashed potatoes, etc.) — a 📦 badge will appear on those ingredient lines.

#### Tab 2: `MealIngredients`

| meal_id | day_num | meal_num | day_theme | meal_name | ingredient_id | quantity | is_optional | is_stub | notes |
|---|---|---|---|---|---|---|---|---|---|
| d4m2 | 4 | 2 | American-Inspired | Caesar Chickpea Chicken Salad | chicken_breast_cooked | 0.5 | FALSE | FALSE | grilled, baked, or rotisserie |

- `meal_id`: unique ID like `d4m2` = Day 4, Meal 2
- `quantity`: decimal servings (0.5, 1, 1.5, 2...)
- `is_stub`: set `TRUE` for days that are outline-only (shows "coming soon" badge)
- `is_optional`: `TRUE` = ingredient marked optional

#### Publish both tabs as CSV

For each tab:
1. **File → Share → Publish to web**
2. Select the tab from the dropdown
3. Choose **Comma-separated values (.csv)**
4. Click **Publish**
5. Copy the URL (you won't need it — see below)

---

### 4. Add your Sheet ID

1. Open your Google Sheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_LONG_ID_HERE/edit
   ```
3. Open `data/config.js` and replace `YOUR_SHEET_ID_HERE`:
   ```javascript
   const SHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms";
   ```
4. Commit and push — done.

---

### 5. Add recipe content

Open `js/recipes.js` and add entries for each meal. The key must match the `meal_id` in your Sheets.

```javascript
d7m3: {
  plateRatio: { starchy: 25, fibrous: 35, protein: 40 },
  steps: [
    "Brown ground turkey in a large pot with onion and garlic.",
    "Add canned tomatoes, beans, and broth. Simmer 20 minutes.",
    "Season with chili powder, cumin, salt. Taste and adjust.",
  ],
  tip: "💡 Chili always tastes better the next day. Make a double batch.",
  notes: "This one freezes perfectly — portion into containers after cooling.",
},
```

If a meal doesn't have a `plateRatio` in `recipes.js`, the site estimates one from the nutrition data. Add them over time as you go.

---

## File Structure

```
/
  index.html          ← Day browser (main view)
  grocery.html        ← Grocery list generator
  /css
    styles.css        ← All styles
    print.css         ← Print styles (grocery list only)
  /js
    app.js            ← Settings, shared UI utilities, page init
    data.js           ← Fetch + parse Sheets data
    nutrition.js      ← All calculation functions
    grocery.js        ← Grocery aggregation + formatting
    recipes.js        ← Static content: steps, tips, plate ratios
  /data
    config.js         ← Sheet ID + thresholds (only file you need to edit)
```

---

## Adding content over time

| Task | Where |
|---|---|
| Add a new ingredient | `Ingredients` tab in Sheets |
| Add a new meal | Rows in `MealIngredients` tab + entry in `recipes.js` |
| Change a nutrition value | `Ingredients` tab — everything updates automatically |
| Mark a day as coming soon | Set `is_stub: TRUE` on its meal rows |
| Exempt a day from flags | Add day number to `FLAG_EXEMPT_DAYS` in `data/config.js` |

---

## Special cases

**Day 32 (Pastapocalypse):** Already in `FLAG_EXEMPT_DAYS` — no ⚠️ flags will appear regardless of nutrition values.

**AlmeSan:** Add as a standard ingredient (`almeSan` or `almeSan_parmesan_sub`). Treat like any other ingredient entry.

**Package label items:** Set `source: "package_label"` in the Ingredients tab. A 📦 label badge appears on the ingredient line in meal cards for transparency.

---

## Nutrition flags

| Condition | Flag shown |
|---|---|
| Meal protein < 25g | ⚠️ on meal card |
| Day protein < 140g | ⚠️ on day summary |
| Day fiber < 50g | ⚠️ on day summary |
| Day calories > 3,000 | ⚠️ on day summary (only when cal toggle is on) |

Thresholds are in `data/config.js` — easy to adjust.

---

## Cost

**$0 forever.** GitHub Pages (free) + Google Sheets published CSV (free). No backend, no API keys, no subscriptions.
