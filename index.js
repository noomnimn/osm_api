const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const myConnection = require('express-myconnection')
const multer = require('multer');
const mysql = require('mysql')
const config = require('./config')
const routes = require('./routes')
const path = require('path');
const app = express();
const PORT = 8080
// app.use(function (req, res, next) {
//     res.header("Content-Type", "application/json; charset=utf-8");
//     next();
// });
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
// app.use(bodyParser.json({ type: '*/*', limit: '10mb' }))
app.use(myConnection(mysql, config.dbOption, 'pool'))

routes(app)

const DIR = './uploads';

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '.' + file.originalname);
//         // cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
//     }
// });
// let upload = multer({ storage: storage });



app.use(function (req, res, next) {
    res.header("Content-Type", "application/json; charset=utf-8");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/api', function (req, res) {
    res.end('file catcher example');
});

// app.post('/api/upload', upload.single('file'), function (req, res) {
//     console.log(req)
//     if (!req.file) {
//         console.log("No file received");
//         return res.send({
//             success: false
//         });

//     } else {
//         return res.send({
//             success: true,
//             path: path.format({
//                 dir: DIR,
//                 base: path.basename(req.file.filename)
//             })
//         })
//     }
// });
var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname);
    }
});

var upload = multer({ storage: store }).single('file');
app.post('/api/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(501).json({ error: err });
        }
        //do all database record saving activity
        return res.json({ originalname: req.file.originalname, uploadname: req.file.filename });
    });
});


app.post('/download', function (req, res, next) {
    filepath = path.join(__dirname, './uploads') + '/' + req.body.filename;
    console.log(filepath)
    res.sendFile(filepath);
});

app.listen(PORT, () => {
    console.log('running on localhost:' + PORT)
})