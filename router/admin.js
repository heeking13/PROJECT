const express = require('../public/config').express;
const router = express.Router();
const AdminModel = require("../models/admin");

let resData;
router.use(function (req, res, next) {
    resData = {
        code: 0,
        message: '',
        err: ''
    };
    next();
})

router.post('/login', (req, res) => {
    console.log(req.body);
    AdminModel.findOneAndUpdate({ username: req.body.username, password: req.body.password },
        { $inc: { 'loginCount': 1 }, lastTime: new Date().getTime() },
        { new: true, fields: 'username sex _id info auth' },
        function (err, doc) {
            if (err) {
                resData = ({ code: 1, message: 'query error' });
            } else {
                doc ? resData = { code: 0, message: 'query success', userInfo: doc } : resData = { code: 2, message: 'username or password wrong', userInfo: doc };
            }
            res.send(resData);
            return;
        });
})

router.post('/getOneUserById', (req, res) => {
    console.log(req.body);
    AdminModel.findById({ _id: req.body.id }, function (err, doc) {
        if (err) {
            resData = ({ code: 1, message: 'query error' });
        } else {
            doc ? resData = { code: 0, message: 'query success', userInfo: doc } : resData = { code: 2, message: 'username or password wrong', userInfo: doc };
        }
        res.send(resData);
        return;
    });
})

//add new admin
router.post('/addAdmin', (req, res) => {
    AdminModel.create({
        username: req.body.username,
        info: req.body.info,
        date: req.body.date,
        sex: req.body.sex,
        password: req.body.password,
        key: 'key',
        lastTime: req.body.date,
        loginCount: 0
    }, function (err, doc) {
        if (err) {
            resData = { code: 1, message: 'add failed' }
        } else {
            doc ? resData = { code: 0, message: 'add new admin successfully', userInfo: doc } : { code: 2, message: 'add new admin failed', userInfo: null }
        }
        res.send(resData);
        return;
    })
})

router.post('/getAdminList', (req, res) => {
    AdminModel.find(null, 'info lastTime loginCount sex username', function (err, docs) {
        if (err) {
            resData = ({ code: 1, message: 'query error' });
        } else {
            docs ? resData = { code: 0, message: 'get admin list successfully', userInfo: docs } : resData = { code: 2, message: 'get admin list failed', userInfo: docs };
        }
        res.send(resData);
        return;
    });
})

router.post('/editUser', (req, res) => {
    console.log(req.body);
    AdminModel.findOneAndUpdate({ _id: req.body._id },
        { sex: req.body.sex, password: req.body.password, info: req.body.info },
        { new: true, fields: 'username sex _id info auth exam password' },
        function (err, doc) {
            if (err) {
                resData = ({ code: 1, message: 'edit error' });
            } else {
                doc ? resData = { code: 0, message: 'edit success', userInfo: doc } : resData = { code: 2, message: 'user does not exit', userInfo: doc };
            }
            res.send(resData);
            return;
        });
})

module.exports = router;