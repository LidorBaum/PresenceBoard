
import React, { useState } from 'react';
import { uploadImg } from '../services/cloudinaryService';
import employeeService from '../services/employeeService';


export const EmployeeInfoPopup = ({ employee, handleClose }) => {

    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={handleClose}>x</span>
                <div className='employee-profile'>
                    <img className='employee-profile-image' src={employee.image} />
                    <div className='employee-info'>
                        <h1>{employee.firstName + " " + employee.lastName}</h1>
                        <h2>Status: <span className={employee.isPresence ? 'green' : 'red'}>{employee.isPresence ? "Here" : "Not Here"}</span></h2>
                        <h2>Last scanned: {new Intl.DateTimeFormat('en-il', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric'}).format(new Date(employee.lastScan))}</h2>
                        <a href={`https://presence-board-echo.herokuapp.com/api/employee/presence/${employee._id}`}>NFC Link</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

