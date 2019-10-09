exports.updateStatus = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req
    var post = {
        status: body.status ? body.status : null,
        date_plan: body.date_plan ? body.date_plan : null,
        date_dt: body.date_dt ? body.date_dt : null,
        date_st: body.date_st ? body.date_st : null,
    }
    req.getConnection(function (err, connection) {
        connection.query("update requirements set ? where requirement_id =?", [post, id], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })
    })
}

exports.updateMoney = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req
    var post = {
        m_date: body.m_date ? body.m_date : null,
    }
    req.getConnection(function (err, connection) {
        connection.query("update requirements set ? where requirement_id =?", [post, id], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })
    })
}

exports.updateStock = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req
    var post = {
        agreement_id: body.agreement_id ? body.agreement_id : null,
        date_po: body.date_po ? body.date_po : null,
        date_limit: body.date_limit ? body.date_limit : null,
        date_completed: body.date_completed ? body.date_completed : null,
    }
    req.getConnection(function (err, connection) {
        connection.query("update requirements set ? where requirement_id =?", [post, id], function (err, results) {
            if (err) return next(err)
            res.send({ status: 'ok', results })
        })
    })
}

