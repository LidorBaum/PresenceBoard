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

function getAllEmployeesInCompany(companyId, filterBy, sort = 'board') {
    console.log(filterBy, sort);
    if (!filterBy)
        return httpService.get(`employee/company/${companyId}/${sort}`);
    if (!filterBy.text && filterBy.presence === null)
        return httpService.get(`employee/company/${companyId}/${sort}`);
    if (filterBy.text && !filterBy.presence)
        return httpService.get(
            `employee/company/${companyId}/${sort}?text=${filterBy.text}`
        );
    return httpService.get(
        `employee/company/${companyId}/${sort}?text=${filterBy.text}&presence=${filterBy.presence}`
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
