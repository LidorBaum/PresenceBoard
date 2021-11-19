import React, { useEffect, useState, useContext } from 'react';
import { CompanyContext } from '../contexts/CompanyContext';
import {NewEmployeePopup} from '../cmps/NewEmployeePopup'
import employeeService from '../services/employeeService';

import { EmployeesList } from '../cmps/EmployeesList';



export const CompanyProfile = (props) => {
    const { loggedCompany } = useContext(CompanyContext)
    const [isNewEmpOpen, setIsNewEmpOpen] = useState(false)
    const toggleNewEmployee = () =>{
        setIsNewEmpOpen(!isNewEmpOpen)
    }
    const [employees, setEmployees] = useState(null);

    useEffect(() => {
        const getEmployees = async () => {
            if(!loggedCompany) return
            const res = await employeeService.getAllEmployeesInCompany(loggedCompany.id)
            console.log(res, 'res');
            setEmployees(res)
        }
        getEmployees()
    }, [loggedCompany])

    if (!loggedCompany) return <div>Loading...</div>
    return (
        <>
            {isNewEmpOpen && <NewEmployeePopup companyId={loggedCompany.id} company={loggedCompany.name} handleClose={toggleNewEmployee}/>}
            <div className='profile-container'>
                <img alt='logo' src={loggedCompany.logo}></img>
            </div>

            <button onClick={toggleNewEmployee}> Add new Employee</button>
            <button>Add Bulk Employees</button>
            {employees ? <EmployeesList employees={employees} /> : <div>LOADING</div>  }

        </>
    )
}

