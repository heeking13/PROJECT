const mongoose = require('../public/config').mongoose;
const url = require('../public/config').url;

mongoose.connect(`mongodb://general:password@${url}/exam`, { useNewUrlParser: true }).then(() => {
    console.log('mongodb connect successfully');
}, (err) => {
    console.log(err);
})

const scoreSchema = require('../scheams/score');
module.exports = mongoose.model('score', scoreSchema, 'score');