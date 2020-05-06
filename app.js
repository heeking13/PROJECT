const express = require('./public/config').express;
const cors = require('cors');
const mongoose = require('./public/config').mongoose;
const bodyParser = require('body-parser');
const app = new express();
mongoose.set('useFindAndModify', false);

app.use(express.static(__dirname + "/dist/ngexam"));

app.use(cors({
    allowedHeaders: 'Origin,x-requested-with,Content-Type,x-access-token',
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set up router
app.use('/admin', require('./router/admin'));
app.use('/user', require('./router/user'));
app.use('/course', require('./router/course'));
app.use('/exam', require('./router/exam'));
app.use('/question', require('./router/question'));
app.use('/score', require('./router/score'));
app.use('/log', require('./router/log'));

app.listen(8081);