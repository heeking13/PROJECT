const express = require('../public/config').express;
const router = express.Router();
const LogModel = require('../models/log');

let resData;
router.use(function (req, res, next) {
    resData = {
        code: 0,
        message: '',
        err: ''
    };
    next();
})

router.post('/message', (req, res) => {
    console.log(req.body);
    LogModel.create({ username: req.body.log.username, message: req.body.log.message, date: req.body.log.date }, function (err, data) {
        if (err) {
            resData.code = 3;
            resData.message = 'create log failed';
            resData.userInfo = req.body.data.userInfo;
            res.data.err = err;
            res.send(resData);
            return;
        } else {
            if (req.body.data.userInfo) {
                resData.code = 0;
                resData.message = `${req.body.data.message}-create log successfully`;
                resData.userInfo = req.body.data.userInfo;
                resData.total = req.body.data.pageTotal;
                resData.score = req.body.data.score;
                resData.score = req.body.data.score;
                res.send(resData);
                return;
            } else {
                resData.code = 4;
                resData.message = `${req.body.data.message}`;
                resData.userInfo = null;
                res.send(resData);
                return;
            }

        }
    })
})

router.post('/getOneDataLog', (req, res) => {
    console.log(req.body);
    LogModel.create({ username: req.body.log.username, message: req.body.log.message, date: req.body.log.date }, function (err, data) {
        if (err) {
            resData.code = 3;
            resData.message = 'log failed';

            resData.userInfo = req.body.data.userInfo;
            res.data.err = err;
            res.send(resData);
            return;
        } else {
            if (req.body.data.userInfo) {

                res.send(req.body.data.userInfo);
                return;
            } else {
                resData.code = 4;
                resData.message = `${req.body.data.message}`;
                resData.userInfo = null;
                res.send(resData);
                return;
            }

        }
    })
})


module.exports = router;