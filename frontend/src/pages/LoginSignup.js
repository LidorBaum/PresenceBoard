import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { CompanyContext } from '../contexts/CompanyContext.js';
import Select from "react-dropdown-select";
import companyService from '../services/companyService.js';




export const LoginSignup = (props) => {
  let history = useHistory();
  const { loggedCompany, setLoggedCompany } = useContext(CompanyContext)
  if (loggedCompany) history.push('/board')


  const signupButton = useRef(null)
  const [companies, setCompanies] = useState(null)

  const [msg, setMsg] = useState('')
  const [loginCred, setLogin] = useState({ companyId: '', password: '' })
  const [signupCred, setSignup] = useState({ companyName: '', password: '' })

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });

    const searchQuery = new URLSearchParams(props.location.search);
    if (searchQuery.get('newCompany')) signupButton.current.click()
  }, [])

  useEffect(() =>{
    const getCompanies= async () => {
      const res = await companyService.getCompanies()
      const companiesMap = []
      console.log(res);
      res.forEach(company => {
        companiesMap.push({label: company.name, value: company._id})
      })
      setCompanies(companiesMap)
    }
    getCompanies()
  }, [])

  const signupHandleChange = (ev) => {
    ev.persist()
    const field = ev.target.name
    const value = ev.target.value
    setSignup(prevSignup => ({ ...prevSignup, [field]: value }))
  }
  const loginHandleChange = (ev) => {
    ev.persist()
    const field = ev.target.name
    const value = ev.target.value
    setLogin(prevLogin => ({ ...prevLogin, [field]: value }))
    console.log(loginCred);
  }

  const doLogin = async ev => {
    ev.preventDefault()
     console.log('doLogin');
    const {companyId, password} = loginCred
    console.log(loginCred);
    if(!companyId || !password) return console.log('missing creds');
    const company = await companyService.loginCompany({companyId: companyId, password})
    setLoggedCompany(company)
    console.log('signedupSucces');
    // history.push('/')
  }
  const doSignup = async ev => {
    ev.preventDefault()
    console.log('check');
    const {companyName, password} = signupCred
    if(!companyName || !password) return console.log('missing creds');
    const company = await companyService.signupCompany({name: companyName, password})
    setLoggedCompany(company)
    console.log('signedupSucces');
    // history.push('/')
  }

  const onSelectCompany = (value) => {
    const chosenCompany = value[0]
    setLogin(prevLogin => ({ ...prevLogin, companyId: chosenCompany.value }))
  }

  return (
    <div className='login-signup-page'>
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form action="#" onSubmit={doSignup}>
            <h1>Create Account</h1>
            <span>Enter your company's name</span>
            <input name="companyName" value={signupCred.companyName} onChange={signupHandleChange} type="text" placeholder="Company Name" />
            <input name="password" value={signupCred.password} onChange={signupHandleChange} type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#" onSubmit={doLogin}>
            <h1>Sign in</h1>
            <div className='selectCompany'>
            <Select
              options={companies}
              values={loginCred.company}
              onChange={(value) => onSelectCompany(value)}
            />
            </div>
            <input name="password" value={loginCred.password} onChange={loginHandleChange} type="password" placeholder="Password" />
            {/* <a href="#">Forgot your password?</a> */}
            <button>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To see who is here, please login</p>
              <button className="ghost" id="signIn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, New Company!</h1>
              <p>Enter your company's name and join us!</p>
              <button ref={signupButton} className="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


