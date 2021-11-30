const bcrypt = require('bcrypt')
const { CompaniesModel } = require('../models/company');

const saltRounds = 10

async function login(companyId, password) {
    // console.log(companyId, password);
    if (!companyId || !password) return Promise.reject('companyName and password are required!')

    const company = await CompaniesModel.getById(companyId)
    if (!company) return Promise.reject('Invalid name or password')
    const match = await bcrypt.compare(password, company.password)
    if (!match) return Promise.reject('Invalid name or password')
    // console.log('succesfull login');
    delete company.password;
    return company;
}

async function signup(name, password) {
    if (!name || !password) return Promise.reject('name and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    const createdCompany = await CompaniesModel.createCompany({name, password: hash})
    // console.log(createdCompany, 'this is the created comp from mongo');
    return createdCompany
}

module.exports = {
    signup,
    login,
}