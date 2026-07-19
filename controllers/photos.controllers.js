const express = require('express')
const router = express.Router()
const Photo = require('../models/Photo')
const isSignedIn = require('../middleware/is-signed-in');
const upload = require('../middleware/upload')
const Reviews = require('../models/Review')





router.get('/new', isSignedIn , async (req , res) =>{
    res.render('photos/new.ejs')
})


router.post('/', isSignedIn, upload.single('image') ,async (req, res) => {
    req.body.ownerId = req.session.user._id
    req.body.visibility = req.body.visibility || 'public'
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


router.post('/:photoId/reviews', isSignedIn, async (req, res)=>{

})


router.delete('/photos/:photoId' , isSignedIn, async (req , res) => {
    const photo = await Photo.findById(req.params.photoId)

    if(photo.ownerId.equals(req.session.user._id)) {
        await photo.deleteOne()
        res.redirect('photos/my-gallery')
    } else {
        res.send("You are not authorized to delete this photo.")
    }
})

router.delete('/photos/:photoId/reviews/:reviewId', isSignedIn, async (req , res) => {
    const photo = await Photo.findById(req.params.photoId)
    const review = photo.reviews.id(req.params.reviewId)


    if(photo.ownerId.equals(req.session.user._id) || review.authorId.equals(req.session.user._id)) {
        review.deleteOne()
        await photo.save()
        res.redirect(`/photos/${req.params.photoId}`)
    } else {
        res.send("You are not authorized to delete this review.")
    }
})

router.get('/:photoId' , async (req , res) => {
    const foundPhoto = await Photo.findById(req.params.photoId).populate('ownerId').populate('reviews')

    if(!foundPhoto){
        return res.redirect('/photos')
    }
    res.render('photos/show.ejs' , {photo: foundPhoto})
})

router.get('/:photoId/edit' , isSignedIn , async (req , res) => {
    const photo = await Photo.findById(req.params.photoId)

    if(!photo.ownerId.equals(req.session.user._id)) {
        return res.redirect('/photos')
    }
    res.render('photos/edit.ejs', {photo})

})

router.post('/:photoId' , isSignedIn , async (req , res) => {
    const photo = await Photo.findById(req.params.photoId)

    if(photo.ownerId.equals(req.session.user._id)){
        await photo.updateOne(req.body)
        res.redirect(`/photos/${req.params.photoId}`)
    }else {
        res.send("You are not authorized to edit this photo")
    }
})













module.exports = router;