const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  image: [{ type: String,  }],
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  ratings: { type: Number, required: true },
  tags: [{ type: String }],
});

module.exports = mongoose.model('Product', productSchema);
