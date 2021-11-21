import React, { useEffect, useState, useContext } from 'react';
import { CompanyContext } from '../contexts/CompanyContext';
import { NewEmployeePopup } from '../cmps/NewEmployeePopup'
import employeeService from '../services/employeeService';
import ReactTooltip from 'react-tooltip';
import { EmployeesList } from '../cmps/EmployeesList';
import { EmployeeInfoPopup } from '../cmps/EmployeeInfoPopup';


export const CompanyProfile = (props) => {
    const { loggedCompany } = useContext(CompanyContext)
    const [isNewEmpOpen, setIsNewEmpOpen] = useState(false)
    const [isRefresh, setDoRefresh] = useState(false)
    const [isEmpInfoOpen, setisEmpInfoOpen] = useState(null)

    const toggleEmployeePopup = (doRefresh, newEmployeeObj=null) => {
        console.log(doRefresh, 'DR"');
        setEmployeeToEdit({
            companyId: loggedCompany.id,
            company: loggedCompany.name,
            firstName: '',
            lastName: '',
            image: ''
        })
        if (doRefresh){
            setDoRefresh(!isRefresh)
            setIsNewEmpOpen(!isNewEmpOpen)
            if(doRefresh === 'new') setisEmpInfoOpen(newEmployeeObj)
            return
        }
        setIsNewEmpOpen(!isNewEmpOpen)
    }

    const toggleEmployeeURLPopup = () =>{
        setisEmpInfoOpen(null)
    }

    const [employees, setEmployees] = useState(null);
    const [employeeToEdit, setEmployeeToEdit] = useState(null)
    useEffect(() => {
        const getEmployees = async () => {
            if (!loggedCompany) return
            setEmployeeToEdit({
                companyId: loggedCompany.id,
                company: loggedCompany.name,
                firstName: '',
                lastName: '',
                image: ''
            })
            const res = await employeeService.getAllEmployeesInCompany(loggedCompany.id, 'list')
            console.log(res, 'res');
            setEmployees(res)
        }
        getEmployees()
    }, [loggedCompany, isRefresh])

    const editEmployee = (employeeObj) => {
        setEmployeeToEdit({
            ...employeeToEdit,
            firstName: employeeObj.firstName,
            lastName: employeeObj.lastName,
            image: employeeObj.image,
            _id: employeeObj._id
        })
        setIsNewEmpOpen(true)
    }

    const deleteEmployee = async (employeeId) => {
        console.log("I AM DELETEING");
        await employeeService.removeEmployee(employeeId)
        setDoRefresh(!isRefresh)
    }

    const showNFC = (employee) =>{
        setisEmpInfoOpen(employee)
    }

    if (!loggedCompany || !employees) return <div>Loading...</div>
    return (
        <>
            <div>
                <h1>Company: {loggedCompany.name}</h1>
                <h2>Number of employees: {employees.length}</h2>
            </div>
            {isNewEmpOpen && <NewEmployeePopup employeeToEdit={employeeToEdit} companyId={employeeToEdit.companyId} company={employeeToEdit.company} handleClose={toggleEmployeePopup} />}
            {isEmpInfoOpen && <EmployeeInfoPopup employee={isEmpInfoOpen} handleClose={toggleEmployeeURLPopup}/>}

            <button onClick={() => toggleEmployeePopup()}> Add new Employee</button>
            <button>Add Bulk Employees</button>
            {employees ? <EmployeesList showNFC={showNFC} deleteEmployee={deleteEmployee} editEmployee={editEmployee} employees={employees} /> : <div>LOADING</div>}

        </>
    )
}

