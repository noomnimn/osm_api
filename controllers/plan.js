exports.findPlanById = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from plans where plan_id = ? ";
        connection.query(sql, [id], (err, results) => {
            if (err) return next(err)
            res.send(results[0])
        })
    })
}

exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * from plans";
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.createPlan = (req, res, next) => {
    var { body } = req
    var post = {
        plan_id: body.plan_id,
        plan_code: body.plan_code ? body.plan_code : null,
        plan_name: body.plan_name ? body.plan_name : null,
        department2: body.department2 ? body.department2 : null,
        expenses: body.expenses ? body.expenses : null,
        price: body.price ? body.price : null,
        amount: body.amount ? body.amount : null,
        total_price: body.total_price ? body.total_price : null,
        money_source: body.money_source ? body.money_source : null,
        unit: body.unit ? body.unit : null,
        req_type: body.req_type ? body.req_type : null,
        replace_id: body.replace_id ? body.replace_id : null,
        status: body.status ? body.status : null,
    }
    req.getConnection(function (err, connection) {
        connection.query("SELECT plan_code FROM plans  WHERE plan_code= ?", [post.plan_code], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'รหัสซ้ำ'
                })
            } else {
                connection.query("insert into plans set ?", post, (err, results) => {
                    if (err) return next(err)
                    res.send({ status: 'ok', results })
                    // req.params.id = body.planId;
                    // module.exports.findPlanById(req, res, next);
                })
            }
        })
    })

}

exports.deletePlan = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from plans where plan_id = ? ", [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.updatePlan = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req
    var post = {
        plan_code: body.plan_code ? body.plan_code : null,
        plan_name: body.plan_name ? body.plan_name : null,
        department2: body.department2 ? body.department2 : null,
        expenses: body.expenses ? body.expenses : null,
        price: body.price ? body.price : null,
        amount: body.amount ? body.amount : null,
        total_price: body.total_price ? body.total_price : null,
        money_source: body.money_source ? body.money_source : null,
        unit: body.unit ? body.unit : null,
        req_type: body.req_type ? body.req_type : null,
        replace_id: body.replace_id ? body.replace_id : null,
        status: body.status ? body.status : null

    }
    req.getConnection(function (err, connection) {
        connection.query("update plans set ? where plan_id =?", [post, id], function (err, results) {
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
        var sql = "SELECT * FROM plans ";

        if (param.text != 'undefined' && param.fields != 'undefined') {
            sql += "WHERE plan_name LIKE '%{text}%' OR department2 LIKE '%{text2}%'";
            sql = sql.replace('{text}', param.text);
            sql = sql.replace('{text2}', param.text);
        }

        sql += "ORDER BY plan_id DESC LIMIT {limit} OFFSET {offset}";
        sql = sql.replace('{limit}', param.limit);
        sql = sql.replace('{offset}', param.offset);

        console.log(sql);
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            if (results.length > 0) {

                var count = "SELECT * FROM plans ";

                if (param.text != 'undefined' && param.fields != 'undefined') {
                    count += "WHERE plan_name LIKE '%{text}%' OR department2 LIKE '%{text2}%'";
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