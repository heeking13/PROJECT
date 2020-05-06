const mongoose = require('../public/config').mongoose;

//exam sheet structure
module.exports = new mongoose.Schema({
    examId: String,
    answer: {
        type: Array,
        default: []
    },
    question0: String,
    question1: String,
    question2: String,
    question3: String,
    questionName: String,
    questionInfo: String,
    type: Number,
    date: Number
})