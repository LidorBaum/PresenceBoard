const express = require('express');
const Libs = require('../libs');
const { CompaniesModel } = require('../models/company');

const companyRouter = express.Router();

companyRouter.delete('/:companyId([A-Fa-f0-9]{24})', deleteCompany);

companyRouter.put('/edit/:companyId([A-Fa-f0-9]{24})', editCompany);

companyRouter.get('/', getCompanies);

companyRouter.get('/name/:companyName', checkNameAvailability);

companyRouter.get('/:companyId([A-Fa-f0-9]{24})', getCompany);

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
        default:
            status = 500;
            break;
    }

    return response.status(status).send(errMessage);
}

// async function addCompany(req, res) {
//     try {
//         console.log("TEST", req);
//         const company = await CompaniesModel.createCompany(req.body);
//         return res.send(company);
//     } catch (err) {
//         console.log(err);
//         return responseError(res, err.message);
//     }
// }

async function checkNameAvailability(req,res){
    try{
        const isAvailable = await CompaniesModel.checkNameAvailability(req.params.companyName)
        res.send(isAvailable)
    } catch(err){
        return responseError(res, err.message);

    }
}

async function deleteCompany(req, res) {
    try {
        const { companyId } = req.params;
        const result = await CompaniesModel.deleteCompany(companyId);
        if (result.deletedCount === 0) {
            return responseError(
                res,
                Libs.Errors.CompanyValidation.CompanyDoesNotExists
            );
        }
        return res.send();
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function editCompany(req, res) {
    try {
        const { companyId } = req.params;
        const { name, logo } = req.body;
        const newCompany = await CompaniesModel.updateCompany(
            companyId,
            name,
            logo
        );
        res.cookie('loggedCompany', newCompany);
        return res.send(newCompany);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function getCompanies(req, res) {
    try {
        // console.log('retrieving comps');
        const companies = await CompaniesModel.getCompanies();
        return res.send(companies);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function getCompany(req, res) {
    try {
        const { companyId } = req.params;
        const company = await CompaniesModel.getById(companyId);
        return res.send(company);
    } catch (err) {
        return responseError(res, err.message);
    }
}

module.exports = companyRouter;
