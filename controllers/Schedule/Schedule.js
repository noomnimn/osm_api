exports.findMemberInDept = (req, res, next) => {
    var { body } = req
    console.log(body)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT GROUP_CONCAT(DISTINCT u.id) AS id, GROUP_CONCAT(DISTINCT u.fullname) AS fullname, GROUP_CONCAT(emp. DAY) AS day, GROUP_CONCAT(emp.time) AS time, GROUP_CONCAT(emp.type) AS type FROM user u LEFT OUTER JOIN employeeSchedule emp ON u.id = emp.user_id AND ( emp.month = ? AND emp.year = ? ) WHERE find_in_set( ? ,u.dept) GROUP BY u.id ORDER BY u.id"
        connection.query(sql, [body.month, body.year, body.dept], (err, results) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": results })
        })
    })
}

exports.findDeptOfUser = (req, res, next) => {
    var user_id = req.params.id;
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT d.deptname AS Text, d.deptid AS Value FROM dept d WHERE find_in_set(d.deptid, (SELECT dept FROM user WHERE id = ?))";
        connection.query(sql, [user_id], (err, results) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": results })
        })
    })
}

exports.create = (req, res, next) => {
    var { body } = req

    var post = {
        user_id: body.userId,
        year: body.year,
        month: body.month,
        day: body.day,
        time: body.time,
        type: body.type,
        dept: body.dept
    }

    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM employeeSchedule WHERE user_id = ? AND year = ? AND month = ? AND day = ? AND time = ?", [post.user_id, post.year, post.month, post.day, post.time], (err, results) => {
            if (err) return next(err)
            if (results.length > 0) {
                connection.query("UPDATE employeeSchedule SET type = ? WHERE user_id = ? AND year = ? AND month = ? AND day = ? AND time = ? AND dept = ?", [post.type, post.user_id, post.year, post.month, post.day, post.time, post.dept], (err, results) => {
                    if (err) return next(err)
                    module.exports.findMemberInDept(req, res, next)
                })
            } else {
                connection.query("INSERT INTO employeeSchedule set ?", post, (err, results) => {
                    if (err) return next(err)
                    module.exports.findMemberInDept(req, res, next)
                })
            }
        })
    })

}

exports.delete = (req, res, next) => {
    var { body } = req

    var post = {
        user_id: body.userId,
        year: body.year,
        month: body.month,
        day: body.day,
        time: body.time,
        type: body.type
    }

    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM employeeSchedule WHERE user_id = ? AND year = ? AND month = ? AND day = ? AND time = ?", [post.user_id, post.year, post.month, post.day, post.time], (err, results) => {
            if (err) return next(err)
            if (results.length > 0) {
                connection.query("DELETE FROM employeeSchedule WHERE user_id = ? AND year = ? AND month = ? AND day = ? AND time = ?", [post.user_id, post.year, post.month, post.day, post.time], (err, results) => {
                    if (err) return next(err)
                    module.exports.findMemberInDept(req, res, next)
                })
            } else {
                module.exports.findMemberInDept(req, res, next)
            }
        })
    })

}

exports.deleteAllInMonth = (req, res, next) => {
    var { body } = req

    var post = {
        year: body.year,
        month: body.month,
        dept: body.dept
    }

    req.getConnection(function (err, connection) {
        connection.query("DELETE FROM employeeSchedule WHERE year = ? AND month = ? AND dept = ?", [post.year, post.month, post.dept], (err, results) => {
            if (err) return next(err)
            module.exports.findMemberInDept(req, res, next)
        })
    })

}