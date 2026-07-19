const router = require("express").Router()
const Photo = require('../models/Photo')

router.get('/', async (req, res) => {
  const publicPhotos = await Photo.find({ visibility: 'public' }).populate('ownerId')
  res.render('homepage.ejs', { photos: publicPhotos })
})
module.exports = router;