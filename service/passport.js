const passport = require('passport');
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcrypt');
const config = require('../config')
const localOptions = { passReqToCallback: true }
const localLogin = new LocalStrategy(localOptions, function (req, username, password, done) {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
            if (err) return done(err)
            if (!row.length) return done(null, false)
            bcrypt.compare(password, row[0].password, function (err, res) {
                if (res) {
                    console.log(row[0])
                    return done(null, row[0])
                } else {
                    return done(null, false)
                }
            });
            // if (row[0].password !== password) {
            //     return done(null, false)
            // } else {
            //     // if (row[0].image != null) {
            //     //     row[0].image = row[0].image.toString('utf-8');
            //     // }
            //     return done(null, row[0])
            // }
        })
    })
})
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('token'),
    secretOrKey: config.secret,
    passReqToCallback: true
};
const jwtRoute = new JwtStrategy(jwtOptions, function (req, payload, done) {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("SELECT u.* , d.deptname FROM user u LEFT JOIN dept d ON u.dept = d.deptid WHERE u.id=?", [payload.sub], (err, row) => {
            if (err) return done(err)
            if (!row.length) return done(null, false);
            return done(null, row[0])
        })
    })
})
passport.use(localLogin)
passport.use(jwtRoute)