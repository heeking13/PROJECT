const mongoose = require('../public/config').mongoose;

module.exports = new mongoose.Schema({
    examName: String,
    userName: String,
    date: Number,
    score: Number
})