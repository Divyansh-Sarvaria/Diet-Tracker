const express = require("express");
const router = express.Router();
const auth = require("../MiddleWare/authMiddleware");
const DietPlan = require("../Modal/DietPlan");

// ✅ SAVE DIET
router.post("/save", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { foods, totals, name } = req.body;

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

    plan = await DietPlan.create({
      userId,
      name,
      date: today,
      foods: finalFoods,
      totals,
    });

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
router.get("/all", auth, async (req, res) => {
  try {
    const plans = await DietPlan.find({ userId: req.user.id }).sort({
      createdAt: -1,
    }); // latest first

    res.json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (err) {
    console.error("GET ALL DIET ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// ❌ HARD DELETE DIET PLAN (permanent)
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const planId = req.params.id;

    const deletedPlan = await DietPlan.findOneAndDelete({
      _id: planId,
      userId, // 🔒 ensures ownership
    });

    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Plan permanently deleted",
      deletedPlanId: planId,
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
module.exports = router;
