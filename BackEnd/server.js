const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require("./Routs/auth");
const app = express();
app.use(cors());

connectDb();
app.use(express.json());
app.use(authRoutes);

app.get("/", (req, res) => {
  res.send("api is running");
});

const port = 5000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
