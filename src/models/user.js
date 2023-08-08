const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // by using trim true its remove spaces before and after string
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error(`Password cannot contain "password"`)
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps: true
})

// setting up a virtual property, It's a relationship between two entities (in this case between user & task)
userSchema.virtual('tasks', {
    ref: 'Task',
    // local field is that where that local data is stored [ _id ObjectId on User model ]
    localField: '_id',
    // foreign field is the name of the field on the other thing, what creates the relationship between two models [ owner ObjectId on Task model]
    foreignField: 'owner'
})

// setting toJSON method
userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// setting generateAuthToken function 
// 'Methods' are accessible on the 'instances' & 'individual user' somtimes called 'Instance methods'
userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// setting findByCredentials function
// 'Static' methods are accessible on the 'model' like actual Uppercase 'User' somtimes called 'Model methods'
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving - - - >
// taking advantage of middleware using schema.
// using 'pre' for  doing somthing before and event or there is 'post' for doing somthing just after an event .
userSchema.pre('save', async function (next) {  // this function needs to be a standard function not an arrow function.
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete user tasks when user is removed

userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner: user._id })
    next()
})

// In this file we are put the criteria for Users details and exports that
const User = mongoose.model('User', userSchema)


module.exports = User