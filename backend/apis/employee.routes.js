const express = require('express');
const Libs = require('../libs');
const { EmployeesModel } = require('../models/employee');

const employeeRouter = express.Router();


employeeRouter.post('/', addEmployee);

employeeRouter.delete('/:employeeId([A-Fa-f0-9]{24})', deleteEmployee);

// employeeRouter.put('/edit/:employeeId([A-Fa-f0-9]{24})', editEmployee);

employeeRouter.put('/presence', updateEmployeePresence);

employeeRouter.put('/presenceAll', _setAllPresence);

employeeRouter.get('/company/:companyId([A-Fa-f0-9]{24})/', getAllEmployeesInCompany);

employeeRouter.get('/:employeeId([A-Fa-f0-9]{24})', getEmployeeById);


function responseError(response, errMessage) {
    let status = 500;
    console.log("ERROR");
    switch (errMessage) {
        case Libs.Errors.CompanyValidation.CompanyDoesNotExists:
            status = 404;    
            break;
        case Libs.Errors.TextValidation.InvalidCompanyName:
        case Libs.Errors.InvalidUrl:
            status = 400;
            break;
    }

    return response.status(status).send(errMessage);
}

async function _setAllPresence (req,res){
    try{
        const result = await EmployeesModel._setAllPresence()
        res.send(result)
    } catch(err){
        res.send(err)
    }
}

async function updateEmployeePresence(req, res){
    try{
        const {employeeId, isPresence} = req.body
        console.log(employeeId, isPresence );
        const newEmpObj = await EmployeesModel.updateIsPresence(employeeId, isPresence)
        return res.send(newEmpObj)
    } catch(err){
        return responseError(res, err.message)
    }
}

async function addEmployee(req, res) {
    try {
        const employee = await EmployeesModel.createEmployee(req.body);

        return res.send(employee);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function deleteEmployee(req, res) {
    try {
        const { employeeId } = req.params;
        const result = await EmployeesModel.deleteEmployee(employeeId);

        if (result.deletedCount === 0) {
            return responseError(res, Libs.Errors.EmployeeValidation.EmployeeDoesNotExists);
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

        await CompaniesModel.updateCompany(companyId, name, logo);

        return res.send();
    } catch(err) {
        return responseError(res, err.message);
    }
}

async function getAllEmployeesInCompany(req, res) {
    try {
        const {companyId} = req.params
        console.log('retrieving emps');
        const employees = await EmployeesModel.getAllEmployeesInCompany(companyId);
        console.log(employees)
        return res.send(employees);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function getEmployeeById(req, res) {
    try {
        const { employeeId } = req.params;
        const employee = await EmployeesModel.getById(employeeId);

        return res.send(employee);
    } catch (err) {
        return responseError(res, err.message);
    }
}

module.exports = employeeRouter;