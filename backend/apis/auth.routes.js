const express = require('express')
const authService = require('./auth.service')


const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)


async function login(req, res) {
    const { companyId, password } = req.body
    try {
        const company = await authService.login(companyId, password)
        // console.log(company, 'company that trying to log');
        req.session.company = company._id;
        const returnedCompany = {_id: company._id, name: company.name, logo: company.logo}
        res.cookie('loggedCompany',  returnedCompany)
        res.send(returnedCompany)
    } catch (err) {
        // console.log(err);
        res.status(401).send({ error: err })
    }
}

async function signup(req, res) {
    try {
        const { name, password } = req.body
        const companyObj = await authService.signup(name, password)
        // console.log(companyObj, 'this is the comp object after creatring');
        const companyId = companyObj._id
        const company = await authService.login(companyId, password)
        // console.log(company, 'this is the company after login');
        const returnedCompany = {_id: company._id, name: company.name, logo: company.logo}
        req.session.company = returnedCompany._id
        res.cookie('loggedCompany', returnedCompany)
        res.send(returnedCompany)
    } catch (err) {
        res.status(500).send('could not signup, please try later' )
    }
}


async function logout(req, res){
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(401).send({ error: err })
    }
}


module.exports = router