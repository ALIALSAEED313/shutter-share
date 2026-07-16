const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true,
  }
}, { 
  timestamps: true 
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review