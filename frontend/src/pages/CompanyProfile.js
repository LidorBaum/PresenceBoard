import React, { useEffect, useState, useContext } from 'react';
import { CompanyContext } from '../contexts/CompanyContext';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { EditEmployeePopup } from '../cmps/EditEmployeePopup'
import employeeService from '../services/employeeService';
import { EmployeesList } from '../cmps/EmployeesList';
import { EmployeeInfoPopup } from '../cmps/EmployeeInfoPopup';
import Button from '@mui/material/Button';

const snackLinkCopied = {severity: 'success', open: true, message: 'NFC Link Copied'}
const snackDeletedEmployee = {severity: 'warning', open: true, message: 'Deleted Succesfully'}

export const CompanyProfile = (props) => {
    const { snack, setSnack } = useContext(SnackbarContext);
    const { loggedCompany } = useContext(CompanyContext)

    const [isNewEmpOpen, setIsNewEmpOpen] = useState(false)
    const [isRefresh, setDoRefresh] = useState(false)
    const [isEmpInfoOpen, setisEmpInfoOpen] = useState(null)

    const toggleEmployeePopup = (doRefresh, newEmployeeObj = null) => {
        console.log(doRefresh, 'DR"');
        setEmployeeToEdit({
            companyId: loggedCompany.id,
            company: loggedCompany.name,
            firstName: '',
            lastName: '',
            image: ''
        })
        if (doRefresh) {
            setDoRefresh(!isRefresh)
            setIsNewEmpOpen(!isNewEmpOpen)
            if (doRefresh === 'new') setisEmpInfoOpen(newEmployeeObj)
            return
        }
        setIsNewEmpOpen(!isNewEmpOpen)
    }

    const toggleEmployeeURLPopup = () => {
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
            const res = await employeeService.getAllEmployeesInCompany(loggedCompany.id, null, 'list')
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
        if (snack.open) {
            setSnack(prevSnack => { return { ...prevSnack, open: false } })
            setTimeout(() => { setSnack(snackDeletedEmployee)}, 100)
        }
        else setSnack(snackDeletedEmployee)
    }

    const showInfo = (employee) => {
        setisEmpInfoOpen(employee)
    }

    const notifyCopyNFC = () => {
        if (snack.open) {
            setSnack(prevSnack => { return { ...prevSnack, open: false }})
            setTimeout(() => { setSnack(snackLinkCopied) }, 100)
        }
        else setSnack(snackLinkCopied)
    }

    if (!loggedCompany || !employees) return <div>Loading...</div>
    return (
        <div className='company-profile-container'>
            <div>
                <h1>Company: {loggedCompany.name}</h1>
                <h2>Number of employees: {employees.length}</h2>
            </div>
            {isNewEmpOpen && <EditEmployeePopup employeeToEdit={employeeToEdit} companyId={employeeToEdit.companyId} company={employeeToEdit.company} handleClose={toggleEmployeePopup} />}
            {isEmpInfoOpen && <EmployeeInfoPopup employee={isEmpInfoOpen} handleClose={toggleEmployeeURLPopup} />}

            <Button variant='contained' onClick={() => toggleEmployeePopup()}> Add new Employee</Button>
            <div className='employees-table'>

                {employees ? <EmployeesList notifyCopyNFC={notifyCopyNFC} showInfo={showInfo} deleteEmployee={deleteEmployee} editEmployee={editEmployee} employees={employees} /> : <div>LOADING</div>}
            </div>

            </div>
    )
}

