const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const http = require('http')
const moment = require('moment')
var randomstring = require("randomstring");

const config = require('./config')
const routes = require('./routes')

const PORT = 8080

app.use(function (req, res, next) {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(bodyParser.json({ type: '*/*', limit: '10mb' }))
app.use(myConnection(mysql, config.dbOption, 'pool'))
routes(app)

app.listen(PORT, () => {
    console.log('running on localhost:' + PORT)
})