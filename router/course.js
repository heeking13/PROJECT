const express = require('../public/config').express;
const router = express.Router();
const CourseModel = require("../models/course");
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

router.post('/getcourseList', (req, res) => {
    var options, condition;
    CourseModel.estimatedDocumentCount((err, total) => {
        if (err) {
            resData = { code: 10, message: 'get total course failed' }
            res.send(resData);
            return;
        } else {
            if (req.body.pageIndex && req.body.pageSize) {
                page.skip = (req.body.pageIndex - 1) * req.body.pageSize;
                options = { skip: page.skip, limit: req.body.pageSize }
            } else {
                condition = { state: 1 };
            }
        }
        CourseModel.find(null, null, options, (err, docs) => {
            if (err) {
                resData = { code: 1, message: 'get list failed' }
                res.send(resData);
                return;
            } else {
                ExamModel.populate(docs, { path: 'populateExam', match: condition, model: 'exam', justOne: false }, (err, doc) => {
                    if (err) {
                        resData = { code: 2, message: 'exam array operation failed' }
                        res.send(resData);
                        return;
                    } else {
                        console.log(doc);
                        doc ? resData = { code: 0, message: 'get course list successfully', pageTotal: total, userInfo: doc } : { code: 2, message: 'get course list failed', userInfo: null }
                        res.send(resData);
                        return;
                    }
                })
            }
        })
    })
})

router.post('/createCourse', (req, res) => {
    CourseModel.create({
        courseName: req.body.courseName,
        courseInfo: req.body.courseInfo,
        date: req.body.date,
    }, function (err, doc) {
        if (err) {
            resData = { code: 1, message: 'add failed' }
        } else {
            doc ? resData = { code: 0, message: 'add new course successfully', userInfo: doc } : { code: 2, message: 'add new course failed', userInfo: null }
        }
        res.send(resData);
        return;
    })
})

//edit course content
router.post('/updateCourse', (req, res) => {
    CourseModel.findByIdAndUpdate(req.body._id,
        { courseName: req.body.courseName, courseInfo: req.body.courseInfo, date: req.body.date },
        { new: true }, function (err, doc) {
            if (err) {
                resData = { code: 1, message: 'edit failed' }
            } else {
                doc ? resData = { code: 0, message: 'edit new course successfully', userInfo: doc } : { code: 2, message: 'edit new course failed', userInfo: null }
            }
            res.send(resData);
            return;
        }
    )
})

// delete course
router.post('/deleteCourse', (req, res) => {
    CourseModel.findByIdAndDelete(req.body.courseId, function (err, doc) {
        if (err) {
            resData = { code: 1, message: 'delete failed' }
        } else {
            doc ? resData = { code: 0, message: 'delete course successfully', userInfo: doc } : { code: 2, message: 'delete course failed', userInfo: null }
        }
        res.send(resData);
        return;
    }
    )
})

// delete allocate exam
router.post('/deleteAllocate', (req, res) => {
    CourseModel.findByIdAndUpdate(req.body.courseId,
        { $pull: { populateExam: req.body.examId } },
        { new: true }, function (err, doc) {
            if (err) {
                resData = { code: 1, message: 'delete failed' }
            } else {
                doc ? resData = { code: 0, message: 'delete successfully', userInfo: doc } : { code: 2, message: 'delete failed', userInfo: null }
            }
            res.send(resData);
            return;
        }
    )
})

router.post('/allocateExam', (req, res) => {
    CourseModel.findByIdAndUpdate(req.body.course_id,
        { $addToSet: { populateExam: { $each: req.body.examList } } },
        { new: true }, function (err, doc) {
            if (err) {
                resData = { code: 1, message: 'distribute failed' }
            } else {
                doc ? resData = { code: 0, message: 'distribute exam successfully', userInfo: doc } : { code: 2, message: 'distribute exam failed', userInfo: null }
            }
            res.send(resData);
            return;
        }
    )
})

module.exports = router;