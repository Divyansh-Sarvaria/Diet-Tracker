const express = require("express");
const router = express.Router();
const auth = require("../MiddleWare/authMiddleware");
const DietPlan = require("../Modal/DietPlan");

// ✅ SAVE DIET
router.post("/save", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { foods, totals } = req.body;

    const today = new Date().toISOString().split("T")[0];

    // Group foods by id (merge quantity)
    const grouped = {};

    foods.forEach((f) => {
      if (!grouped[f.id]) {
        grouped[f.id] = { ...f, quantity: 1 };
      } else {
        grouped[f.id].quantity++;
      }
    });

    const finalFoods = Object.values(grouped);

    // Check if already exists → overwrite
    let plan = await DietPlan.findOne({ userId, date: today });

    if (plan) {
      plan.foods = finalFoods;
      plan.totals = totals;
      await plan.save();
    } else {
      plan = await DietPlan.create({
        userId,
        date: today,
        foods: finalFoods,
        totals,
      });
    }

    res.json({ success: true, plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving diet plan" });
  }
});
router.get("/getdiet", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date().toISOString().split("T")[0];

    const plan = await DietPlan.findOne({ userId, date: today });

    if (!plan) {
      return res.json({
        success: true,  
        message: "No diet found for today",
        plan: null,
      });
    }

    res.json({
      success: true,
      plan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching diet plan" });
  }
});
module.exports = router;
