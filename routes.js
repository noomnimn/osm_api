

const passport = require('passport')
const passportService = require('./service/passport')
const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })
const users = require('./controllers/Users')
const user = require('./controllers/user')
const plan = require('./controllers/plan')
const dept = require('./controllers/Dept')
const RegistOriginal = require('./controllers/Regist/RegistOriginal')
const RegistStu = require('./controllers/Regist/RegistStu')
const RegistTrain = require('./controllers/Regist/registTrain')
const Schedule = require('./controllers/Schedule/Schedule')
const Leave = require('./controllers/Leave/LeaveForm')
const requirement = require('./controllers/requirement')
const update = require('./controllers/update')
const upload = require('./controllers/upload')
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send("<h1 style='text-align:center;margin-top:150px; '>PSoffice Api</h1>")
    })
    app.post('/signin', requireSignin, users.signin)

    // user
    app.get('/users', users.findAll)
    app.get('/users/:limit/:offset/:sort_by/:fields/:text', users.findallpagination)
    app.post('/users', users.create)
    app.get('/users/findbyid/:id', users.findById)
    app.put('/users/:id', users.update)
    app.delete('/users/:id', users.delete)
    app.get('/users-profile/:id', users.findProfile)
    app.get('/hash-password', users.hashPassword)

    // members
    app.delete('/api/v1/users/:id', user.deleteUser)
    app.get('/api/v1/users/data/:id', user.findDataById)
    app.get('/api/v1/users/findall', user.findAll)
    app.put('/api/v1/users/:id', user.updateUser)
    app.post('/api/v1/users', user.createUser)
    app.get('/api/v1/users/findallpagination/:limit/:offset/:sort_by/:fields/:text', users.findallpagination)

    // PLAN
    app.get('/api/v1/plan/getDeptList', dept.findDeptList)
    app.get('/api/v1/plan/findall', plan.findAll)
    app.get('/api/v1/plan/findallpagination/:limit/:offset/:text', plan.findallpagination)
    app.get('/api/v1/plan/getbyId/:id', plan.findPlanById)
    app.post('/api/v1/plan', plan.createPlan)
    app.delete('/api/v1/plan/:id', plan.deletePlan)
    app.put('/api/v1/plan/:id', plan.updatePlan)

    // Requirement
    app.get('/api/v1/requirement/getbyId/:id', requirement.findReqById)
    app.get('/api/v1/requirement/findall/:limit/:offset/:text', requirement.findAll)
    app.post('/api/v1/requirement', requirement.createReq)
    app.delete('/api/v1/requirement/:id', requirement.deleteReq)
    app.put('/api/v1/requirement/:id', requirement.updateReq)
    //app.put('/api/v1/requirement/updatestatus/:id', requirement.updateReq)

    // update/id
    app.put('/api/v1/requirement/updatestatus/:id', update.updateStatus)
    app.put('/api/v1/requirement/updatemoney/:id', update.updateMoney)
    app.put('/api/v1/requirement/updatestock/:id', update.updateStock)

    // app.post('/upload', upload.upload)
}
