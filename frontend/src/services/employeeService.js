import httpService from './httpService';

export default {
    getAllEmployees,
    getEmployeeById,
    removeEmployee,
    updateEmployee,
    addEmployee,
    getAllEmployeesInCompany,
    updateEmployeePresence,
};

function getAllEmployees() {
    return httpService.get('employee');
}

function getAllEmployeesInCompany(companyId, filterBy, sortBy = 'board') {
    console.log(filterBy, sortBy);

    const query = Object.keys(filterBy)
        .filter(key => filterBy[key] !== null && filterBy[key] !== '')
        .map(key => `${key}=${filterBy[key]}`)
        .join('&');

    return httpService.get(
        `employee/company/${companyId}/${sortBy}?${query}`
    );
}
//employee
function getEmployeeById(employeeId) {
    return httpService.get(`employee/${employeeId}`);
}
function removeEmployee(employeeId) {
    return httpService.delete(`employee/${employeeId}`);
}

function updateEmployee(employeeObj) {
    return httpService.put(`employee/edit/${employeeObj._id}`, employeeObj);
}

function updateEmployeePresence(employeeId) {
    return httpService.put(`employee/presence`, { employeeId });
}

async function addEmployee(employeeObj) {
    return await httpService.post('employee', employeeObj);
}
