require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require("./Routs/auth");
const nutritionRoutes = require("./Routs/nutritionRoutes");

const app = express();

connectDb();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/nutrition", nutritionRoutes);

const mealRoutes = require("./Routs/mealRouts");
app.use("/Meal", mealRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/diet", require("./Routs/Diet"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
