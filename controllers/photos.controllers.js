const express = require('express')
const router = express.Router()
const Photo = require('../models/Photo')
const isSignedIn = require('../middleware/is-signed-in');


router.get('/' , async (req , res) => {
    const allPhotos = await Photo.find().populate('ownerId')
    res.render('photos/index.ejs', { photos: allPhotos })
})


router.get('/new', async (req , res) =>{
    res.render('photos/new.ejs')
})















module.exports = router;