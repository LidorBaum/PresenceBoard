const express = require('express');
const authService = require('./auth.service');
const Libs = require('../libs');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

function responseError(response, errMessage) {
    let status;
    switch (errMessage) {
        case Libs.Errors.CompanyValidation.CompanyDoesNotExists:
            status = 404;
            break;
        case Libs.Errors.TextValidation.InvalidCompanyName:
        case Libs.Errors.InvalidUrl:
            status = 400;
            break;
        case Libs.Errors.CompanyValidation.CompanyNameAlreadyExists:
            status = 403;
            break;
        case Libs.Errors.CompanyValidation.CompanyPasswordNotMatch:
            status = 401;
            break;
        default:
            status = 500;
            break;
    }

    return response.status(status).send(errMessage);
}
async function login(req, res) {
    const { companyId, password } = req.body;
    try {
        const company = await authService.login(companyId, password);
        req.session.company = company._id;
        const returnedCompany = {
            _id: company._id,
            name: company.name,
            logo: company.logo,
        };
        res.cookie('loggedCompany', returnedCompany);
        res.send(returnedCompany);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function signup(req, res) {
    try {
        const { name, password } = req.body;
        const companyObj = await authService.signup(name, password);
        const companyId = companyObj._id;
        const company = await authService.login(companyId, password);
        const returnedCompany = {
            _id: company._id,
            name: company.name,
            logo: company.logo,
        };
        req.session.company = returnedCompany._id;
        res.cookie('loggedCompany', returnedCompany);
        res.send(returnedCompany);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function logout(req, res) {
    try {
        req.session.destroy();
        res.send({ message: 'logged out successfully' });
    } catch (err) {
        res.status(401).send({ error: err });
    }
}

module.exports = router;
