const express = require('../public/config').express;
const router = express.Router();
const ExamModel = require("../models/exam");

let resData;
router.use(function (req, res, next) {
    resData = {
        code: 0,
        message: '',
        err: ''
    };
    page = {
        skip: 0
    }
    next();
})

router.post('/createExam', (req, res) => {
    ExamModel.create({
        examName: req.body.examName,
        examInfo: req.body.examInfo,
        state: req.body.state,
        date: req.body.date,
    }, function (err, doc) {
        if (err) {
            resData = { code: 1, message: 'add failed' }
        } else {
            doc ? resData = { code: 0, message: 'add new exam successfully', userInfo: doc } : { code: 2, message: 'add new exam failed', userInfo: null }
        }
        res.send(resData);
        return;
    })
})

router.post('/getExamList', (req, res) => {
    var options, condition;
    ExamModel.estimatedDocumentCount((err, total) => {
        if (err) {
            resData = { code: 10, message: 'get total course failed' }
            res.send(resData);
            return;
        } else {
            if (req.body.pageIndex && req.body.pageSize) {
                page.skip = (req.body.pageIndex - 1) * req.body.pageSize;
                options = { skip: page.skip, limit: req.body.pageSize }
            } else {
                condition = { state: 1 }
            }
        }
        ExamModel.find(condition, null, options, (err, doc) => {
            if (err) {
                resData = { code: 1, message: 'get exam list failed' }
                res.send(resData);
                return;
            } else {
                doc ? resData = { code: 0, message: 'get exam list successfully', pageTotal: total, userInfo: doc } : { code: 2, message: 'get exam list failed', userInfo: null }
                res.send(resData);
                return;
            }
        })
    })
})

router.post('/approved', (req, res) => {
    ExamModel.updateMany({ _id: { $in: req.body.mapOfCheckedId } }, { state: req.body.state }, {
        new: true
    }, (err, status) => {
        if (err) {
            resData = { code: 1, message: 'edit data failed' }
        } else {
            status ? resData = { code: 0, message: 'exam review successfully', userInfo: status } : { code: 2, message: 'exam review failed', userInfo: null }
        }
        res.send(resData);
        return;
    })
})

router.post('/getOneExam', (req, res) => {
    ExamModel.findById(req.body.id, (err, doc) => {
        if (err) {
            resData = { code: 1, message: 'query data failed' }
        } else {
            doc ? resData = { code: 0, message: 'single exam query successfully', userInfo: doc } : { code: 2, message: 'single exam query failed', userInfo: null }
        }
        res.send(resData);
        return;
    })
})

// delete exam
router.post('/deleteExam', (req, res) => {
    ExamModel.findByIdAndDelete(req.body.examId, function (err, doc) {
        if (err) {
            resData = { code: 1, message: 'delete failed' }
        } else {
            doc ? resData = { code: 0, message: 'delete exam successfully', userInfo: doc } : { code: 2, message: 'delete exam failed', userInfo: null }
        }
        res.send(resData);
        return;
    }
    )
})

module.exports = router;