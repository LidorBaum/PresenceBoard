import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';



export const Home = (props) => {
  const { loggedCompany } = useContext(CompanyContext)
  let history = useHistory();

  const retrieveComps = async () => {
    const comps = await companyService.getCompanies()
    console.log(comps);
  }

  const onLogin = () => {
    history.push('/login')
  }

  const onSignup = () => {
    history.push('/login?newCompany=1')
  }
  return (
    <>
      <div>
        <h1>Welcome to Presence Board</h1>
        <h2>Here you can see who is prescense in a bit of a second</h2>
      </div>
      
      <div className='cta-container'>
        <div>
          <h2>Your company is registered?</h2>
          <button onClick={onLogin} >Log in now!</button>
        </div>
        <div>
          <h2>New here? add your company</h2>
          <button onClick={onSignup} >Register Now!</button>
        </div>
      </div>
      <div>HELLO</div>
      <button onClick={retrieveComps}>RETRIEVE</button>
    </>
  )
}

