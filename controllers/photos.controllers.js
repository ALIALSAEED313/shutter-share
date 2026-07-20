const express = require('express')
const router = express.Router()
const Photo = require('../models/Photo')
const isSignedIn = require('../middleware/is-signed-in');
const upload = require('../middleware/upload')
const Review = require('../models/Review')





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
    res.redirect('/photos/my-gallery')
})

router.get('/my-gallery', isSignedIn, async (req , res) => {
    const myPhotos = await Photo.find({ ownerId: req.session.user._id}).populate('ownerId')
    res.render('photos/my-gallery.ejs', {photos: myPhotos})
})


router.post('/:photoId/reviews', isSignedIn, async (req, res)=>{

    req.body.authorId = req.session.user._id
    req.body.photoId = req.params.photoId

    const newReview = await Review.create(req.body)
    const photo = await Photo.findById(req.params.photoId)

    photo.reviews.push(newReview._id)
    await photo.save()

    res.redirect(`/photos/${req.params.photoId}`)
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



router.get('/:photoId' , async (req , res) => {
    const foundPhoto = await Photo.findById(req.params.photoId).populate('ownerId').populate({path:'reviews',
        populate:{path: 'authorId'}
    })

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

    delete req.body._id

    const updatedPhoto = await Photo.findOneAndUpdate({_id: req.params.photoId, ownerId: req.session.user._id} , req.body, {new: true})

    if (updatedPhoto) {
        res.redirect(`/photos/${req.params.photoId}`)
    } else {
        res.send("You are not authorized to edit this photo.")
    }

})

router.delete('/:photoId/reviews/:reviewId', isSignedIn, async (req , res) => {
    const photo = await Photo.findById(req.params.photoId)
    const review = await Review.findById(req.params.reviewId)

    if(photo.ownerId.equals(req.session.user._id) || review.authorId.equals(req.session.user._id)) {

        await Review.findByIdAndDelete(req.params.reviewId)
        await photo.updateOne({$pull: {reviews: req.params.reviewId}})

        res.redirect(`/photos/${req.params.photoId}`)
    }
})

router.delete('/:photoId' , isSignedIn , async (req , res) => {

    const photo = await Photo.findById(req.params.photoId)

    if(photo.ownerId.equals(req.session.user._id)){

        await Review.deleteMany({_id: {$in: photo.reviews}})

        await photo.deleteOne()
        res.redirect('/photos/my-gallery')
    }
})













module.exports = router;