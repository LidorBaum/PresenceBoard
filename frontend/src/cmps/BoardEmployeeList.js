import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import { Link } from 'react-router-dom'

import Select from "react-dropdown-select";
import employeeService from '../services/employeeService';
import { BoardEmployeePreview } from './BoardEmployeePreview';

// import { EmployeePreview } from './EmployeePreview';

export const BoardEmployeeList = ({ employees, onChangePresence }) => {
    return (
        <>
            <div className='employee-list'>
                {employees.map(emp =>
                    <BoardEmployeePreview onChangePresence= {onChangePresence} key={emp._id} emp={emp} />
                )}
            </div>
        </>
    )
}

