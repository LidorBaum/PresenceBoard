import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import { Link } from 'react-router-dom'
import { BoardEmployeeList } from '../cmps/BoardEmployeeList';

import Select from "react-dropdown-select";
import employeeService from '../services/employeeService';



export const Board = (props) => {
  let history = useHistory();
  const { loggedCompany, setLoggedCompany } = useContext(CompanyContext)
  const [employees, setEmployees] = useState(null);
  const [isDataChanged, setIsDataChanged] = useState(false);
  useEffect(() => {
    const getEmployees = async () => {
      if (!loggedCompany) return
      const res = await employeeService.getAllEmployeesInCompany(loggedCompany.id)
      console.log(res, 'res');
      setEmployees(res)
    }
    getEmployees()
  }, [loggedCompany, isDataChanged])

  const onLogout = async () => {
    await companyService.logoutCompany()
    setLoggedCompany(null)
    history.push('/')
  }
  const onChangePresence = async (employeeId, isPresence) => {
    console.log(employeeId);
    try {
      const res = await employeeService.updateEmployeePresence(employeeId, isPresence)
      console.log(res)
      // document.getElementById(`${employeeId}-card`).classList.add('opacity')
      // setIsDataChanged(!isDataChanged)
      setTimeout(()=>setIsDataChanged(!isDataChanged), 1200)
    } catch (err) {
      //NEED TO HANDLE ERROR!!!
      console.log(err);
    }
  }
  if (!loggedCompany) return <div>Loading...</div>
  return (
    <><div>
      <button onClick={onLogout}>Logout</button>
    </div>
      <img className='board-logo-img' src={loggedCompany.logo}></img>
      <div className='board-container'>
        {employees ? <BoardEmployeeList onChangePresence={onChangePresence} employees={employees} /> : <div>LOADING</div>}
      </div>
    </>

  )
}

