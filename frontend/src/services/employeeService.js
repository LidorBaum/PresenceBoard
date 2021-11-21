import httpService from './httpService'

export default {
    getAllEmployees,
    getEmployeeById,
    removeEmployee,
    updateEmployee,
    addEmployee,
    getAllEmployeesInCompany,
    updateEmployeePresence
}

function getAllEmployees() {
    return httpService.get('employee')
}

function getAllEmployeesInCompany(companyId, sort = 'board'){
    return httpService.get(`employee/company/${companyId}/${sort}`)
}
//employee
function getEmployeeById(employeeId) {
    return httpService.get(`employee/${employeeId}`)
}
function removeEmployee(employeeId) {
    return httpService.delete(`employee/${employeeId}`)
}

function updateEmployee(employeeObj) {
    return httpService.put(`employee/edit/${employeeObj._id}`, employeeObj)
}

function updateEmployeePresence(employeeId, isPresence){
    console.log(employeeId, isPresence);
    return httpService.put(`employee/presence` , {employeeId, isPresence})
}


async function addEmployee(employeeObj) {
    return await httpService.post('employee', employeeObj)
}

