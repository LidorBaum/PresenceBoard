const express = require('express');
const Libs = require('../libs');
const { EmployeesModel } = require('../models/employee');
const path = require('path');
const {io} = require('socket.io-client')
const { baseURL, env } = require('../config')


const employeeRouter = express.Router();


employeeRouter.post('/', addEmployee);
// employeeRouter.get('/1', fakeData);

employeeRouter.delete('/:employeeId([A-Fa-f0-9]{24})', deleteEmployee);

// employeeRouter.put('/edit/:employeeId([A-Fa-f0-9]{24})', editEmployee);

employeeRouter.put('/presence', updateEmployeePresence);

employeeRouter.get('/presence/:employeeId([A-Fa-f0-9]{24})', updateEmployeePresenceNFC);

employeeRouter.put('/presenceAll', _setAllPresence);

employeeRouter.get('/company/:companyId([A-Fa-f0-9]{24})/:sort', getAllEmployeesInCompany);

employeeRouter.get('/:employeeId([A-Fa-f0-9]{24})', getEmployeeById);

employeeRouter.put('/edit/:employeeId([A-Fa-f0-9]{24})', updateEmployee)


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


async function updateEmployee(req, res){
    try{
        console.log("HERRE");
        const newEmployeeObj = await EmployeesModel.updateEmployee(req.body)
        res.send(newEmployeeObj)
    } catch(err){
        return responseError(res, err.message)
    }
}

async function updateEmployeePresenceNFC(req,res){
    try{
        console.log(baseURL, env);
        let socket
        if(env === 'prod')
             socket = io.connect(baseURL, {secure: true})
        else
             socket = io.connect(baseURL)
        // const socket = io('http://localhost:4444') //forDev
        // const socket = io.connect('https://presence-board-echo.herokuapp.com', {secure: true}) //for heroku



        const employeeId = req.params.employeeId
        const result = await EmployeesModel.updateIsPresence(employeeId)
        await socket.emit('update_board', {companyId: result.company, employeeId: employeeId})
        // res.sendFile(path.join(__dirname, 'socket', 'thanks.html'));
        res.sendFile(path.resolve('public','thanks.html'))
        // res.send("THANKS")
    } 
        catch(err){
        res.send(err)
    }
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
        const {employeeId} = req.body
        const newEmpObj = await EmployeesModel.updateIsPresence(employeeId)
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
        console.log(employeeId);
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
        const {companyId, sort} = req.params
        const employees = await EmployeesModel.getAllEmployeesInCompany(companyId, sort);
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

// const Axios = require('axios')

// async function fakeData() {
//     console.log('1')
//     const response = await Axios.get('https://tinyfac.es/api/data?limit=50&quality=0')
//     console.log('1')
//     console.log('response')

//     const fakedata = response.data.map(async  data => {
//         return await EmployeesModel.create({
//             firstName: data.first_name,
//             lastName: data.last_name,
//             image: data.url,
//             company: '618fcd3936efa0127857fd40'
//         })
//     })
//     return response.send(fakedata);
// }

module.exports = employeeRouter;