exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM regist_orginal s ";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}


exports.create = (req, res, next) => {
    var { body } = req

    console.log(body)
    var post = {
        person_id: body.personId,
        cid: body.cid ? body.cid : null,
        tname: body.tname ? body.tname : null,
        sex: body.sex ? body.sex : null,
        dept: body.dept ? body.dept : null,
        position: body.position ? body.position : null,
        position_type: body.position_type ? body.position_type : null,
        job_date: body.job_date ? body.job_date : null,
        salary: body.salary ? body.salary : null,
        image: body.image,

    }

    req.getConnection(function (err, connection) {
        connection.query("SELECT cid FROM regist_orginal  WHERE cid= ?", [post.cid], function (err, results) {
            if (err) return next(err)
            if (results.lenght > 0) {
                res.send({
                    status: 201, message: 'รหัสบัตรประชาชนมีในระบบแล้ว'

                })
            } else {
                connection.query("insert into regist_orginal set ?", post, (err, results) => {
                    if (err) return next(err)
                    // res.send({ status: 'ok', results })
                    req.params.id = body.personId;
                    req.params.dept = body.dept;
                    module.exports.updateDept(req, res, next);
                })
            }
        })
    })

}

exports.updateDept = (req, res, next) => {
    var person_id = req.params.id
    var dept_id = req.params.dept
    req.getConnection(function (err, connection) {
        connection.query("UPDATE user set dept = ? WHERE id = ?", [dept_id, person_id], (err, results) => {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })
    })

}

exports.update = (req, res, next) => {
    var { body } = req

    console.log(body)
    var post = {
        person_id: body.personId,
        cid: body.cid ? body.cid : null,
        tname: body.tname ? body.tname : null,
        sex: body.sex ? body.sex : null,
        dept: body.dept ? body.dept : null,
        position: body.position ? body.position : null,
        position_type: body.position_type ? body.position_type : null,
        job_date: body.job_date ? body.job_date : null,
        salary: body.salary ? body.salary : null,
        image: body.image,

    }

    req.getConnection(function (err, connection) {
        connection.query("UPDATE regist_orginal set ? WHERE person_id = ?", [post, body.personId], (err, results) => {
            if (err) return next(err)
            // res.send({ status: 'ok', results })
            req.params.id = body.personId;
            req.params.dept = body.dept;
            module.exports.updateDept(req, res, next);
        })
    })

}


exports.updateSysval = (req, res, next) => {
    var sys_val = parseInt(req.params.id)

    var post = {
        sys_val: sys_val,
    }

    req.getConnection(function (err, connection) {
        connection.query("update system_value set ? where sys_name ='person_id' ", [post, id], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })

    })
}


exports.findDeptTypeList = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT id AS Value, name AS Text FROM dept_type";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}
exports.findPositionList = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT id AS Value, name AS Text FROM position";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}


exports.findDeptList = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT deptid AS Value, deptname AS Text FROM dept WHERE fstatus = 1";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.getRegistOriginalData = (req, res, next) => {
    var person_id = req.params.id
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT o.cid, u.fullname as tname, o.sex, u.dept, o.position, o.position_type, o.job_date, o.salary, CONVERT(o.image USING utf8) AS image FROM user u LEFT JOIN regist_orginal o ON o.person_id = u.id WHERE u.id = ?";
        // var params = "%" + req.query.term + "%"
        connection.query(sql, [person_id], (err, row) => {
            if (err) return next(err)
            // if (row.length > 0 && row[0].image != null) {
            //     row[0].image = row[0].image.toString('utf-8');
            // }
            res.send(row[0])
        })
    })
}

