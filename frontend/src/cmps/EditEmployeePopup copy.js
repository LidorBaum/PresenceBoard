import React, { useState, useContext } from 'react';
import { uploadImg } from '../services/cloudinaryService';
import employeeService from '../services/employeeService';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

const snackNoImg = {
    severity: 'warning',
    open: true,
    message: 'You Must Upload A Photo',
};
const snackError500 = {
    severity: 'error',
    open: true,
    message: 'There was an Error with the server, please try again',
};
const snackEmployeeSaved = {
    severity: 'success',
    open: true,
    message: 'The employee saved successfully',
};
export const EditEmployeePopup = ({
    employeeToEdit,
    companyId,
    company,
    handleClose,
    handleClickAway,
}) => {
    console.log(company, companyId);
    const { snack, setSnack } = useContext(SnackbarContext);
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
            if (snack.open) {
                setSnack(prevSnack => {
                    return { ...prevSnack, open: false };
                });
                return setTimeout(() => {
                    setSnack(snackNoImg);
                }, 100);
            } else return setSnack(snackNoImg);
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
                const newEmployeeObj = await employeeService.updateEmployee(
                    employee
                );
                if (snack.open) {
                    setSnack(prevSnack => {
                        return { ...prevSnack, open: false };
                    });
                    setTimeout(() => {
                        setSnack(snackEmployeeSaved);
                    }, 100);
                } else setSnack(snackEmployeeSaved);
                handleClose('update');
            } catch (err) {
                if (err.response?.status === 500 || !err.response) {
                    if (snack.open) {
                        setSnack(prevSnack => {
                            return { ...prevSnack, open: false };
                        });
                        setTimeout(() => {
                            setSnack(snackError500);
                        }, 100);
                    } else setSnack(snackError500);
                }
                setIsLoading(false);
            }
        } else {
            console.log(('Empl to add:', employee));
            try {
                const newEmployeeObj = await employeeService.addEmployee(
                    employee
                );
                if (snack.open) {
                    setSnack(prevSnack => {
                        return { ...prevSnack, open: false };
                    });
                    setTimeout(() => {
                        setSnack(snackEmployeeSaved);
                    }, 100);
                } else setSnack(snackEmployeeSaved);
                handleClose('new', newEmployeeObj);
            } catch (err) {
                if (err.response?.status === 500 || !err.response) {
                    if (snack.open) {
                        setSnack(prevSnack => {
                            return { ...prevSnack, open: false };
                        });
                        setTimeout(() => {
                            setSnack(snackError500);
                        }, 100);
                    } else setSnack(snackError500);
                }
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="popup-box" onClick={handleClickAway}>
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
