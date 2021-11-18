import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { UserContext } from '../App'
import { NavLink } from 'react-router-dom'
import { CompanyContext } from '../contexts/CompanyContext';
import Cookies from 'js-cookie'
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';

// const userIcon = require('../assets/svgs/userIcon.svg')

export function Header(props) {
    const { loggedCompany } = useContext(CompanyContext)
    useEffect(() =>{
    },[loggedCompany])
    // if(!loggedCompany) return <Hypnosis />
    const isLogged = Cookies.get('loggedCompany') ? 'logged' : ''
    return (

        <div className='header'>
            <NavLink to={'/'}><img src={loggedCompany? loggedCompany.logo: "https://res.cloudinary.com/echoshare/image/upload/v1636287815/echo_icon_q1hjeb.png"} /></NavLink>
            {loggedCompany && <div className='company-name'>{loggedCompany.name}</div>}
            <div className='links'>
            {loggedCompany && <NavLink activeClassName='active' to={'/company'} exact={true}>Company Profile</NavLink> }
                {loggedCompany && <NavLink activeClassName='active' to={'/board'} >Board</NavLink>}
                {!loggedCompany && <NavLink activeClassName='active' to={'/login'} >Sign In</NavLink>}
                <NavLink activeClassName='active' to={'/about'} >About</NavLink>
                {/* <NavLink activeClassName='active' to={'/about'} >About</NavLink>
                <NavLink activeClassName='active' to={'/chat'} >Chat</NavLink>
                <NavLink activeClassName='active' to={'/user'} > */}
                {/* <div className='user-div'>
                    {loggedUser? <img className={['userIcon', isLogged].join(' ')} src={loggedUser.profileImg} />  :
                     <img className={['userIcon', isLogged].join(' ')} src={loggedUser?.profileImg || userIcon} /> }
                    {loggedUser? <p style={{display: 'block' }}>Hello {loggedUser.username}</p> : null}
                </div> */}
                {/* </NavLink> */}
            </div>
        </div>
    )
}