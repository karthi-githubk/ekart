const express = require('express');
const router = express.Router();
const { createProduct, editProduct, getAllProducts, getProductById, deleteProduct } = require('../controllers/product');

// Define routes
router.post('/products/create', createProduct);
router.put('/products/edit/:id', editProduct);
router.get('/products/getAll', getAllProducts);
router.get('/products/getById/:id', getProductById);
router.delete('/products/delete/:id', deleteProduct);

module.exports = router;
