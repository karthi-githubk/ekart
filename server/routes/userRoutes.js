const express = require('express');
const router = express.Router();
const {
  createUser,
  editUser,
  getAllUsers,
  getUserById,
  deleteUser,
  SignIn
} = require('../controllers/user');


router.post('/users/create', createUser);
router.put('/users/edit/:id', editUser);
router.get('/users/getAll', getAllUsers);
router.get('/users/getById/:id', getUserById);
router.delete('/users/delete/:id', deleteUser);


router.post('/SignIn', SignIn)

module.exports = router;
