const express = require("express");
const cors = require("cors");

require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API çalışıyor");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server çalışıyor: ${PORT}`);
});