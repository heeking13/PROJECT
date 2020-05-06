const mongoose = require('../public/config').mongoose;

//user structure
module.exports = new mongoose.Schema({

    username: String,
    message: String,
    date: Number
})