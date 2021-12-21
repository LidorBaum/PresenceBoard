import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CompanyContext } from '../contexts/CompanyContext';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { EditEmployeePopup } from '../cmps/EditEmployeePopup';
import employeeService from '../services/employeeService';
import { EmployeesList } from '../cmps/EmployeesList';
import { EmployeeInfoPopup } from '../cmps/EmployeeInfoPopup';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { EditCompanyPopup } from '../cmps/EditCompanyPopup';
import { snackLinkCopied, snackDeletedEmployee } from '../snackMessages';
import Spin from 'react-cssfx-loading/lib/Spin';

export const CompanyProfile = props => {
    const notificationHandler = useContext(SnackbarHandlerContext);
    let history = useHistory();
    const { loggedCompany, setLoggedCompany } = useContext(CompanyContext);
    if (!loggedCompany) history.push('/');
    const [isEmpEditOpen, setIsEmpEditOpen] = useState(false);
    const [isEmpInfoOpen, setisEmpInfoOpen] = useState(false);
    const [isCompanyEditOpen, setIsCompanyEditOpen] = useState(false);
    const [isRefresh, setDoRefresh] = useState(false);
    const handleClickAway = () => {
        setIsCompanyEditOpen(false);
        setIsEmpEditOpen(false);
        setisEmpInfoOpen(false);
    };
    const toggleEmployeePopup = (doRefresh = null, newEmployeeObj = null) => {
        setEmployeeToEdit({
            companyId: loggedCompany._id,
            company: loggedCompany.name,
            firstName: '',
            lastName: '',
            image: '',
        });
        if (doRefresh !== 'new' && doRefresh !== 'update')
            return setIsEmpEditOpen(!isEmpEditOpen);
        if (doRefresh) {
            setDoRefresh(!isRefresh);
            setIsEmpEditOpen(!isEmpEditOpen);
            if (doRefresh === 'new') setisEmpInfoOpen(newEmployeeObj);
            return;
        }
        setIsEmpEditOpen(!isEmpEditOpen);
    };

    const toggleEmployeeURLPopup = () => {
        setisEmpInfoOpen(false);
    };
    const toggleCompanyEditPopup = () => {
        setIsCompanyEditOpen(false);
    };

    const [employees, setEmployees] = useState(null);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    useEffect(() => {
        const getEmployees = async () => {
            if (!loggedCompany) return;
            setEmployeeToEdit({
                companyId: loggedCompany._id,
                company: loggedCompany.name,
                firstName: '',
                lastName: '',
                image: '',
            });
            const res = await employeeService.getAllEmployeesInCompany(
                loggedCompany._id,
                {},
                'list'
            );
            if (res.error) {
                return notificationHandler.error(res.error.message);
            }
            setEmployees(res);
        };
        getEmployees();
    }, [loggedCompany, isRefresh]);

    const editEmployee = employeeObj => {
        setEmployeeToEdit({
            ...employeeToEdit,
            firstName: employeeObj.firstName,
            lastName: employeeObj.lastName,
            image: employeeObj.image,
            _id: employeeObj._id,
        });
        setIsEmpEditOpen(true);
    };

    const deleteEmployee = async employeeId => {
        const res = await employeeService.removeEmployee(employeeId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        setDoRefresh(!isRefresh);
        notificationHandler.warning(snackDeletedEmployee);
    };

    const showInfo = employee => {
        setisEmpInfoOpen(employee);
    };

    const notifyCopyNFC = () => {
        notificationHandler.success(snackLinkCopied);
    };

    const updateLoggedCompany = newCompanyObj => {
        setLoggedCompany(prevCompany => {
            return {
                ...prevCompany,
                logo: newCompanyObj.logo,
                name: newCompanyObj.name,
            };
        });
        sessionStorage.setItem('company', JSON.stringify(newCompanyObj));
    };

    if (!loggedCompany || !employees)
        return (
            <div className="table-loader">
                <Spin
                    color="#FF0000"
                    border-color="#0d6efd"
                    width="100px"
                    height="100px"
                    duration="1s"
                />
            </div>
        );
    return (
        <div className="company-profile-container">
            <div className="info-logo">
                <div>
                    <h1>{loggedCompany.name}</h1>
                    <h2>Employees: {employees.length}</h2>
                </div>
                <div
                    className="company-img"
                    onClick={() => setIsCompanyEditOpen(true)}
                >
                    <Tooltip
                        title="Click To Edit Company Info"
                        arrow
                        placement="top"
                    >
                        <img alt="company-logo" src={loggedCompany.logo} />
                    </Tooltip>
                    <div className="img-label">Click to edit</div>
                </div>
            </div>
            {isEmpEditOpen && (
                <EditEmployeePopup
                    handleClickAway={handleClickAway}
                    employeeToEdit={employeeToEdit}
                    companyId={employeeToEdit.companyId}
                    company={employeeToEdit.company}
                    handleClose={toggleEmployeePopup}
                />
            )}
            {isEmpInfoOpen && (
                <EmployeeInfoPopup
                    handleClickAway={handleClickAway}
                    employee={isEmpInfoOpen}
                    handleClose={toggleEmployeeURLPopup}
                    notifyCopyNFC={notifyCopyNFC}
                />
            )}
            {isCompanyEditOpen && (
                <EditCompanyPopup
                    handleClickAway={handleClickAway}
                    company={loggedCompany}
                    handleClose={toggleCompanyEditPopup}
                    updateLoggedCompany={updateLoggedCompany}
                />
            )}
            <Button variant="contained" onClick={() => toggleEmployeePopup()}>
                Add new Employee
            </Button>
            <div className="employees-table">
                {employees ? (
                    <EmployeesList
                        notifyCopyNFC={notifyCopyNFC}
                        showInfo={showInfo}
                        deleteEmployee={deleteEmployee}
                        editEmployee={editEmployee}
                        employees={employees}
                    />
                ) : (
                    <div className="board-loader">
                        <Spin
                            color="#FF0000"
                            border-color="#0d6efd"
                            width="100px"
                            height="100px"
                            duration="1s"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
