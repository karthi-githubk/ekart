const User = require("../models/UserModel");
const fs = require("fs");
const path = require("path");
const { createSecretToken } = require("../config/secretToken");
const config = require("config");
const BASE_URL = config.get("BASE_URL");
const bcrypt = require("bcryptjs");
const emailUtil = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const JWT_TOKEN_KEY = config.get("JWT_TOKEN_KEY");
const nodemailer = require("nodemailer");
const CLIENT_URL = config.get("CLIENT_URL");
const { sendEmail } = require("../utils/sendEmail");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if the required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create a new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: role || "customer",
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Send email to the user
    const emailSubject = "Welcome to eKart";
    const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="background-color: #4CAF50; padding: 10px;">
            <h1 style="color: #fff; text-align: center;">eKart</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #4CAF50;">Welcome to eKart, ${name}!</h2>
            <h1 style="color: black; text-transform: uppercase; letter-spacing: 2px; text-align: center; font-weight: bold;">Thank you for signing up with eKart. We're excited to have you on board!</h1>
            <p><strong>Email:</strong> ${email}</p>
            
            <!-- Section 1: Purchases -->
            <div style="margin-top: 20px;">
              <h3 style="color: #4CAF50; font-size: 18px; font-weight: bold;">Purchase Products</h3>
              <div style="display: flex; flex-wrap: wrap;">

                
                <div style="background-color: #dfe4ea; border: 1px solid #57606f; border-radius: 5px; padding: 10px; margin: 10px; width: 200px; height:200px">
                  <img src="https://a.storyblok.com/f/165154/1280x720/a4c06ff7b1/01_hero-image_20-trending-ecommerce-products-to-sell-in-2023.jpg/m/" alt="Product 1" style="width: 100%; border-radius: 5px;">
                  <p style="font-weight: bold; margin-top: 10px;">Dress</p>
                  <p style="color: #4CAF50; font-weight: bold;">₹1999.99</p>
                </div>

                 <div style="background-color: #D8EFD3; border: 1px solid #57606f; border-radius: 5px; padding: 10px; margin: 10px; width: 200px;height:200px">
                  <img src="https://images.autods.com/OfficialSite/New/20201103091044/The-Best-10-Trending-Tech-Gadgets-Dropshipping-Products-To-Sell-in-2021.png" alt="Product 2" style="width: 100%; border-radius: 5px;">
                  <p style="font-weight: bold; margin-top: 10px;">Watches</p>
                  <p style="color: #4CAF50; font-weight: bold;">₹3456.99</p>
                </div>

                

      
                <!-- Product Card 2 -->
                <div style="background-color: #dfe4ea; border: 1px solid #57606f; border-radius: 5px; padding: 10px; margin: 10px; width: 200px; height:200px">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6yduxv4MBXeSiR-YCcAvn7RNlCYhXZEuvfA&s" alt="Product 2" style="width: 100%; border-radius: 5px;">
                  <p style="font-weight: bold; margin-top: 10px;">Watches</p>
                  <p style="color: #4CAF50; font-weight: bold;">₹19000</p>
                </div>
      
                <!-- Product Card 3 -->
                <div style="background-color: #D8EFD3; border: 1px solid #57606f; border-radius: 5px; padding: 10px; margin: 10px; width: 200px; height:200px">
                  <img src="https://in-exstatic-vivofs.vivo.com/gdHFRinHEMrj3yPG/1711104354021/f91329d65e0c0558e4b1964cc5d080dd.jpg" alt="Product 3" style="width: 100%; border-radius: 5px;">
                  <p style="font-weight: bold; margin-top: 10px;">Mobile's</p>
                  <p style="color: #4CAF50; font-weight: bold;">₹24000</p>
                </div>
              </div>
            </div>
      
  <p style="text-transform: uppercase; letter-spacing: 7px; text-align: center; font-weight: bold;">Happy Shopping!</p>      
            <!-- Section 3: Additional Image -->
            <div style="border: 1px solid #ccc; border-radius: 5px; padding: 10px; margin: 10px;">
              <img src="https://static.vecteezy.com/system/resources/previews/002/311/421/original/back-to-school-sale-promotion-poster-with-shopping-cart-vector.jpg" alt="Additional Image" style="width: 100%;height:450px; border-radius: 5px;">
            </div>
      
            <p style="color: #4CAF50; letter-spacing: 7px;  font-weight: bold;">The eKart Team</p>
          </div>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} eKart. All rights reserved.</p>
            <p style="margin: 0;"><a href="${CLIENT_URL}" style="color: #4CAF50; text-decoration: none;">Visit our website</a></p>
          </div>
        </div>
      `;

    await sendEmail(user.email, emailSubject, emailBody);

    // Respond with the saved user (excluding the password)
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Edit a user by ID
exports.editUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if the required fields are present
    if (!name || !email) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if a user with the same email already exists (exclude the current user)
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Update the user data
    const updatedData = { name, email, phone };

    const imageFile = req.files && req.files.image;

    if (imageFile) {
      // Check image size
      if (imageFile.size > 3 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "Image size exceeds the 3MB limit" });
      }

      // Generate a unique filename
      const uniqueImageFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/users",
        uniqueImageFileName
      );

      try {
        // Move the image file to the designated directory
        await imageFile.mv(uploadPath);

  
        if (existingUser.image && existingUser.image.length > 0) {
          for (const oldImage of existingUser.image) {
            const oldImagePath = path.join(
              __dirname,
              "../uploads/users",
              oldImage
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
        }

        // Update the image filename in the data
        updatedData.image = [...existingUser.image, uniqueImageFileName];
      } catch (err) {
        console.error("Error moving the image file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    // Include the role only if it's provided
    if (role) {
      updatedData.role = role;
    }

    if (password) {
      updatedData.password = password;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user (excluding the password)
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// .select('-password'); // Exclude the password field


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: [{ key: "error", value: "All fields are required" }],
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: [
          { key: "error", value: "User with this email does not exist" },
        ],
      });
    }

    if (password !== user.password) {
      return res.status(400).json({
        message: [{ key: "error", value: "Incorrect password" }],
      });
    }

    // Check if it's the first-time login
    const isFirstTimeLogin = user.firstTimeLoginDone;

    if (isFirstTimeLogin) {
      await User.updateOne({ _id: user._id }, { firstTimeLoginDone: false });
    }

    const userWithImage = await User.findOne({ email }, "image");

    const sanitizedUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      firstTimeLoginDone: isFirstTimeLogin,
      image: userWithImage.image,
      role: user.role, // Changed from userRole to role
    };

    const token = createSecretToken(user._id);

    return res.status(201).json({
      message: [
        { key: "success", value: `${user.name} logged in successfully` },
      ],
      user: sanitizedUser,
      token: token,
      role: user.role, // Changed from userRole to role
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal Server Error" }],
    });
  }
};
