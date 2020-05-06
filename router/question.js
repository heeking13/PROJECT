const express = require('../public/config').express;
const router = express.Router();
const QuestionModel = require('../models/question');
let resData;

router.use(function (req, res, next) {
    resData = {
        code: 0,
        message: '',
        err: ''
    }
    next();
})

router.post('/getQuestionList', (req, res) => {
    const condition = (req.body.searchType && req.body.searchType.length > 0) ?
        { examId: req.body.eid, type: { $in: req.body.searchType } } : { examId: req.body.eid };
    console.log(condition);
    const isAdmin = req.body.isAdmin === 1 ? null : '_id questionName question0 question1 question2 question3 type';
    QuestionModel.find(condition, isAdmin, (err, docs) => {
        if (err) {
            resData = { code: 2, message: 'exam opreation failed' }
        } else {
            docs ? resData = { code: 0, message: 'get exam sheet succeess', userInfo: docs } : { code: 2, message: 'get exam sheet failed', userInfo: null }
        }
        res.send(resData);
        return;
    })
})

router.post('/createQuestion', (req, res) => {
    QuestionModel.create({
        answer: req.body.answer,
        examId: req.body.examId,
        questionInfo: req.body.questionInfo,
        questionName: req.body.questionName,
        type: req.body.type,
        date: req.body.date,
        question0: req.body.question0,
        question1: req.body.question1,
        question2: req.body.question2,
        question3: req.body.question3,
    }, function (err, doc) {
        if (err) {
            resData = { code: 1, message: 'add new data failed' }
        } else {
            doc ? resData = { code: 0, message: 'add exam sheet success', userInfo: doc } : { code: 2, message: 'add exam sheet failed', userInfo: null }
        }
        res.send(resData);
        return;
    })
})


module.exports = router;