import React from 'react';

import { EmployeePreview } from './EmployeePreview';

export const EmployeesList = ({ employees, editEmployee, deleteEmployee, showInfo, notifyCopyNFC }) => {
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
                            <EmployeePreview notifyCopyNFC={notifyCopyNFC} showInfo={showInfo} deleteEmployee={deleteEmployee} editEmployee={editEmployee} key={emp._id} emp={emp} />
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

