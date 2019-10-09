exports.findReqById = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        // var sql = "select * from requirements where requirement_id = ? ";
        var sql = `SELECT req.requirement_id,
IF(req.req_plantype = 'ในแผน',pl.plan_name,req.requirement_name) AS requirement_name,
req.requirement_code,req.firstname,req.lastname,req.department,req.department2,req.position,req.req_plantype,req.unit,req.price,req.amount,req.total_price,req.status,req.req_type,req.detail,req.replace_id,req.agreement_id,req.date_po,req.date_limit,req.date_completed,req.m_date,req.expenses,req.money_source,req.created,req.updated,req.quotation1,quotation2,req.quotation3,req.file4,req.image,req.spec_file,req.plan_file,req.replace_id,req.boqfile,req.catalog_file,req.date_plan,req.date_dt,req.date_st
FROM requirements req
LEFT JOIN plans pl ON req.requirement_name = pl.plan_id 
WHERE req.requirement_id = ?`;
        connection.query(sql, [id], (err, results) => {
            if (err) return next(err)
            res.send(results[0])
        })
    })
}

exports.findAll = (req, res, next) => {
    var param = req.params;
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT req.requirement_id,"
            + "IF(req.req_plantype = 'ในแผน',pl.plan_name,req.requirement_name) AS requirement_name,"
            + "req.requirement_code,req.firstname,req.lastname,req.department,req.department2,req.position,req.req_plantype,req.unit,req.price,req.amount,req.total_price,req.status,req.req_type,req.detail,req.replace_id,req.agreement_id,req.date_po,req.date_limit,req.date_completed,req.m_date,req.expenses,req.money_source,req.created,req.updated,req.quotation1,quotation2,req.quotation3,req.file4,req.image,req.spec_file,req.plan_file,req.replace_id,req.date_plan,req.date_dt,req.date_st "
            + "FROM requirements req "
            + "LEFT JOIN plans pl ON req.requirement_name = pl.plan_id "; // plan_id


        if (param.text != 'undefined' && param.fields != 'undefined') {
            sql += "WHERE req.{fields} LIKE '%{text}%' ";
            sql = sql.replace('{fields}', param.fields);
            sql = sql.replace('{text}', param.text);
        }

        // if (param.sort_by != 'undefined') {
        //     sql += "ORDER BY {sort} ";
        //     sql = sql.replace('{sort}', param.sort_by);
        // }

        sql += "ORDER BY req.requirement_id DESC LIMIT {limit} OFFSET {offset}";
        sql = sql.replace('{limit}', param.limit);
        sql = sql.replace('{offset}', param.offset);

        console.log(sql);
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            if (results.length > 0) {

                var count = "SELECT * FROM requirements ";

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

exports.createReq = (req, res, next) => {
    var { body } = req
    var post = {
        requirement_id: body.requirement_id,
        requirement_name: body.requirement_name ? body.requirement_name : null,
        requirement_code: body.requirement_code ? body.requirement_code : null,
        firstname: body.firstname ? body.firstname : null,
        lastname: body.lastname ? body.lastname : null,
        department: body.department ? body.department : null,
        department2: body.department2 ? body.department2 : null,
        position: body.position ? body.position : null,
        req_plantype: body.req_plantype ? body.req_plantype : null,
        unit: body.unit ? body.unit : null,
        price: body.price ? body.price : null,
        amount: body.amount ? body.amount : null,
        total_price: body.total_price ? body.total_price : null,
        status: body.status ? body.status : null,
        req_type: body.req_type ? body.req_type : null,
        detail: body.detail ? body.detail : null,
        quotation1: body.quotation1 ? body.quotation1 : null,
        quotation2: body.quotation2 ? body.quotation2 : null,
        quotation3: body.quotation3 ? body.quotation3 : null,
        file4: body.file4 ? body.file4 : null,
        replace_id: body.replace_id ? body.replace_id : null,
        agreement_id: body.agreement_id ? body.agreement_id : null,
        date_po: body.date_po ? body.date_po : null,
        date_limit: body.date_limit ? body.date_limit : null,
        date_completed: body.date_completed ? body.date_completed : null,
        m_date: body.m_date ? body.m_date : null,
        image: body.image ? body.image : null,
        expenses: body.expenses ? body.expenses : null,
        money_source: body.money_source ? body.money_source : null,
        spec_file: body.spec_file ? body.spec_file : null,
        plan_file: body.plan_file ? body.plan_file : null,
        catalog_file: body.catalog ? body.catalog : null,
        boqfile: body.boqfile ? body.boqfile : null,
        created: new Date(),
        date_plan: body.date_plan ? body.date_plan : null,
        date_dt: body.date_dt ? body.date_dt : null,
        date_st: body.date_st ? body.date_st : null,
    }
    req.getConnection(function (err, connection) {
        connection.query("SELECT requirement_code FROM requirements  WHERE requirement_code= ?", [post.requirement_code], function (err, results) {
            if (err) return next(err)
            if (results.length > 0) {
                res.send({
                    status: 201, message: 'รายการครุภัณฑ์นี้มีในระบบแล้ว'
                })
            } else {
                connection.query("insert into requirements set ?", post, (err, results) => {
                    if (err) return next(err)
                    res.send({ status: 200, results })
                    // req.params.id = body.requirement_id;
                    // module.exports.findPlanById(req, res, next);

                })
            }
        })
    })

}

exports.deleteReq = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from requirements where requirement_id = ? ", [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })

    })
}

exports.updateReq = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req
    var post = {
        requirement_name: body.requirement_name ? body.requirement_name : null,
        requirement_code: body.requirement_code ? body.requirement_code : null,
        firstname: body.firstname ? body.firstname : null,
        lastname: body.lastname ? body.lastname : null,
        department: body.department ? body.department : null,
        department2: body.department2 ? body.department2 : null,
        position: body.position ? body.position : null,
        req_plantype: body.req_plantype ? body.req_plantype : null,
        unit: body.unit ? body.unit : null,
        price: body.price ? body.price : null,
        amount: body.amount ? body.amount : null,
        total_price: body.total_price ? body.total_price : null,
        status: body.status ? body.status : null,
        req_type: body.req_type ? body.req_type : null,
        detail: body.detail ? body.detail : null,
        quotation1: body.quotation1 ? body.quotation1 : null,
        quotation2: body.quotation2 ? body.quotation2 : null,
        quotation3: body.quotation3 ? body.quotation3 : null,
        file4: body.file4 ? body.file4 : null,
        replace_id: body.replace_id ? body.replace_id : null,
        agreement_id: body.agreement_id ? body.agreement_id : null,
        date_po: body.date_po ? body.date_po : null,
        date_limit: body.date_limit ? body.date_limit : null,
        date_completed: body.date_completed ? body.date_completed : null,
        m_date: body.m_date ? body.m_date : null,
        image: body.image ? body.image : null,
        expenses: body.expenses ? body.expenses : null,
        money_source: body.money_source ? body.money_source : null,
        spec_file: body.spec_file ? body.spec_file : null,
        plan_file: body.plan_file ? body.plan_file : null,
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




        // "requirement_id": "r1",
        // "requirement_name": "r1",
        // "requirement_code":"r1",
        // "firstname":"r1",
        // "lastname": "r1",
        // "department": "r1",
        // "department2":"r1",
        // "position": "r1",
        // "req_plantype": "r1",
        // "unit": "r1",
        // "price":"r1",
        // "amount": "r1",
        // "total_price":"r1",
        // "status":"r1",
        // "req_type": "r1",
        // "detail": "r1",
        // "quotation1":"r1",
        // "quotation2":"r1",
        // "quotation3":"r1",
        // "file4": "r1",
        // "replace_id":"r1",
        // "agreement_id":"r1",
        // "date_po": "r1",
        // "date_limit":"r1",
        // "date_completed":"r1",
        // "m_date":"r1",
        // "image": "r1",
        // "expenses": "r1",
        // "money_source": "r1",
        // "spec_file":"r1",
        // "plan_file":"r1"