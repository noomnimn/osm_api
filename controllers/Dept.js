exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from users ";
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
        var sql = "select * from department ORDER BY name";
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

