const jwt = require('jwt-simple')
const config = require('../config')
const bcrypt = require('bcrypt');

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({
        user_id: user.user_id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        password: user.password,
        position: user.position,
        department: user.department,
        role: user.role,
    },
        config.secret
    )
}

exports.signin = (req, res, next) => {
    res.send({ token: tokenForUser(req.user) })
}


exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from user ";
        var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

//users success
exports.findById = (req, res, next) => {
    var strqrcode = req.params.id
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT c.username,Name,d.DEPTNAME,u.image,c.stamp_date,c.stamp_time " +
            "FROM checkinout c " +
            "LEFT JOIN userinfo u ON u.username = c.username " +
            "LEFT JOIN dep d ON d.deptid = u.DEFAULTDEPTID " +
            "WHERE strqrcode =? ";
        connection.query(sql, [strqrcode], (err, row) => {
            if (err) return next(err)
            res.send(row[0])
        })
    })
}

exports.findProfile = (req, res, next) => {
    var username = req.params.id
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT u.fullname,d.DEPTNAME ,p.name AS pname " +
            "FROM  user u " +
            "LEFT JOIN dep d ON d.DepJob = u.dept " +
            "LEFT JOIN position p ON p.id = u.position " +
            "WHERE username= ? ";
        connection.query(sql, [username], (err, row) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": row[0] })
        })
    })
}

exports.create = (req, res, next) => {
    var { body } = req
    var post = {
        user_type: body.user_type,
        fullname: body.name,
        username: body.username,
        password: body.password,
        dept: body.dept
    }
    req.getConnection(function (err, connection) {
        connection.query("select username from user where username=?", [post.username], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'username is Duplicate'

                })
            } else {
                bcrypt.hash(post.password, 10, function (err, hash) {
                    if (err) return next(err)
                    post.password = hash;
                    connection.query("insert into user set ?", post, (err, results) => {
                        console.log(post)
                        if (err) return next(err)
                        res.send({ status: 'ok', results })
                    })
                });
            }
        })
    })

}

exports.update = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req

    var post = {
        user_type: body.user_type,
        name: body.name,
        username: body.username,
        password: body.password
    }

    req.getConnection(function (err, connection) {
        connection.query("update user set ? where id =?", [post, id], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })
    })
}

exports.delete = (req, res, next) => {
    var id = parseInt(req.params.id)

    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from user where id=?", [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })

    })
}

exports.hashPassword = (req, res, next) => {
    req.getConnection(function (err, connection) {
        connection.query("SELECT user_id,password FROM users WHERE LENGTH(password) < 60", function (err, results) {
            if (err) return next(err)
            results.forEach(element => {
                bcrypt.hash(element.password, 10, function (err, hash) {
                    if (err) return next(err)
                    connection.query("UPDATE users SET password = ? WHERE user_id = ?", [hash, element.user_id], (err, results) => {
                        console.log(results)
                        if (err) return next(err)
                        res.send({ status: 'ok', results })
                    })
                });
            });
        })
    })
}

exports.findallpagination = (req, res, next) => {
    var param = req.params;
    console.log(param)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM users ";

        if (param.text != 'undefined' && param.fields != 'undefined') {
            sql += "WHERE {fields} LIKE '%{text}%' ";
            sql = sql.replace('{fields}', param.fields);
            sql = sql.replace('{text}', param.text);
        }

        sql += "ORDER BY user_id DESC LIMIT {limit} OFFSET {offset}";
        sql = sql.replace('{limit}', param.limit);
        sql = sql.replace('{offset}', param.offset);

        console.log(sql);
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            if (results.length > 0) {

                var count = "SELECT * FROM users ";

                if (param.text != 'undefined' && param.fields != 'undefined') {
                    count += "WHERE {fields} LIKE '%{text}%'";
                    count = count.replace('{fields}', param.fields);
                    count = count.replace('{text}', param.text);
                }
                console.log(count)
                connection.query(count, (err, resu) => {
                    if (err) return next(err)
                    var result = {
                        results: results,
                        total: resu.length > 0 ? resu.length : 0,
                        total_page: Math.ceil((resu.length / param.limit))
                    }
                    res.send(result)
                })
            } else {
                var result = {
                    results: results,
                    total: results.length > 0 ? results.length : 0,
                    total_page: 0
                }
                res.send(result)
            }
        })
    })
}
