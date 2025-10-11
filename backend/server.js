const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// sample products
const products = [
  {
      id: 1,
      name: 'Ultrabook X1',
      description: 'Slim, fast, all-day battery. Perfect for work and travel.',
      price: 1299,
      imageUrl: 'assets/ultrabook.jpg',
      category: 'Laptops',
      rating: 4.7,
      stock: 5
    },
    {
      id: 5,
      name: 'Gaming Laptop G15',
      description: 'RTX graphics, 144Hz display, and advanced cooling.',
      price: 1599,
      imageUrl: 'assets/gaminglaptop.jpg',
      category: 'Laptops',
      rating: 4.6,
      stock: 9
    },
    {
      id: 6,
      name: 'Business Laptop Pro 14',
      description: 'Lightweight, secure, and built for productivity on the go.',
      price: 1149,
      imageUrl: 'assets/businesslaptop.jpg',
      category: 'Laptops',
      rating: 4.4,
      stock: 16
    },
    {
      id: 2,
      name: 'Noise-Cancel Headphones',
      description: 'Immersive sound with adaptive noise cancellation.',
      price: 299,
      imageUrl: 'assets/headphones.jpg',
      category: 'Accessories',
      rating: 4.5,
      stock: 24
    },
    {
      id: 7,
      name: 'Wireless Earbuds',
      description: 'Compact earbuds with ANC and wireless charging case.',
      price: 149,
      imageUrl: 'assets/wirelessearbuds.jpg',
      category: 'Accessories',
      rating: 4.3,
      stock: 40
    },
    {
      id: 8,
      name: 'Mechanical Keyboard',
      description: 'Tactile switches, per-key RGB, and PBT keycaps.',
      price: 129,
      imageUrl: 'assets/keyboard.jpg',
      category: 'Accessories',
      rating: 4.6,
      stock: 28
    },
    {
      id: 3,
      name: 'Smartwatch Pro',
      description: 'Health tracking, GPS, and 7-day battery life.',
      price: 249,
      imageUrl: 'assets/smartwatchpro.jpg',
      category: 'Wearables',
      rating: 4.2,
      stock: 0
    },
    {
      id: 9,
      name: 'Fitness Band 7',
      description: 'Sleep tracking, SPO2, and 14-day battery life.',
      price: 59,
      imageUrl: 'assets/fitnessBand.jpg',
      category: 'Wearables',
      rating: 4.1,
      stock: 34
    },
    {
      id: 10,
      name: 'Smartwatch Lite',
      description: 'Lightweight smartwatch with AMOLED display and GPS.',
      price: 179,
      imageUrl: 'assets/smartWatchLite.png',
      category: 'Wearables',
      rating: 4.0,
      stock: 22
    },
    {
      id: 4,
      name: '4K Action Camera',
      description: 'Stabilized 4K60, waterproof, compact form factor.',
      price: 349,
      imageUrl: 'assets/camera.jpg',
      category: 'Cameras',
      rating: 4.4,
      stock: 12
    }
    ,
    {
      id: 11,
      name: 'Mirrorless Camera XT-4',
      description: 'APS-C sensor, IBIS, and stunning color science.',
      price: 1699,
      imageUrl: 'assets/mirrorlessCamera.jpg',
      category: 'Cameras',
      rating: 4.8,
      stock: 7
    },
    {
      id: 12,
      name: 'Prime Lens 50mm f/1.8',
      description: 'Crisp portraits with beautiful background blur.',
      price: 199,
      imageUrl: 'assets/primelens.jpg',
      category: 'Cameras',
      rating: 4.6,
      stock: 18
    }
];

// API endpoints
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});


const users = []; 
const SECRET_KEY = "your_secret_key";

// Signup route
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.json({ message: "User created" });
});
// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token,email });
});


app.get("/api/profile", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    res.json({ email: decoded.email });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});
module.exports = app;
