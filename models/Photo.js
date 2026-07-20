const mongoose = require('mongoose')



const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cameraSettings: {
    type: String,
  },
  description: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visibility: {
    type: String,
    enum: ['public', 'private'], // Limits the values to only these two
    default: 'public'
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, { 
  timestamps: true 
})

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo