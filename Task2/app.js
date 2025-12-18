const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel"); 
const User = require("./models/userModel");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

// ===== Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");

// ===== Session setup =====
app.use(session({
  secret: "yourSecretKey", 
  resave: false,
  saveUninitialized: false
}));

// ===== Connect to MongoDB =====
mongoose
  .connect("mongodb://localhost:27017/InventoryDB")
  .then(() => {
    app.listen(port, () => console.log(`✅ Server running at: http://localhost:${port}/`));
    console.log("💾 Connected to MongoDB locally");
  })
  .catch((err) => console.error("Connection error:", err));

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect("/login");
}

// ===== Auth Routes =====
app.get("/register", (req, res) => {
  res.render("register", { errorMsg: "" });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { errorMsg: "⚠️ This user is already registered!" });
    }
    const user = new User({ username, password });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("register", { errorMsg: "⚠️ An error occurred during registration, please try again" });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { errorMsg: "" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { errorMsg: "⚠️ User not found, please register first!" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", { errorMsg: "⚠️ Incorrect password!" });
    }
    req.session.userId = user._id;
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.render("login", { errorMsg: "⚠️ An error occurred during login" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// ===== Routes =====

// Redirect base URL to products page
app.get("/", (req, res) => res.redirect("/products"));

// ===== Products CRUD + Search =====

// Get all products
app.get("/products", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products", { myTitle: "Products", products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching products", error });
  }
});

// Show form to add new product
app.get("/products/add", isAuthenticated, (req, res) => {
  res.render("add-product");
});

// Create new product
app.post("/products", isAuthenticated, async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      code: req.body.code,
      type: req.body.type,
      company: req.body.company,
      expiryDate: req.body.expiryDate,
    });
    await newProduct.save();
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    // Handle potential duplicate code error
    if (error.code === 11000) {
       return res.status(400).send("Product with this code already exists.");
    }
    res.status(400).send({ message: "Error creating product", error });
  }
});

// Show form to edit a product
app.get("/products/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("edit-product", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching product for edit", error });
  }
});

// Update a product by ID
app.post("/products/edit/:id", isAuthenticated, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error updating product", error });
  }
});


// Delete a product by ID
app.post("/products/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error deleting product", error });
  }
});

// Search products by name
app.get("/products/search", isAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.name;
    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" }
    });
    res.render("products", { myTitle: "Search Results", products });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error searching products", error });
  }
});
