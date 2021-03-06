import React, { useState, useContext } from 'react';
import { uploadImg } from '../services/cloudinaryService';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import companyService from '../services/companyService';
import { Tooltip } from '@mui/material';
import { snackNoImg, snackCompanySaved } from '../snackMessages';

export const EditCompanyPopup = ({
    company,
    handleClose,
    updateLoggedCompany,
}) => {
    const notificationHandler = useContext(SnackbarHandlerContext);

    const [companyForm, setForm] = useState({
        name: company.name,
        logo: company.logo,
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

    const onUploadImg = async e => {
        e.persist();
        setIsUploading(true);
        const url = await uploadImg(e);
        if (url.error) {
            notificationHandler.error(url.error.message);
            return setIsLoading(false);
        }
        setForm(prevForm => {
            return { ...prevForm, logo: url };
        });
        setIsUploading(false);
    };

    const onUpdateCompany = async e => {
        e.preventDefault();
        setIsLoading(true);
        if (!companyForm.logo) {
            setIsLoading(false);
            return notificationHandler.warning(snackNoImg);
        }

        const companyObj = {
            name: companyForm.name,
            logo: companyForm.logo,
        };
        companyObj._id = company._id;

        const newCompanyObject = await companyService.updateCompany(companyObj);
        if (newCompanyObject.error) {
            notificationHandler.error(newCompanyObject.error.message);
            return setIsLoading(false);
        }
        notificationHandler.success(snackCompanySaved);
        updateLoggedCompany(newCompanyObject);
        handleClose();
    };

    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={handleClose}>
                    x
                </span>
                <div className="popup-content">
                    <form id="edit-form" onSubmit={onUpdateCompany}>
                        <div className="form-fields">
                            <TextField
                                autoComplete="off"
                                required
                                label="Name"
                                inputProps={{ minLength: 3 }}
                                name="name"
                                placeholder="Company Name"
                                value={companyForm.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="company-form-img">
                            <label htmlFor="img-input">
                                <Tooltip
                                    title="Click To Change Logo"
                                    arrow
                                    placement="top"
                                >
                                    <img
                                        alt="logo-img"
                                        className="primary-img"
                                        src={companyForm.logo}
                                    />
                                </Tooltip>
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
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};
