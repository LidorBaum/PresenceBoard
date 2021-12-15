const Joi = require('joi');

function isValidCompanyName(companyName) {
    return Boolean(!Joi.string().min(3).max(20).validate(companyName).error);
}

function isValidName(employeeName) {
    return true;
}

function isValidUrl(url) {
    return true;
}

module.exports = {
    isValidCompanyName,
    isValidUrl,
    isValidName,
};
