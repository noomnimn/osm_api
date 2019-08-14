exports.getLeaveType = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT i.Description AS Text, i.Value FROM DbListGroup g LEFT JOIN DbListItem i ON g.GroupName = i.GroupName WHERE 1=1 AND g.GroupName = 'LeaveType' ORDER BY i.Value";
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.create = (req, res, next) => {
    var { body } = req
    body.start_date = new Date(body.start_date);
    body.end_date = new Date(body.end_date);
    req.getConnection(function (err, connection) {
        connection.query("INSERT INTO LeaveForm set ?", body, (err, results) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": results });
            // if (results.length > 0) {
            //     connection.query("UPDATE employeeSchedule SET type = ? WHERE user_id = ? AND year = ? AND month = ? AND day = ? AND time = ? AND dept = ?", [post.type, post.user_id, post.year, post.month, post.day, post.time, post.dept], (err, results) => {
            //         if (err) return next(err)
            //         module.exports.findMemberInDept(req, res, next)
            //     })
            // } else {
            //     connection.query("INSERT INTO employeeSchedule set ?", post, (err, results) => {
            //         if (err) return next(err)
            //         module.exports.findMemberInDept(req, res, next)
            //     })
            // }
        })
    })

}

exports.getLeaveList = (req, res, next) => {
    var person_id = parseInt(req.params.id)
    var type = parseInt(req.params.type)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT id, subject, reason, start_date, end_date, approve FROM LeaveForm WHERE user_id = ? ";
        if (type != null) {
            sql + "AND leave_type = ? "
        }
        sql + "ORDER BY start_date"
        connection.query(sql, [person_id, type], (err, row) => {
            if (err) return next(err)
            if (row < 1) {
                res.send({ "status": "nodata" })
            } else {
                res.send({ "status": "ok", "result": row })
            }
        })
    })
}