const Category = require('../models/CategoryModel');
const fs = require("fs");
const path = require("path");

// Create a new category
exports.createCategory = async (req, res) => {
    try {
      const { name, description, } = req.body;
  
      // Check if the required fields are present
      if (!name || !description) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }
  
      // Check if an image is present in the request
      if (!req.files || !req.files.image) {
        return res.status(400).json({ message: 'Image is required' });
      }
  
      const imageFile = req.files.image;
  
      // Check image size
      if (imageFile.size > 3 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image size exceeds the 3MB limit' });
      }
  
      // Generate a unique filename
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(__dirname, '../uploads/categeory', uniqueFileName);
  
      try {
        // Move the image file to the designated directory
        await imageFile.mv(uploadPath);
  
        // Create a new category with the image filename
        const category = new Category({
          name,
          description,
          image: uniqueFileName,
        });
  
        // Save the category to the database
        const savedCategory = await category.save();
  
        // Respond with the saved category
        res.status(201).json(savedCategory);
      } catch (err) {
        console.error('Error moving the image file:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


// Edit a category by ID
exports.editCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the required fields are present
    if (!name || !description) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if a category with the same name already exists (exclude the current category)
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    // Update the category data
    const updatedData = { name, description };

    const imageFile = req.files && req.files.image;

    if (imageFile) {
      // Check image size
      if (imageFile.size > 3 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "Image size exceeds the 3MB limit" });
      }

      // Generate a unique filename for the image
      const uniqueImageFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/categeory",
        uniqueImageFileName
      );

      try {
        // Move the image file to the designated directory
        await imageFile.mv(uploadPath);

        // Find the existing category to get the old image filename if exists
        const existingCategory = await Category.findById(req.params.id);
        if (existingCategory && existingCategory.image) {
          // Remove the old image file(s) if they exist
          if (Array.isArray(existingCategory.image)) {
            // Handle array of images
            for (const oldImage of existingCategory.image) {
              const oldImagePath = path.join(
                __dirname,
                "../uploads/categeory",
                oldImage
              );
              if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
              }
            }
          } else {
            // Handle single image (string)
            const oldImagePath = path.join(
              __dirname,
              "../uploads/categeory",
              existingCategory.image
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
        }

        // Update the image filename in the data
        updatedData.image = uniqueImageFileName;
      } catch (err) {
        console.error("Error moving the image file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    // Update the category in the database
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
