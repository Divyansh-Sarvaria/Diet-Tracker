const mongoose = require("mongoose");

const dietPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    foods: [
      {
        id: Number,
        name: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        quantity: Number,
      },
    ],
    totals: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DietPlan", dietPlanSchema);
