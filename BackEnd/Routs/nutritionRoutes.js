const express = require("express");
const router = express.Router();
const auth = require("../MiddleWare/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const { query, grams = 100, page = 1 } = req.query;
    const pageSize = 15;

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=${pageSize}&pageNumber=${page}&api_key=${process.env.USDA_KEY}`,
    );

    const data = await response.json();

    const results = data.foods.map((foodItem) => {
      const nutrients = foodItem.foodNutrients;

      const getValue = (names) => {
        const nutrient = nutrients.find((n) => names.includes(n.nutrientName));
        return nutrient?.value || 0;
      };

      const multiplier = grams / 100;

      return {
        id: foodItem.fdcId, // 👈 IMPORTANT for next API
        name: foodItem.description,
        calories: +(getValue(["Energy"]) * multiplier).toFixed(2),

        protein: +(getValue(["Protein"]) * multiplier).toFixed(2),

        fat: +(
          getValue([
            "Total lipid (fat)",
            "Fatty acids, total saturated",
            "Total fat",
          ]) * multiplier
        ).toFixed(2),

        carbs: +(
          getValue(["Carbohydrate, by difference", "Total carbohydrate"]) *
          multiplier
        ).toFixed(2), // ✅ add
      };
    });

    res.json({ foods: results, total: data.totalHits });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { grams = 100 } = req.query;

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${id}?api_key=${process.env.USDA_KEY}`,
    );

    const data = await response.json();

    const nutrients = data.foodNutrients;

    const getValue = (names) => {
      const nutrient = nutrients.find((n) => names.includes(n.nutrientName));
      return nutrient?.value || 0;
    };

    const multiplier = grams / 100;

    res.json({
      name: data.description,
      grams,
      calories: +(getValue("Energy") * multiplier).toFixed(2),
      protein: +(getValue("Protein") * multiplier).toFixed(2),
      fat: +(getValue("Total lipid (fat)") * multiplier).toFixed(2),
      carbs: +(getValue("Carbohydrate, by difference") * multiplier).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
