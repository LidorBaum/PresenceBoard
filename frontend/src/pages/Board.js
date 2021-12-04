import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
import employeeService from '../services/employeeService';
import io from 'socket.io-client';
import SkeletonTheme from '../cmps/SkeletonTheme';
import Spin from 'react-cssfx-loading/lib/Spin';
import Select from 'react-select';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';

const options = [
    { value: null, label: 'Show All' },
    { value: true, label: 'Presence' },
    { value: false, label: 'Not Presence' },
];

const { baseURL } = require('../config');

const snackNoEmployees = {
    severity: 'error',
    open: true,
    message: 'You need to add at least one employee first',
};

const socket = io(baseURL);

export const Board = props => {
    let history = useHistory();
    const showNotification = useContext(SnackbarHandlerContext);
    const { loggedCompany, setLoggedCompany } = useContext(CompanyContext);
    const [employees, setEmployees] = useState(null);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [filterBy, setFilterBy] = useState({
        text: '',
        presence: null,
    });

    useEffect(() => {
        const getEmployees = async () => {
            if (!loggedCompany) return;
            // document.getElementById('board-container').classList.toggle('opacity')
            const res = await employeeService.getAllEmployeesInCompany(
                loggedCompany._id,
                filterBy
            );
            if (
                !res.length &&
                filterBy.text === '' &&
                filterBy.presence === null
            ) {
                showNotification(snackNoEmployees);
                return history.push('/company');
            }
            setEmployees(res);
            // setTimeout(()=>{
            //   setEmployees(res)
            //   // document.getElementById('board-container').classList.toggle('opacity')
            // },600)
            // console.log(res, 'res');

            // socket.emit('board_page', loggedCompany._id)
        };
        getEmployees();
    }, [loggedCompany, isDataChanged, filterBy]);

    useEffect(() => {
        if (!loggedCompany) return;
        socket.emit('board_page', loggedCompany._id);
    }, [loggedCompany]);

    const onLogout = async () => {
        await companyService.logoutCompany();
        setLoggedCompany(null);
        history.push('/');
    };
    const onChangePresence = async employeeId => {
        console.log(employeeId);
        try {
            document
                .getElementById(`${employeeId}-img`)
                .classList.toggle('gray');
            const res = await employeeService.updateEmployeePresence(
                employeeId
            );
            console.log(res);

            await socket.emit('update_board', {
                companyId: loggedCompany._id,
                employeeId: employeeId,
            });

            // document.getElementById(`${employeeId}-card`).classList.add('opacity')
            // setIsDataChanged(!isDataChanged)
            setTimeout(() => setIsDataChanged(!isDataChanged), 1000);
        } catch (err) {
            //NEED TO HANDLE ERROR!!!
            console.log(err);
        }
    };

    const refreshBoard = async ({ companyId, employeeId }) => {
        console.log('I NEED TO REFRESH');
        document.getElementById(`${employeeId}`).classList.toggle('gray');
        const res = await employeeService.getAllEmployeesInCompany(companyId);
        console.log(res, 'res');
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
            <button onClick={onLogout}>Logout</button>
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
            {/* <img alt='logo' className='board-logo-img' src={loggedCompany.logo}></img> */}
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
