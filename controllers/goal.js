exports.findById = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from five_year where f_id = ? ";
        connection.query(sql, [id], (err, results) => {
            if (err) return next(err)
            res.send(results[0])
        })
    })
}

exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from five_year";
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.createGoal = (req, res, next) => {
    var { body } = req
    var post = {
        f_id: body.f_id,
        f_name: body.f_name ? body.f_name : null,
        f_code: body.f_code ? body.f_code : null,
        created: new Date(),
    
    }
    req.getConnection(function (err, connection) {
        connection.query("SELECT f_code FROM five_year  WHERE f_code= ?", [post.goal_code], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'รหัสซ้ำ'
                })
            } else {
                connection.query("insert into five_year set ?", post, (err, results) => {
                    if (err) return next(err)
                    res.send({ status: 'ok', results })
                    // req.params.id = body.planId;
                    // module.exports.findPlanById(req, res, next);
                })
            }
        })
    })

}

exports.updateGoal = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req

    var post = {
        f_name: body.f_name ? body.f_name : null,
        f_code: body.f_code ? body.f_code : null,
    }

    req.getConnection(function (err, connection) {
        bcrypt.hash(post.password, 10, function (err, hash) {
            if (err) return next(err)
            post.password = hash;
            console.log(post)
            connection.query("update five_year set ? where f_id =?", [post, id], function (err, results) {
                if (err) return next(err)
                res.send({ status: 'ok', results })
            })
        });
    })
}

exports.deleteGoal = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from five_year where f_id = ? ", [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}


exports.findallpagination = (req, res, next) => {
    var param = req.params;
    console.log(param)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM five_year ";

        if (param.text != 'undefined' && param.fields != 'undefined') {
            sql += "WHERE f_name LIKE '%{text}%' OR f_code LIKE '%{text2}%'";
            sql = sql.replace('{text}', param.text);
            sql = sql.replace('{text2}', param.text);
        }

        sql += "ORDER BY f_id DESC LIMIT {limit} OFFSET {offset}";
        sql = sql.replace('{limit}', param.limit);
        sql = sql.replace('{offset}', param.offset);

        console.log(sql);
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            if (results.length > 0) {

                var count = "SELECT * FROM five_year ";

                if (param.text != 'undefined' && param.fields != 'undefined') {
                    count += "WHERE f_name LIKE '%{text}%' OR f_code LIKE '%{text2}%'";
                    count = count.replace('{text}', param.text);
                    count = count.replace('{text2}', param.text);
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