const Product = require("../models/ProductModel");
const fs = require("fs");
const path = require("path");

// Create a new task
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, ratings, tags } = req.body;

    // Check if the required fields are present
    if (!name || !description || !price || !ratings || !stock) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if an image is present in the request
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageFiles = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

    // Check image sizes
    for (const imageFile of imageFiles) {
      if (imageFile.size > 3 * 1024 * 1024) {
        return res.status(400).json({ message: "Image size exceeds the 3MB limit" });
      }
    }

    const imageFileNames = [];
    for (const imageFile of imageFiles) {
      const uniqueImageFileName = `${Date.now()}_${imageFile.name}`;
      const imageUploadPath = path.join(__dirname, "../uploads/product", uniqueImageFileName);

      try {
        // Move the image file to the designated directory
        await imageFile.mv(imageUploadPath);
        imageFileNames.push(uniqueImageFileName);
      } catch (err) {
        console.error("Error moving the image file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    // Create a new product with the image filenames
    const product = new Product({
      name,
      category,
      price,
      description,
      stock,
      image: imageFileNames,
      ratings,
      tags
    });

    // Save the product to the database
    const savedProduct = await product.save();

    // Respond with the saved product
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock,ratings, tags } = req.body;

    // Check if an image is present in the request
    const imageFiles = req.files && req.files.image ? (Array.isArray(req.files.image) ? req.files.image : [req.files.image]) : [];

    // Check if the required fields are present
    if (!name || !description || !price || !ratings || !stock) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    let updatedData = {
      name,
      category,
      price,
      description,
      stock,
      ratings,
      tags
    };

    // If images are provided, handle them
    if (imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        // Check image size
        if (imageFile.size > 3 * 1024 * 1024) {
          return res.status(400).json({ message: "Image size exceeds the 3MB limit" });
        }

        // Generate a unique filename
        const uniqueImageFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../uploads/product", uniqueImageFileName);

        try {
          // Move the image file to the designated directory
          await imageFile.mv(uploadPath);
          updatedData.image = [...(updatedData.image || []), uniqueImageFileName];
        } catch (err) {
          console.error("Error moving the image file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optionally delete associated image files
    for (const imageFile of deletedProduct.image) {
      const imagePath = path.join(__dirname, "../uploads/product", imageFile);
      fs.unlinkSync(imagePath);
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};