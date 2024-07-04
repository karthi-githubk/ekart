const Contact = require('../models/ContactModel');
const fs = require('fs');
const path = require('path');

// Create a new contact entry
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Check if required fields are present
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const contact = new Contact({
            name,
            email,
            phone,
            message
        });

        // Save contact to the database
        const savedContact = await contact.save();

        res.status(201).json(savedContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Edit a contact by ID (not usually typical for contacts)
exports.editContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Check if required fields are present
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Update the contact by ID
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            message
        }, { new: true });

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json(updatedContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
