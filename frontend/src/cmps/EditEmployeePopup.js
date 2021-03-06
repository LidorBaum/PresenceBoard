import React, { useState, useContext } from 'react';
import { uploadImg } from '../services/cloudinaryService';
import employeeService from '../services/employeeService';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { snackNoImg, snackEmployeeSaved } from '../snackMessages';

export const EditEmployeePopup = ({
    employeeToEdit,
    companyId,
    company,
    handleClose,
}) => {
    const notificationHandler = useContext(SnackbarHandlerContext);
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
        if (url.error) {
            notificationHandler.error(url.error.message);
            return setIsLoading(false);
        }
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
            return notificationHandler.error(snackNoImg);
        }

        const employee = {
            firstName: empForm.firstName,
            lastName: empForm.lastName,
            image: primaryImgUrl,
            company: companyId,
        };

        if (employeeToEdit._id) {
            employee._id = employeeToEdit._id;
            const updatedEmpObj = await employeeService.updateEmployee(
                employee
            );
            if (updatedEmpObj.error) {
                notificationHandler.error(updatedEmpObj.error.message);
                return setIsLoading(false);
            }
            notificationHandler.success(snackEmployeeSaved);
            handleClose('update');
        } else {
            const newEmployeeObj = await employeeService.addEmployee(employee);
            if (newEmployeeObj.error) {
                notificationHandler.error(newEmployeeObj.error.message);
                return setIsLoading(false);
            }
            notificationHandler.success(snackEmployeeSaved);
            handleClose('new', newEmployeeObj);
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
                        <div className="form-img">
                            <label htmlFor="img-input">
                                <img
                                    alt="profile img"
                                    className="primary-img"
                                    src={primaryImgUrl}
                                />
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
                </div>
            </div>
        </div>
    );
};
