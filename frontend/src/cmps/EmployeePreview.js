import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import { SnackbarContext } from '../contexts/SnackbarContext';


// import Button from '@mui/material/Button';


export function EmployeePreview({ emp, editEmployee, deleteEmployee, showInfo, notifyCopyNFC }) {


    const onEditEmployee = () => {
        editEmployee(emp)
    }
    const onDeleteEmployee = () => {
        deleteEmployee(emp._id)
    }
    const onShowInfo = () => {
        showInfo(emp)
    }
    const onCopyNFC = () => {
        navigator.clipboard.writeText(`https://presence-board-echo.herokuapp.com/api/employee/presence/${emp._id}`)
        notifyCopyNFC()
    }


    return (
        <tr>
            <td>{emp.firstName}</td>
            <td>{emp.lastName}</td>
            <td className='image-cell'><img src={emp.image} alt="profile" className="employee-card-img" /> </td>
            <td>
                <Tooltip title='Edit' TransitionComponent={Fade} arrow placement="top">
                    <button onClick={onEditEmployee} ><img alt='edit' src={'https://res.cloudinary.com/echoshare/image/upload/v1636982096/Edit_icon__the_Noun_Project_30184_.svg_lvvq3f.png'}></img></button>
                </Tooltip>
                <Tooltip title="Delete" TransitionComponent={Fade} arrow placement="top">
                    <button onClick={onDeleteEmployee}><img alt='delete' src={'https://res.cloudinary.com/echoshare/image/upload/v1636983047/cross-in-circle-in-red-tom-hill-transparent_qohafi.png'}></img></button>
                </Tooltip>

                <Tooltip title="Info" TransitionComponent={Fade} arrow placement="top">
                    <button onClick={onShowInfo}><img alt='info' src={'https://res.cloudinary.com/echoshare/image/upload/v1638187700/information-icon_t6psc7.svg'}></img></button>
                </Tooltip>

                <Tooltip title="Copy NFC Link" TransitionComponent={Fade} arrow placement="top">
                    <button onClick={onCopyNFC} ><img alt='nfc' src={'https://res.cloudinary.com/echoshare/image/upload/v1637527878/nfc_dl53za.png'}></img></button>
                </Tooltip>
            </td>
        </tr>
    )
}