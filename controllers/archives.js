exports.findArcById = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from archives where arc_id = ? ";
        connection.query(sql, [id], (err, results) => {
            if (err) return next(err)
            res.send(results[0])
        })
    })
}

exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * from archives";
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.createArc = (req, res, next) => {
    var { body } = req
    var post = {
        arc_id: body.arc_id,
        arc_code: body.arc_code ? body.arc_code : null,
        arc_name: body.arc_name ? body.arc_name : null,
        arc_ex: body.arc_ex ? body.arc_ex : null,
        arc_date: body.arc_date ? body.arc_date : null,
        arc_from: body.arc_from ? body.arc_from : null,
        arc_to: body.arc_to ? body.arc_to : null,
        arc_make: body.arc_make ? body.arc_make : null,
        detail: body.detail ? body.detail : null,
        file_arc: body.file_arc ? body.file_arc : null,
        created: new Date(),
    }
    req.getConnection(function (err, connection) {
        connection.query("SELECT arc_code FROM archives  WHERE arc_code= ?", [post.arc_code], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'เลขซ้ำ'
                })
            } else {
                connection.query("insert into archives set ?", post, (err, results) => {
                    if (err) return next(err)
                    res.send({ status: 'ok', results })
                    // req.params.id = body.planId;
                    // module.exports.findPlanById(req, res, next);
                })
            }
        })
    })

}

exports.deleteArc = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from archives where arc_id = ? ", [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.updateArc = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req
    var post = {
        arc_id: body.arc_id,
        arc_code: body.arc_code ? body.arc_code : null,
        arc_name: body.arc_name ? body.arc_name : null,
        arc_ex: body.arc_ex ? body.arc_ex : null,
        arc_date: body.arc_date ? body.arc_date : null,
        arc_from: body.arc_from ? body.arc_from : null,
        arc_to: body.arc_to ? body.arc_to : null,
        arc_make: body.arc_make ? body.arc_make : null,
        detail: body.detail ? body.detail : null,
        file_arc: body.file_arc ? body.file_arc : null,
    }
    req.getConnection(function (err, connection) {
        connection.query("update archives set ? where arc_id =?", [post, id], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })
    })
}

exports.findallpagination = (req, res, next) => {
    var param = req.params;
    console.log(param)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM archives ";

        if (param.text != 'undefined' && param.fields != 'undefined') {
            sql += "WHERE arc_name LIKE '%{text}%' OR arc_from LIKE '%{text2}%' OR arc_code LIKE '%{text3}%' OR arc_ex LIKE '%{text4}%' OR arc_date LIKE '%{text5}%' OR arc_to LIKE '%{text6}%' OR arc_make LIKE '%{text7}%'";
            sql = sql.replace('{text}', param.text);
            sql = sql.replace('{text2}', param.text);
            sql = sql.replace('{text3}', param.text);
            sql = sql.replace('{text4}', param.text);
            sql = sql.replace('{text5}', param.text);
            sql = sql.replace('{text6}', param.text);
            sql = sql.replace('{text7}', param.text);
        }

        sql += "ORDER BY arc_id DESC LIMIT {limit} OFFSET {offset}";
        sql = sql.replace('{limit}', param.limit);
        sql = sql.replace('{offset}', param.offset);

        console.log(sql);
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            if (results.length > 0) {

                var count = "SELECT * FROM archives ";

                if (param.text != 'undefined' && param.fields != 'undefined') {
                    count += "WHERE arc_name LIKE '%{text}%' OR arc_from LIKE '%{text2}%' OR arc_code LIKE '%{text3}%' OR arc_ex LIKE '%{text4}%' OR arc_date LIKE '%{text5}%' OR arc_make LIKE '%{text7}%' OR arc_to LIKE '%text6%'" ;
                    count = count.replace('{text}', param.text);
                    count = count.replace('{text2}', param.text);
                    count = count.replace('{text3}', param.text);
                    count = count.replace('{text4}', param.text);
                    count = count.replace('{text5}', param.text);
                    count = count.replace('{text6}', param.text);
                    count = count.replace('{text7}', param.text);
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