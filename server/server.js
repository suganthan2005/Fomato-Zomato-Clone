const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses form data

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Define User model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

// Serve static files
app.use(express.static(path.join(__dirname, "../client")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/signup.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/restaurants.html"));
  });
  

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/order.html"));
  });

app.post("/signup", async (req, res) => {
  const { fullName, email } = req.body;


  try {
    // Save user to MongoDB
    const user = new User({ fullName, email });
    await user.save();

    // Send success message back to the signup page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Signup - Success</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
          }
          .success-message {
            color: green;
            font-size: 20px;
            margin-bottom: 20px;
          }
          a {
            text-decoration: none;
            color: #ff3a6d;
          }
        </style>
      </head>
      <body>
        <div class="success-message">Signup successful! Welcome, ${fullName}.</div>
        <a href="/signup">Go back to Signup</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error saving user:", err);

    if (err.code === 11000) {
     
      res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Signup - Error</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin-top: 50px;
            }
            .error-message {
              color: red;
              font-size: 20px;
              margin-bottom: 20px;
            }
            a {
              text-decoration: none;
              color: #ff3a6d;
            }
          </style>
        </head>
        <body>
          <div class="error-message">This email is already registered. Please use a different email.</div>
          <a href="/signup">Go back to Signup</a>
        </body>
        </html>
      `);
    } else {
      // Handle other errors
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Signup - Error</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin-top: 50px;
            }
            .error-message {
              color: red;
              font-size: 20px;
              margin-bottom: 20px;
            }
            a {
              text-decoration: none;
              color: #ff3a6d;
            }
          </style>
        </head>
        <body>
          <div class="error-message">An error occurred while saving your data. Please try again.</div>
          <a href="/signup">Go back to Signup</a>
        </body>
        </html>
      `);
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});