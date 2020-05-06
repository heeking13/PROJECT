const mongoose = require('../public/config').mongoose;

//course structure
module.exports = new mongoose.Schema({
    courseName: String,
    courseInfo: String,
    date: Number,
    //link to exam
    populateExam: {
        type: Array,
        default: []
    }

})