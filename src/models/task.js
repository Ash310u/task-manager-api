const mongoose = require('mongoose')



const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
}, {
    timestamps:true
})

// In this file we are put the criteria for Tasks details and exports that
const Task = mongoose.model('Task', taskSchema)

module.exports = Task