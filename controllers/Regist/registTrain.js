var moment = require('moment');

exports.create = (req, res, next) => {
    var { body } = req
    console.log(req)
    var post = {
        person_id: body.person_id,
        type_train: body.type_train ? body.type_train : null,
        train_name: body.train_name ? body.train_name : null,
        sdate: body.sdate ? body.sdate : null,
        edate: body.edate ? body.edate : null,
        location: body.location ? body.location : null,
        province: body.province ? body.province : null,
        country: body.country ? body.country : null,
    }
    console.log(post)
    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM regist_trainning  WHERE person_id = ? AND sdate = CAST( ? AS DATE)", [post.person_id, post.sdate], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'มีการอบรมในวันนั้นแล้ว'
                })
            } else {
                connection.query("INSERT INTO regist_trainning set ?", post, (err, results) => {
                    if (err) return next(err)
                    // res.send({ status: 'ok', results })
                    req.params.id = body.person_id;
                    module.exports.findTrainByPersonId(req, res, next);
                })
            }
        })
    })

}

exports.findTrainByPersonId = (req, res, next) => {
    var person_id = parseInt(req.params.id)
    console.log('params = ' + person_id);
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM regist_trainning  WHERE person_id = ?";
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

exports.delete = (req, res, next) => {
    var id = parseInt(req.params.id)

    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from regist_trainning where id=?", [id], (err, results) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": results })
        })

    })
}

exports.getTrainDataById = (req, res, next) => {
    var id = parseInt(req.params.id)

    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("SELECT * FROM regist_trainning WHERE id=?", [id], (err, results) => {
            if (err) return next(err)
            res.send({ "status": "ok", "result": results })
        })

    })
}

exports.update = (req, res, next) => {
    var { body } = req
    console.log(req)
    var post = {
        id: body.id,
        person_id: body.person_id,
        type_train: body.type_train ? body.type_train : null,
        train_name: body.train_name ? body.train_name : null,
        sdate: body.sdate ? moment().utc(body.sdate).format() : null,
        edate: body.edate ? moment().utc(body.edate).format() : null,
        location: body.location ? body.location : null,
        province: body.province ? body.province : null,
        country: body.country ? body.country : null,
    }
    console.log(post.sdate)
    req.getConnection(function (err, connection) {
        connection.query("UPDATE regist_trainning SET ? WHERE id = ?", [post, post.id], function (err, results) {
            if (err) return next(err)
            req.params.id = body.person_id;
            module.exports.findTrainByPersonId(req, res, next);
        })
    })

}

