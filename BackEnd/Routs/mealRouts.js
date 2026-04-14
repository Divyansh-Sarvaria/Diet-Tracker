const express = require("express");
const router = express.Router();
const auth = require("../MiddleWare/authMiddleware");
const Meal = require("../Modal/meal");

router.post("/add", auth, async (req, res) => {
  try {
    const { foodName, grams, calories, protein, carbs, fat } = req.body;

    const meal = new Meal({
      userId: req.user.id,
      foodName,
      grams,
      calories,
      protein,
      carbs,
      fat,
    });

    await meal.save();

    res.json({ message: "Meal added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/today", auth, async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const meals = await Meal.find({
    userId: req.user.id,
    date: { $gte: start },
  });

  res.json(meals);
});
module.exports = router;
