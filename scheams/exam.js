const mongoose = require('../public/config').mongoose;
const objectId = mongoose.Types.ObjectId;
//exam structure
module.exports = new mongoose.Schema({
    examName: String,
    examInfo: String,
    state: {
        type: Number,
        default: 0
    },
    date: Number,
    populateExam: {
        type: objectId,
        ref: 'exam'
    }
})