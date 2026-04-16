const express = require("express");
const User = require("../Modal/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../MiddleWare/authMiddleware");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "MY_SECRET_KEY", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username & password required" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username protein dailyCalories",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.username,
      protein: user.protein,
      dailyCalories: user.dailyCalories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const saveProfile = async (req, res) => {
  try {
    const { protein, dailyCalories } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        protein,
        dailyCalories,
      },
      { new: true },
    ).select("username protein dailyCalories");

    res.json({
      message: "Profile updated",
      name: user.username,
      protein: user.protein,
      dailyCalories: user.dailyCalories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
router.post("/login", login);
router.post("/signup", signup);
router.route("/profile").get(auth, getProfile).put(auth, saveProfile);
module.exports = router;
