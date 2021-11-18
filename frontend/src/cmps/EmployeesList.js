import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import { Link } from 'react-router-dom'

import Select from "react-dropdown-select";
import employeeService from '../services/employeeService';

import { EmployeePreview } from './EmployeePreview';

export const EmployeesList = ({ employees }) => {
    return (
        <>
            <div className='table-header'>
                <table cellPadding='0' cellSpacing='0' border='0'>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Profile Photo</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className='table-content'>
                <table cellSpacing='0' cellPadding='0' border='0'>
                    <tbody>
                        {employees.map(emp =>
                            <EmployeePreview key={emp._id} emp={emp} />
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

