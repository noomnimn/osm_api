exports.findYear = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT id AS Value, year_th AS Text FROM regist_stu_year";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}
exports.findNo = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT id As Value, name As Text FROM regist_stu_no";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.findLocation = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT id As Value, name As Text FROM regist_stu_location";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.create = (req, res, next) => {
    var { body } = req

    var post = {
        person_id: body.personId,
        year_stu: body.year_stu ? body.year_stu : null,
        no_stu: body.no_stu ? body.no_stu : null,
        location_stu: body.location_stu ? body.location_stu : null,

    }

    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM regist_stu WHERE person_id=? AND year_stu=?", [post.person_id, post.year_stu], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'การศึกษาที่เพิ่มซ้ำกับในระบบ'
                })
            } else {
                connection.query("insert into regist_stu set ?", post, (err, results) => {
                    if (err) return next(err)
                    // res.send({ status: 'ok', results })
                    req.params.id = body.personId;
                    module.exports.findStuPersonId(req, res, next);
                })
            }
        })
    })

}


exports.findStuPersonId = (req, res, next) => {
    // var { body } = req
    // var person_id = parseInt(body.personId)
    var person_id = parseInt(req.params.id)
    console.log('params = ' + person_id);
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT s.id, y.year_en + 543 AS tyear, n.name AS nname, l.name AS lname " +
            "FROM regist_stu s " +
            "LEFT JOIN regist_stu_no n ON n.id = s.no_stu " +
            "LEFT JOIN regist_stu_location l ON l.id = s.location_stu " +
            "LEFT JOIN regist_stu_year y ON s.year_stu = y.id " +
            "WHERE s.person_id =? ";
        connection.query(sql, [person_id], (err, row) => {
            if (err) return next(err)
            if (row < 1) {
                res.send({ "status": "nodata" })
            } else {
                res.send({ "status": "ok", "result": row })
            }

        })
    })
}


exports.findStuPersonIdSeacrh = (req, res, next) => {

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT person_id,cid,tname FROM regist_orginal  " +
            "where (person_id LIKE ? OR tname like ? or cid like ?) ";
        var params = "%" + req.query.term + "%"
        connection.query(sql, [params, params, params], (err, row) => {
            if (err) return next(err)
            console.log(row.length)
            if (row < 1) {
                res.send({ "status": "nodata" })
            } else {
                res.send({ "status": "ok", "result": row })
            }

        })
    })
}

exports.findStuPersonIdSeacrhSelect = (req, res, next) => {
    var cid = req.params.cid
    console.log(cid)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT tname FROM regist_orginal WHERE cid= ? ";
        connection.query(sql, [cid], (err, row) => {
            if (err) return next(err)
            console.log(row.length)
            if (row < 1) {
                res.send({ "status": "nodata" })
            } else {
                res.send(row[0])
            }

        })
    })
}


exports.delete = (req, res, next) => {
    var id = parseInt(req.params.id)

    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from regist_stu where id=?", [id], (err, results) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": results })
        })

    })
}
