const bcrypt = require('bcrypt');

exports.findDataById = (req, res, next) => {
    var id = parseInt(req.params.id)
    console.log('id = ' + id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from users where user_id = ? ";
        connection.query(sql, [id], (err, results) => {
            if (err) return next(err)
            res.send(results[0])
        })
    })
}

exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from users";
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.createUser = (req, res, next) => {
    var { body } = req
    var post = {
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username ? body.username : null,
        password: body.password ? body.password : null,
        position: body.position,
        department: body.department,
        role: body.role,
    }
    req.getConnection(function (err, connection) {
        connection.query("select username from users where username=?", [post.username], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'username is Duplicate'

                })
            } else {
                bcrypt.hash(post.password, 10, function (err, hash) {
                    if (err) return next(err)
                    post.password = hash;
                    connection.query("insert into users set ?", post, (err, results) => {
                        console.log(post)
                        if (err) return next(err)
                        res.send({ status: 'ok', results })
                    })
                });
            }
        })
    })

}

exports.updateUser = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req

    var post = {
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username ? body.username : null,
        password: body.password ? body.password : null,
        position: body.position,
        department: body.department,
        role: body.role,
    }

    req.getConnection(function (err, connection) {
        bcrypt.hash(post.password, 10, function (err, hash) {
            if (err) return next(err)
            post.password = hash;
            console.log(post)
            connection.query("update users set ? where user_id =?", [post, id], function (err, results) {
                if (err) return next(err)
                res.send({ status: 'ok', results })
            })
        });
    })
}

exports.deleteUser = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from users where user_id = ? ", [id], (err, results) => {
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


// "plan_code": "test00",
// "plan_name": "test00",
//  "department2": "test00",
// "expenses": "test00",
//  "price": "test00",
//  "amount": "test00",
//  "total_price": "test00",
//  "money_source": "test00",
//  "status": "test00",
//  "unit": "test00",
//  "req_type": "test00",
//   "replace_id": "test00"

   // plan_code: body.plan_code,
        // plan_name: body.plan_name,
        // department2: body.department2,
        // expenses: body.expenses,
        // price: body.price,
        // amount: body.amount,
        // total_price: body.total_price,
        // money_source: body.money_source,
        // status: body.status,
        // unit: body.unit,
        // req_type: body.req_type,
        // replace_id: body.replace_id

        // exports.createPlan = (req, res, next) => {
//     var { body } = req

//     var post = {
//         plan_id: body.planId,
//         plan_code: body.plan_code,
//         plan_name: body.plan_name,
//         department2: body.department2,
//         expenses: body.expenses,
//         price: body.price,
//         amount: body.amount,
//         total_price: body.total_price,
//         money_source: body.money_source,
//         status: body.status,
//         unit: body.unit,
//         req_type: body.req_type,
//         replace_id: body.replace_id
//     }

//     req.getConnection(function (err, connection) {
//         connection.query("SELECT * FROM plans WHERE paln_id = ? AND plan_code = ? AND plan_name = ? AND department2 = ? AND expenses = ?  AND price = ? AND amount = ? AND total_price = ? AND money_source = ? AND status = ? AND unit = ? AND req_type = ? AND replace_id = ?", [post.plan_id, post.plan_code, post.plan_name, post.department2, post.expenses, post.price, post.amount, post.total_price, post.money_source, post.status, post.unit, post.replace_id], (err, results) => {
//             if (err) return next(err)
//             if (results.length > 0) {
//                 connection.query("UPDATE plans WHERE paln_id = ? AND plan_code = ? AND plan_name = ? AND department2 = ? AND expenses = ?  AND price = ? AND amount = ? AND total_price = ? AND money_source = ? AND status = ? AND unit = ? AND req_type = ? AND replace_id = ?", [post.plan_id, post.plan_code, post.plan_name, post.department2, post.expenses, post.price, post.amount, post.total_price, post.money_source, post.status, post.unit, post.replace_id], (err, results) => {
//                     if (err) return next(err)
//                     module.exports.findAll(req, res, next)
//                 })
//             } else {
//                 connection.query("INSERT INTO plans set ?", post, (err, results) => {
//                     if (err) return next(err)
//                     module.exports.findAll(req, res, next)
//                 })
//             }
//         })
//     })

// };