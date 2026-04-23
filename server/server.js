const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/MongoDB");
const productRoutes = require('./src/router/ProductRouter');

const app = express();
const PORT = process.env.PORT || 5006;

connectDB();

// Enable CORS
app.use(cors());

app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully!", status: "ok" });
});

app.use('/api/products', productRoutes);

// Export for Vercel serverless functions
module.exports = app;

// Start server locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}