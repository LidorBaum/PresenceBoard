import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { CompanyContext } from '../contexts/CompanyContext';
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';


export function Header(props) {
    const { loggedCompany, setLoggedCompany } = useContext(CompanyContext)
    let history = useHistory();

    useEffect(() => {
    }, [loggedCompany])

    const onLogout = async () => {
        await companyService.logoutCompany()
        setLoggedCompany(null)
        history.push('/')
    }

    return (

        <div className='header'>
            <NavLink to={'/'}><img alt='logo' src={loggedCompany ? loggedCompany.logo : "https://res.cloudinary.com/echoshare/image/upload/v1636287815/echo_icon_q1hjeb.png"} /></NavLink>
            {loggedCompany && <div className='company-name'>{loggedCompany.name}</div>}
            <div className='links'>
                {loggedCompany && <NavLink activeClassName='active' to={'/company'} exact={true}>Company Profile</NavLink>}
                {loggedCompany && <NavLink activeClassName='active' to={'/board'} >Board</NavLink>}
                {!loggedCompany && <NavLink activeClassName='active' to={'/login'} >Sign In</NavLink>}
                <NavLink activeClassName='active' to={'/about'} >About</NavLink>
             {loggedCompany && <NavLink activeClassName='inactive' onClick={onLogout} to={'/'}>Logout</NavLink>}
            </div>
        </div>
    )
}