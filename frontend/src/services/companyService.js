import httpService from './httpService';
import Cookies from 'js-cookie';

export default {
    loginCompany,
    logoutCompany,
    signupCompany,
    getCompanies,
    getCompanyById,
    removeCompany,
    updateCompany,
    checkCompanyNameAvailability,
};

function getCompanies() {
    return httpService.get('company');
}

function checkCompanyNameAvailability(companyName) {
    return httpService.get(`company/name/${companyName}`);
}

function getCompanyById(companyId) {
    return httpService.get(`company/${companyId}`);
}
function removeCompany(companyId) {
    return httpService.delete(`company/${companyId}`);
}

function updateCompany(companyObj) {
    return httpService.put(`company/edit/${companyObj._id}`, companyObj);
}

async function loginCompany(loginCred) {
    const company = await httpService.post('auth/login', loginCred);
    return _handleLoginCompany(company);
}
async function signupCompany(signupCred) {
    const company = await httpService.post('auth/signup', signupCred);
    return _handleLoginCompany(company);
}
async function logoutCompany() {
    const res = await httpService.post('auth/logout');
    if (res.error) return res;
    Cookies.remove('loggedCompany');
    sessionStorage.clear();
}
function _handleLoginCompany(company) {
    sessionStorage.setItem('company', JSON.stringify(company));
    return company;
}
