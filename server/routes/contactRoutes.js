const express = require('express');
const router = express.Router();
const {
    createContact,
    editContact,
    getAllContacts,
    getContactById,
    deleteContact
} = require('../controllers/contact'); 

// Define routes for contacts
router.post('/contacts/create', createContact);
router.put('/contacts/edit/:id', editContact);
router.get('/contacts/getAll', getAllContacts);
router.get('/contacts/getById/:id', getContactById);
router.delete('/contacts/delete/:id', deleteContact);

module.exports = router;
