// ─── Protein Queen · Static Recipe Content ──────────────────────────────────
// This file holds all content that never changes and doesn't affect nutrition:
//   - Step-by-step cooking instructions
//   - Plate ratio percentages (starchy / fibrous / protein %)
//   - 💡 Tip/technique notes
//   - Personal experience notes
//   - Day-level intro text
//
// Keyed by meal_id (matching MealIngredients tab).
// To add a new meal: add an entry below with the same meal_id used in Sheets.

const RecipeContent = (() => {

  // ── Day intros ─────────────────────────────────────────────────────────────
  const DAY_INTROS = {
    1:  "A clean, high-protein opener. Everything here is weeknight-fast — nothing needs more than 20 minutes.",
    2:  "Egg-forward day. Versatile, cheap, and stupidly protein-dense when you lean into them.",
    3:  "Plant-forward protein day. Beans and legumes carrying the load.",
    4:  "American-Inspired. Comfort food that doesn't tank your macros.",
    5:  "Mediterranean vibes. Olive oil, feta, chickpeas — the holy trinity.",
    6:  "Asian-Inspired. Soy, sesame, and ginger doing heavy lifting.",
    7:  "Soup and stew day. Batch-cook friendly — make double and freeze half.",
    10: "Sheet pan day. One pan, one oven, four meals.",
    13: "Grain bowl day. Build-your-own format, infinitely swappable.",
    18: "Wrap and sandwich day. Handheld protein.",
    20: "Stir-fry day. High heat, fast cook, maximum flavor.",
    26: "Taco Tuesday (any day). The eternal format.",
    31: "Bowl day redux. Different grains, same logic.",
    32: "🍝 Pastapocalypse. Today the rules are suspended. Eat the pasta. All the pasta. Pasta is life. Protein targets and plate ratios do not apply to Day 32 — it exists outside the normal framework and should be celebrated accordingly.",
  };

  // ── Meal content ───────────────────────────────────────────────────────────
  // Each entry: { plateRatio, steps, tip, notes }
  // plateRatio: { starchy: %, fibrous: %, protein: % } — integers summing to 100
  // steps: Array of strings
  // tip: string (optional)
  // notes: string (optional — personal experience, variations, etc.)
  const MEALS = {

    // ── DAY 1 ────────────────────────────────────────────────────────────────
    d1m1: {
      plateRatio: { starchy: 20, fibrous: 30, protein: 50 },
      steps: [
        "Scramble eggs with cottage cheese — mix before cooking for fluffier texture.",
        "Cook over medium-low heat, stirring gently. Pull off heat while still slightly wet.",
        "Toast Ezekiel bread. Layer with sliced tomato and avocado.",
        "Plate eggs alongside toast. Season with salt, pepper, and red pepper flakes.",
      ],
      tip: "💡 Adding cottage cheese to scrambled eggs boosts protein without changing texture much — it melts in. Don't skip the low-and-slow heat.",
    },

    d1m2: {
      plateRatio: { starchy: 15, fibrous: 40, protein: 45 },
      steps: [
        "Drain and rinse chickpeas. Pat dry with paper towel for better texture.",
        "Combine with diced cucumber, cherry tomatoes, red onion, and parsley.",
        "Dress with lemon juice, olive oil, salt, and cumin.",
        "Add crumbled feta. Toss gently. Serve at room temp or chilled.",
      ],
      tip: "💡 Patting the chickpeas dry isn't optional — wet chickpeas make watery salad. Takes 30 seconds and makes a real difference.",
    },

    d1m3: {
      plateRatio: { starchy: 25, fibrous: 25, protein: 50 },
      steps: [
        "Season chicken breast with garlic powder, paprika, salt, and pepper.",
        "Cook in a hot skillet with olive oil, 5–6 min per side until 165°F internal.",
        "Rest 5 minutes before slicing.",
        "Serve over cooked quinoa with roasted vegetables.",
      ],
      tip: "💡 Resting the chicken is non-negotiable. Cut into it right away and you've lost all the juice onto the cutting board.",
    },

    d1m4: {
      plateRatio: { starchy: 10, fibrous: 30, protein: 60 },
      steps: [
        "Mix Greek yogurt with a scoop of protein powder and a splash of vanilla.",
        "Top with mixed berries and a small handful of granola.",
        "Drizzle with honey if desired.",
      ],
      tip: "💡 Stir the protein powder into the yogurt before adding toppings — if you add it on top it clumps. Vanilla whey blends cleanest here.",
    },

    // ── DAY 4 (American-Inspired) ─────────────────────────────────────────────
    d4m1: {
      plateRatio: { starchy: 30, fibrous: 20, protein: 50 },
      steps: [
        "Cook turkey or lean beef in a skillet, breaking into crumbles. Season with taco seasoning.",
        "Scramble eggs separately. Season with salt and pepper.",
        "Warm a whole-wheat tortilla in a dry pan or microwave.",
        "Layer eggs, meat, cheese, and salsa. Fold and serve.",
      ],
      tip: "💡 Cooking the meat and eggs separately gives you better texture on both — the eggs don't get gray and the meat doesn't steam.",
    },

    d4m2: {
      plateRatio: { starchy: 15, fibrous: 40, protein: 45 },
      steps: [
        "Tear romaine into bite-sized pieces.",
        "Drain chickpeas; add to bowl with romaine.",
        "Slice or shred cooked chicken breast. Add to bowl.",
        "Dress with Caesar dressing (light) or a lemon-tahini variant.",
        "Top with shaved Parmesan and black pepper.",
        "Add croutons last if using, for texture.",
      ],
      tip: "💡 Chickpeas as crouton replacement: toss drained chickpeas with olive oil and salt, roast at 425°F for 25 min. Crunchier and 15g more protein.",
      notes: "Rotisserie chicken works perfectly here and saves 20 min. Don't skip the lemon — it lifts the whole salad.",
    },

    d4m3: {
      plateRatio: { starchy: 35, fibrous: 20, protein: 45 },
      steps: [
        "Season lean ground beef with garlic powder, onion powder, Worcestershire, salt, and pepper.",
        "Form into a patty (or cook as a smash burger — recommended).",
        "Cook in a cast iron pan over high heat, 2–3 min per side for smash. No pressing after the smash.",
        "Melt cheese on top in the last 30 seconds.",
        "Toast bun. Build: lettuce, tomato, patty, sauce.",
        "Serve with sweet potato fries (roast at 425°F in one layer with olive oil and salt).",
      ],
      tip: "💡 Smash burger technique: place ball in pan, smash immediately with a spatula and hold for 10 seconds. Don't smash again. This maximizes the crust.",
    },

    d4m4: {
      plateRatio: { starchy: 15, fibrous: 20, protein: 65 },
      steps: [
        "Mix cottage cheese with cinnamon and a drizzle of honey.",
        "Slice banana or apple alongside.",
        "Optional: add a tablespoon of nut butter on top.",
      ],
      tip: "💡 This is the most underrated snack on the plan. Cottage cheese haters: try it with cinnamon and honey before writing it off.",
    },

    // ── Add remaining days below as recipes are written ───────────────────────
    // Template:
    // dXmY: {
    //   plateRatio: { starchy: ?, fibrous: ?, protein: ? },
    //   steps: ["...", "..."],
    //   tip: "💡 ...",
    //   notes: "...",
    // },

  };

  // ── Public API ─────────────────────────────────────────────────────────────
  function getDayIntro(dayNum) { return DAY_INTROS[dayNum] || null; }
  function getMeal(mealId) { return MEALS[mealId] || null; }
  function getSteps(mealId) { return MEALS[mealId]?.steps || []; }
  function getTip(mealId) { return MEALS[mealId]?.tip || null; }
  function getNotes(mealId) { return MEALS[mealId]?.notes || null; }
  function getPlateRatio(mealId) { return MEALS[mealId]?.plateRatio || null; }

  return { getDayIntro, getMeal, getSteps, getTip, getNotes, getPlateRatio };
})();
