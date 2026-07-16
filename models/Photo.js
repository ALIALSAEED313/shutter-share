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
    // Optional field, so no 'required: true'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { 
  timestamps: true 
})

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo