import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
import employeeService from '../services/employeeService';
import io from 'socket.io-client'
const { baseURL } = require('../config')


const socket = io(baseURL)

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
      // socket.emit('board_page', loggedCompany.id)
    }
    getEmployees()
  }, [loggedCompany, isDataChanged])

  useEffect(() =>{
    if (!loggedCompany) return
    socket.emit('board_page', loggedCompany.id)
  }, [loggedCompany])

  const onLogout = async () => {
    await companyService.logoutCompany()
    setLoggedCompany(null)
    history.push('/')
  }
  const onChangePresence = async (employeeId) => {
    console.log(employeeId);
    try {
      document.getElementById(`${employeeId}`).classList.toggle('gray')
      const res = await employeeService.updateEmployeePresence(employeeId)
      console.log(res)

      await socket.emit('update_board', {companyId: loggedCompany.id, employeeId: employeeId})
      
      // document.getElementById(`${employeeId}-card`).classList.add('opacity')
      setIsDataChanged(!isDataChanged)
      // setTimeout(()=>setIsDataChanged(!isDataChanged), 100)
    } catch (err) {
      //NEED TO HANDLE ERROR!!!
      console.log(err);
    }
  }

  const refreshBoard = async ({companyId, employeeId}) =>{
    console.log("I NEED TO REFRESH");
    document.getElementById(`${employeeId}`).classList.toggle('gray')
    // setTimeout((companyId)=>{
      const res = await employeeService.getAllEmployeesInCompany(companyId)
      console.log(res, 'res');
      setEmployees(res)
    // }, 1200)
    // setIsDataChanged(!isDataChanged)
  }

  useEffect(() => {
    socket.on('update_board', ({companyId, employeeId}) => {
        // console.log(chatId);
        refreshBoard({companyId, employeeId})
    })
}, [])

  if (!loggedCompany) return <div>Loading...</div>
  return (
    <><div>
      <button onClick={onLogout}>Logout</button>
    </div>
      <img alt='logo' className='board-logo-img' src={loggedCompany.logo}></img>
      <div className='board-container'>
        {employees ? <BoardEmployeeList onChangePresence={onChangePresence} employees={employees} /> : <div>LOADING</div>}
      </div>
    </>

  )
}

