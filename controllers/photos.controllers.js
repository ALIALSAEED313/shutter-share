const express = require('express')
const router = express.Router()
const Photo = require('../models/Photo')
const isSignedIn = require('../middleware/is-signed-in');
const upload = require('../middleware/upload')
const Review = require('../models/Review')



// get /photos/new
// Renders the form for a user to upload a new photo
router.get('/new', isSignedIn , async (req , res) =>{
    try {
        res.render('photos/new.ejs')
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})


// POST /photos
// Handles the new photo form submission, uploads the image, 
// and creates the photo document in the database
router.post('/', isSignedIn, upload.single('image') ,async (req, res) => {
    try {
        req.body.ownerId = req.session.user._id
        req.body.visibility = req.body.visibility || 'public'
        if(req.file) {
            req.body.imageUrl = req.file.path
        } else {
            throw new Error("No image file was uploaded!")
        }

        await Photo.create(req.body)
        res.redirect('/photos/my-gallery')
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

// GET /photos/my-gallery
// Fetches all photos owned by the logged-in user 
// and renders their personal gallery page
router.get('/my-gallery', isSignedIn, async (req , res) => {
    try {
        const myPhotos = await Photo.find({ ownerId: req.session.user._id}).populate('ownerId')
        res.render('photos/my-gallery.ejs', {photos: myPhotos})
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})


// POST /photos/:photoId/reviews
// Creates a new review for a specific photo and 
// links the review to the photo's reviews array
router.post('/:photoId/reviews', isSignedIn, async (req, res)=>{
    try {
        req.body.authorId = req.session.user._id
        req.body.photoId = req.params.photoId

        const newReview = await Review.create(req.body)
        const photo = await Photo.findById(req.params.photoId)

        photo.reviews.push(newReview._id)
        await photo.save()

        res.redirect(`/photos/${req.params.photoId}`)
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})


// GET /photos/:photoId
// Fetches a single photo by its ID, populates the owner 
// and reviews (with authors), and renders the show/details page
router.get('/:photoId' , async (req , res) => {
    try {
        const foundPhoto = await Photo.findById(req.params.photoId).populate('ownerId').populate({path:'reviews',
            populate:{path: 'authorId'}
        })

        if(!foundPhoto){
            return res.redirect('/photos')
        }
        res.render('photos/show.ejs' , {photo: foundPhoto})
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})


// GET /photos/:photoId/edit
// Renders the form to edit an existing photo's details
// (Checks ownership before rendering)
router.get('/:photoId/edit' , isSignedIn , async (req , res) => {
    try {
        const photo = await Photo.findById(req.params.photoId)

        if(!photo.ownerId.equals(req.session.user._id)) {
            return res.redirect('/photos')
        }
        res.render('photos/edit.ejs', {photo})
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }

})


// POST /photos/:photoId
// Handles the edit photo form submission and updates 
// the photo details in the database
router.post('/:photoId' , isSignedIn , async (req , res) => {
    try {
        delete req.body._id

        const updatedPhoto = await Photo.findOneAndUpdate({_id: req.params.photoId, ownerId: req.session.user._id} , req.body, {new: true})

        if (updatedPhoto) {
            res.redirect(`/photos/${req.params.photoId}`)
        } else {
            res.send("You are not authorized to edit this photo.")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }

})


// DELETE /photos/:photoId/reviews/:reviewId
// Deletes a specific review and removes its ID from 
// the photo's reviews array
router.delete('/:photoId/reviews/:reviewId', isSignedIn, async (req , res) => {
    try {
        const photo = await Photo.findById(req.params.photoId)
        const review = await Review.findById(req.params.reviewId)

        if(photo.ownerId.equals(req.session.user._id) || review.authorId.equals(req.session.user._id)) {

            await Review.findByIdAndDelete(req.params.reviewId)
            await photo.updateOne({$pull: {reviews: req.params.reviewId}})

            res.redirect(`/photos/${req.params.photoId}`)
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

// DELETE /photos/:photoId
// Deletes a photo entirely, and also deletes all 
// reviews associated with that photo
router.delete('/:photoId' , isSignedIn , async (req , res) => {
    try {
        const photo = await Photo.findById(req.params.photoId)

        if(photo.ownerId.equals(req.session.user._id)){

            await Review.deleteMany({_id: {$in: photo.reviews}})

            await photo.deleteOne()
            res.redirect('/photos/my-gallery')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})


// GET /photos/:photoId/reviews/:reviewId/edit
// Renders the form to edit an existing review
router.get('/:photoId/reviews/:reviewId/edit' , isSignedIn, async (req , res) => {
    try {
        const photo = await Photo.findById(req.params.photoId)
        const review = await Review.findById(req.params.reviewId)

        if(review.authorId.equals(req.session.user._id)) {
            res.render('photos/edit-review.ejs' , {photo, review})
        }
        else {
            res.send("You are not authorized to edit this review.")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

// PUT /photos/:photoId/reviews/:reviewId
// Handles the edit review form submission and updates 
// the review text/rating in the database
router.put('/:photoId/reviews/:reviewId', isSignedIn, async (req , res) => {
    try {
        const review = await Review.findById(req.params.reviewId)

        if(review.authorId.equals(req.session.user._id)) {
            await review.updateOne(req.body)
            res.redirect(`/photos/${req.params.photoId}`)
        }
        else {
            res.send("You are not authorized to update this review.")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})













module.exports = router;