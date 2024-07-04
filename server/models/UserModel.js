const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, },
  password: { type: String, required: true },
  image: [{ type: String,  }],
  role: { 
    type: String, 
    enum: ['admin', 'customer'], 
    default: 'customer' 
  }
});

// userSchema.methods.isAdmin = function() {
//   return this.role === 'admin';
// };

module.exports = mongoose.model('User', userSchema);
