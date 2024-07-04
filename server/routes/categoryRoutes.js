const express = require('express');
const router = express.Router();
const {createCategory,editCategory,getAllCategories,getCategoryById,deleteCategory} = require('../controllers/category');

// Define routes
router.post('/categories/create', createCategory);
router.put('/categories/edit/:id', editCategory);
router.get('/categories/getAll', getAllCategories);
router.get('/categories/getById/:id', getCategoryById);
router.delete('/categories/delete/:id', deleteCategory);

module.exports = router;
