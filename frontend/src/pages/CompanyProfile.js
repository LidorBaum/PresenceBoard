import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import {NewEmployeePopup} from '../cmps/NewEmployeePopup'
import { Link } from 'react-router-dom'
import employeeService from '../services/employeeService';

import Select from "react-dropdown-select";
import { EmployeesList } from '../cmps/EmployeesList';



export const CompanyProfile = (props) => {
    let history = useHistory();
    const { loggedCompany, setLoggedCompany } = useContext(CompanyContext)
    const [isOpen, setIsOpen] = useState(false)
    const toggleNewEmployee = () =>{
        setIsOpen(!isOpen)
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
            {isOpen && <NewEmployeePopup companyId={loggedCompany.id} company={loggedCompany.name} handleClose={toggleNewEmployee}/>}
            <div className='profile-container'>
                <img src={loggedCompany.logo}></img>
            </div>

            <button onClick={toggleNewEmployee}> Add new Employee</button>
            <button>Add Bulk Employees</button>
            {employees ? <EmployeesList employees={employees} /> : <div>LOADING</div>  }

        </>
    )
}

