const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  console.log('Login route hit');
  console.log('Request body:', req.body);
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = password === user.password; // Temporary solution, replace with proper hashing (e.g., bcrypt)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // User authenticated, respond with JSON
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, fullName, address, city, state, zipCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    
    const hashedPassword = "abcd"

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      location: {
        address,
        city,
        state,
        zipCode
      },
      role: 'resident' // Default role
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Signup error:", error); // Detailed error logging
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
});
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  console.log("GET /api/users route hit");
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    console.error("Error in GET /api/users/id:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a user
router.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/points/all/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const pointsData = {
      points: user.points,
      gained_points: user.gained_points,
      gifted_points: user.gifted_points,
      available_points: user.available_points
    };

    res.send(pointsData);
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
