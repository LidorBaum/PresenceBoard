import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CompanyContext } from '../contexts/CompanyContext';
import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
import employeeService from '../services/employeeService';
import io from 'socket.io-client';
import Spin from 'react-cssfx-loading/lib/Spin';
import Select from 'react-select';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { snackNoEmployees } from '../snackMessages';

const options = [
    { value: null, label: 'Show All' },
    { value: true, label: 'Presence' },
    { value: false, label: 'Not Presence' },
];

const { baseURL } = require('../config');

const socket = io(baseURL);

export const Board = props => {
    let history = useHistory();
    const notificationHandler = useContext(SnackbarHandlerContext);
    const { loggedCompany } = useContext(CompanyContext);
    const [employees, setEmployees] = useState(null);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [filterBy, setFilterBy] = useState({
        text: '',
        presence: null,
    });

    useEffect(() => {
        const getEmployees = async () => {
            if (!loggedCompany) return;
            const res = await employeeService.getAllEmployeesInCompany(
                loggedCompany._id,
                filterBy
            );
            if (res.error) return notificationHandler.error(res.error.message);
            if (
                !res.length &&
                filterBy.text === '' &&
                filterBy.presence === null
            ) {
                notificationHandler.error(snackNoEmployees);
                return history.push('/company');
            }
            setEmployees(res);
        };
        getEmployees();
    }, [loggedCompany, isDataChanged, filterBy]);

    useEffect(() => {
        if (!loggedCompany) return;
        socket.emit('board_page', loggedCompany._id);
    }, [loggedCompany]);

    const onChangePresence = async employeeId => {
        const res = await employeeService.updateEmployeePresence(employeeId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        document.getElementById(`${employeeId}-img`).classList.toggle('gray');
        await socket.emit('update_board', {
            companyId: loggedCompany._id,
            employeeId: employeeId,
        });

        setTimeout(() => setIsDataChanged(!isDataChanged), 1000);
    };

    const refreshBoard = async ({ companyId, employeeId }) => {
        document.getElementById(`${employeeId}`).classList.toggle('gray');
        const res = await employeeService.getAllEmployeesInCompany(companyId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        setEmployees(res);
    };
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        socket.on('update_board', ({ companyId, employeeId }) => {
            refreshBoard({ companyId, employeeId });
        });
    }, []);

    const handleChange = e => {
        e.persist();
        setFilterBy(prevFilter => {
            return { ...prevFilter, text: e.target.value };
        });
    };

    const onSetFilter = valueObj => {
        setFilterBy(prevFilter => {
            return { ...prevFilter, presence: valueObj.value };
        });
        setSelectedOption(valueObj);
    };

    if (!loggedCompany) history.push('/');
    return (
        <div>
            <div className="filter-container">
                <input
                    className="text-search"
                    type="search"
                    value={filterBy.text}
                    placeholder="Enter Name..."
                    onChange={handleChange}
                />
                <div className="presence-select">
                    <Select
                        value={selectedOption || options[0]}
                        onChange={value => onSetFilter(value)}
                        options={options}
                        isSearchable={false}
                    />
                </div>
            </div>
            <div id="board-container" className="board-container">
                {employees ? (
                    <BoardEmployeeList
                        onChangePresence={onChangePresence}
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
