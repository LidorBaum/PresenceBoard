import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import Select from "react-dropdown-select";



export const Board = (props) => {
    let history = useHistory();
    const onLogout = async () =>{
   await companyService.logoutCompany()
   history.push('/')
 }
  return (
    <>
      <button onClick={onLogout}>Logout</button>
    </>
  )
}

