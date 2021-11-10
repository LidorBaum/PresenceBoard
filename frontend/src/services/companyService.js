import httpService from './httpService'
import Cookies from 'js-cookie'

export default {
    loginCompany,
    logoutCompany,
    signupCompany,
    getCompanies,
    getCompanyById,
    removeCompany,
    updateCompany
}

function getCompanies() {
    return httpService.get('company')
}
//company
function getCompanyById(companyId) {
    return httpService.get(`company/${companyId}`)
}
function removeCompany(companyId) {
    return httpService.delete(`company/${companyId}`)
}

function updateCompany(companyObj) {
    return httpService.put(`company/edit/${companyObj._id}`, companyObj)
}

async function loginCompany(loginCred) {
    const user = await httpService.post('auth/login', loginCred)
    return _handleLoginCompany(user)
}
async function signupCompany(signupCred) {
    const user = await httpService.post('auth/signup', signupCred)
    return _handleLoginCompany(user)
}
async function logoutCompany() {
    await httpService.post('auth/logout');
    Cookies.remove('loggedCompany')
    sessionStorage.clear();
}
function _handleLoginCompany(company) {
    sessionStorage.setItem('company', JSON.stringify(company))
    return company;
}