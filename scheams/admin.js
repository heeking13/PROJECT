const mongoose = require('../public/config').mongoose;

//admin structure
module.exports = new mongoose.Schema({

    username: String,
    password: {
        type: String
    },
    sex: {
        type: Number
    },
    info: {
        type: String
    },
    loginCount: {
        type: Number,
        default: 0
    },
    lastTime: {
        type: Number,
        default: new Date().getTime()
    },
    key: {
        type: String
    }
})