const express = require("express");
const multer = require('multer')
const sharp = require('sharp');
const { sendWelcomeEmail, sendcancelationEmail } = require("../emails/account");

const auth = require("../middleware/auth");
const User = require('../models/user');

const router = new express.Router()

router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        // sending email function
        sendWelcomeEmail(user.email,user.name)

        // Generating  Auth token function
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        // res.status(400)
        // res.send(err)
        res.status(400).send(err)
    }

});

router.post('/users/login', async (req, res) => {
    try {
        // here using 'Static' method which is accessible on the 'model' like actual Uppercase 'User' somtimes called 'Model methods'
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // here using 'Methods' which is accessible on the 'instances' & 'individual user' somtimes called 'Instance methods'
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter(token => {
            // here the token is an ocject with a token property.
            return token.token !== req.token
        })
        await req.user.save()

        res.send()

    } catch (err) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)

})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // shorthand arrow function

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid upddates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]) // using bracket notation for updates.
        // taking the updates in as request body, Via http request.
        await req.user.save()

        res.send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        sendcancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }
})

// upload files using multer node module

const upload = multer({
    // limit the file size
    limits: {
        fileSize: 1000000
    },
    // filter out the files
    fileFilter(req, file, cb) {
        // using regular expression [ match 'jpeg' or 'jpg' or 'png']
        if (!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
            return cb(new Error('Please upload a image'))
        }

        cb(undefined, true)
    }
})

// create & update avatar
// here single name is the key when registering the middleware
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
                         // using other method between sharp() & to Buffer
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
                                                // here I'm providing a width & height for resizing the image
    req.user.avatar = buffer
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ Error: error.message })
})

// delete avatar

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// read avatar
router.get('/users/:id/avatar', async (req,res) => {
    
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})

module.exports = router