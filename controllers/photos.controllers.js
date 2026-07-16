const express = require('express')
const router = express.Router()
const Photo = require('../models/Photo')
const isSignedIn = require('../middleware/is-signed-in');
const upload = require('../middleware/upload')


router.get('/' , async (req , res) => {
    const allPhotos = await Photo.find({visibility: 'public'}).populate('ownerId')
    res.render('photos/index.ejs', { photos: allPhotos })
})


router.get('/new', isSignedIn , async (req , res) =>{
    res.render('photos/new.ejs')
})


router.post('/', isSignedIn, upload.single('image') ,async (req, res) => {
    req.body.ownerId = req.session.user._id

    if(req.file) {
        req.body.imageUrl = req.file.path
    } else {
        throw new Error("No image file was uploaded!")
    }

    await Photo.create(req.body)
    res.redirect('/photos')
})

router.get('/my-gallery', isSignedIn, async (req , res) => {
    const myPhotos = await Photo.find({ ownerId: req.session.user._id}).populate('ownerId')
    res.render('photos/my-gallery.ejs', {photos: myPhotos})
})














module.exports = router;