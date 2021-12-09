const bcrypt = require('bcrypt');
const { CompaniesModel } = require('../models/company');

const saltRounds = 10;

async function login(companyId, password) {
    const company = await CompaniesModel.getById(companyId);
    const match = await bcrypt.compare(password, company.password);
    if (!match) return Promise.reject({message: 'Password or company name is not valid'});
    delete company.password;
    return company;
}

async function signup(name, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    const createdCompany = await CompaniesModel.createCompany({
        name,
        password: hash,
    });
    return createdCompany;
}

module.exports = {
    signup,
    login,
};
