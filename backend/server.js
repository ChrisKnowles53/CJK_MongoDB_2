require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./productModel");

// Initializes a new Express application
const app = express();

// Use CORS middleware to handle Cross Origin Resource Sharing
app.use(cors());

// Parses incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, // Allows to use the new MongoDB driver's useNewUrlParser.
  useUnifiedTopology: true, // Allows to use the new MongoDB driver's new connection management engine.
});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", (error) => console.error("Connection error: ", error));

// Bind connection to open event (to get notification of successful connection)
db.once("open", () => console.log("Connected to MongoDB"));

// Define route to get all products
app.get("/products", async (req, res) => {
  try {
    // Use Mongoose model's find method to fetch all products from MongoDB
    const products = await Product.find();

    console.log("Products:", products); // Log the fetched products to console

    // Send the fetched products as JSON response
    res.json(products);
  } catch (err) {
    console.error("Error while handling /products:", err); // Log any errors

    // Send error message as JSON response with status 500 (Internal Server Error)
    res.status(500).json({ message: err.message });
  }
});

//Define route to post a new product
app.post('/products', async (req, res) => {
 const product = new Product({
     name: req.body.name,
     price: req.body.price,
     category: req.body.category,
     image: req.body.image,
     // Add other fields here to suit your document structure
 });

 try {
     const newProduct = await product.save();
     res.status(201).json(newProduct);
 } catch (err) {
     res.status(400).json({ message: err.message });
 }
});

app.listen(5000, () => console.log("Server started on port 5000"));
