import React, { useState, useContext } from 'react';
import { uploadImg } from '../services/cloudinaryService';
import employeeService from '../services/employeeService';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import {
    snackNoImg,
    snackEmployeeSaved,
    snackError500,
} from '../snackMessages';

export const EditEmployeePopup = ({
    employeeToEdit,
    companyId,
    company,
    handleClose,
    handleClickAway,
}) => {
    const showNotification = useContext(SnackbarHandlerContext);
    const [empForm, setForm] = useState({
        firstName: employeeToEdit.firstName,
        lastName: employeeToEdit.lastName,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setForm(prevForm => {
            return { ...prevForm, [target]: value };
        });
    };
    const [primaryImgUrl, setPrimaryUrl] = useState(
        employeeToEdit.image ||
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
    );
    const onUploadImg = async e => {
        e.persist();
        setIsUploading(true);
        const url = await uploadImg(e);
        setPrimaryUrl(url);
        setIsUploading(false);
    };
    const onAddEmployee = async e => {
        e.preventDefault();
        setIsLoading(true);

        if (
            primaryImgUrl ===
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
        ) {
            setIsLoading(false);
            return showNotification(snackNoImg);
        }

        const employee = {
            firstName: empForm.firstName,
            lastName: empForm.lastName,
            image: primaryImgUrl,
            company: companyId,
        };

        if (employeeToEdit._id) {
            try {
                employee._id = employeeToEdit._id;
                await employeeService.updateEmployee(employee);
                showNotification(snackEmployeeSaved);
                handleClose('update');
            } catch (err) {
                if (err.response?.status === 500 || !err.response) {
                    showNotification(snackError500);
                    setIsLoading(false);
                }
            }
        } else {
            console.log(('Empl to add:', employee));
            try {
                const newEmployeeObj = await employeeService.addEmployee(
                    employee
                );
                showNotification(snackEmployeeSaved);
                handleClose('new', newEmployeeObj);
            } catch (err) {
                if (err.response?.status === 500 || !err.response) {
                    showNotification(snackError500);
                }
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={handleClose}>
                    x
                </span>
                <div className="popup-content">
                    <form id="edit-form" onSubmit={onAddEmployee}>
                        <div className="form-fields">
                            <TextField
                                autoComplete="off"
                                required
                                label="First Name"
                                inputProps={{ minLength: 3 }}
                                name="firstName"
                                placeholder="Employee First Name"
                                value={empForm.firstName}
                                onChange={handleChange}
                            />
                            <TextField
                                autoComplete="off"
                                required
                                label="Last Name"
                                inputProps={{ minLength: 3 }}
                                name="lastName"
                                placeholder="Employee Last Name"
                                value={empForm.lastName}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Company"
                                name="company-name"
                                value={company}
                                InputProps={{ readOnly: true }}
                            />
                        </div>
                        {/* <input minLength="3" required type='text' name='firstName' value={empForm.firstName} placeholder="Employee First Name" onChange={handleChange} /> */}
                        {/* <input minLength="3" required type='text' name='lastName' value={empForm.lastName} placeholder="Employee Last Name" onChange={handleChange} /> */}
                        <div className="form-img">
                            <label htmlFor="img-input">
                                {/* {/* <div className={'img-upload'} /} */}
                                <img
                                    alt="profile img"
                                    className="primary-img"
                                    src={primaryImgUrl}
                                />
                                {/* </div> */}
                                <input
                                    id="img-input"
                                    hidden
                                    onChange={onUploadImg}
                                    type="file"
                                />
                            </label>
                        </div>
                    </form>
                    <Button
                        form="edit-form"
                        type="submit"
                        disabled={isUploading || isLoading}
                    >
                        {employeeToEdit._id ? 'Save' : 'Add'}
                    </Button>
                    {/* <img src={}></img> */}
                </div>
            </div>
        </div>
    );
};
