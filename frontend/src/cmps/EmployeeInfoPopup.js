import React from 'react';
import { Button } from '@mui/material';

export const EmployeeInfoPopup = ({
    employee,
    handleClose,
    notifyCopyNFC,
}) => {
    console.log(notifyCopyNFC);
    const onCopyNFC = () => {
        navigator.clipboard.writeText(
            `https://presence-board-echo.herokuapp.com/api/employee/presence/${employee._id}`
        );
        notifyCopyNFC();
    };

    const lastScan = employee.lastScan
        ? new Intl.DateTimeFormat('en-il', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
          }).format(new Date(employee.lastScan))
        : 'Never Scanned';
    return (
        <div className="popup-box">
            <div className="box infobox">
                <span
                    className="info-close-icon close-icon"
                    onClick={handleClose}
                >
                    x
                </span>
                <div className="employee-profile">
                    <img
                        className="employee-profile-image"
                        src={employee.image}
                    />
                    <div className="employee-info">
                        <h1>{employee.firstName + ' ' + employee.lastName}</h1>
                        <h2>
                            Status:{' '}
                            <span
                                className={
                                    employee.isPresence ? 'green' : 'red'
                                }
                            >
                                {employee.isPresence ? 'Here' : 'Out Of Office'}
                            </span>
                        </h2>
                        <h2>Last scanned: {lastScan}</h2>
                        <Button onClick={onCopyNFC}>Copy NFC Link</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
