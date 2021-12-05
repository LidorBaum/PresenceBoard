import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { CompanyContext } from '../contexts/CompanyContext.js';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import Tooltip from '@mui/material/Tooltip';

import Select from 'react-select';
import companyService from '../services/companyService.js';
import { isValidPassword } from '../services/utils.js';
import {
    snackMissingCreds,
    snackInvalidPasswordRegex,
} from '../snackMessages.js';
export const LoginSignup = props => {
    let history = useHistory();

    const { loggedCompany, setLoggedCompany } = useContext(CompanyContext);
    if (loggedCompany) history.push('/board');
    const [isLoading, setIsLoading] = useState(false);
    const notificationHandler = useContext(SnackbarHandlerContext);

    const signupButton = useRef(null);
    const [companies, setCompanies] = useState(null);

    const [loginCred, setLogin] = useState({ companyId: '', password: '' });
    const [signupCred, setSignup] = useState({ companyName: '', password: '' });

    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add('right-panel-active');
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove('right-panel-active');
        });

        const searchQuery = new URLSearchParams(props.location.search);
        if (searchQuery.get('newCompany')) signupButton.current.click();
    }, []);

    useEffect(() => {
        const getCompanies = async () => {
            const res = await companyService.getCompanies();
            const companiesMap = [];
            console.log(res);
            res.forEach(company => {
                companiesMap.push({ label: company.name, value: company._id });
            });
            setCompanies(companiesMap);
        };
        getCompanies();
    }, []);

    const signupHandleChange = ev => {
        ev.persist();
        const field = ev.target.name;
        const value = ev.target.value;
        setSignup(prevSignup => ({ ...prevSignup, [field]: value }));
    };
    const loginHandleChange = ev => {
        ev.persist();
        const field = ev.target.name;
        const value = ev.target.value;
        setLogin(prevLogin => ({ ...prevLogin, [field]: value }));
    };

    const doLogin = async ev => {
        ev.preventDefault();
        setIsLoading(true);
        const { companyId, password } = loginCred;
        if (!companyId || !password) {
            setIsLoading(false);
            return notificationHandler.error(snackMissingCreds);
        }
        const company = await companyService.loginCompany({
            companyId: companyId,
            password,
        });
        if (company.error) {
            notificationHandler.error(company.error.message);
            setIsLoading(false);
            return;
        }
        setLoggedCompany(company);
        history.push('/board');
    };

    const doSignup = async ev => {
        ev.preventDefault();
        setIsLoading(true);
        const { companyName, password } = signupCred;
        if (!companyName || !password) {
            setIsLoading(false);
            return notificationHandler.error(snackMissingCreds);
        }
        if (!isValidPassword(password)) {
            setIsLoading(false);
            return notificationHandler.error(snackInvalidPasswordRegex);
        }
        const company = await companyService.signupCompany({
            name: companyName,
            password,
        });
        if (company.error) {
            notificationHandler.error(company.error.message);
            setIsLoading(false);
            return;
        }

        setLoggedCompany(company);
        history.push('/company');
    };

    const onSelectCompany = chosenCompanyObj => {
        setLogin(prevLogin => ({
            ...prevLogin,
            companyId: chosenCompanyObj.value,
        }));
    };

    return (
        <div className="login-signup-page">
            <div className="container" id="container">
                <div className="form-container sign-up-container">
                    <form action="#" onSubmit={doSignup}>
                        <h1>Create Account</h1>
                        <span>Enter your company's name</span>
                        <input
                            name="companyName"
                            value={signupCred.companyName}
                            onChange={signupHandleChange}
                            type="text"
                            placeholder="Company Name"
                        />
                        <Tooltip
                            title="Password must contain at least 8 characters - 1 number and 1 letter"
                            arrow
                            placement="right"
                        >
                            <input
                                name="password"
                                value={signupCred.password}
                                onChange={signupHandleChange}
                                type="password"
                                placeholder="Password"
                            />
                        </Tooltip>
                        <button disabled={isLoading}>Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form action="#" onSubmit={doLogin}>
                        <h1>Sign in</h1>
                        <div className="select-company">
                            <Select
                                options={companies}
                                value={loginCred.company}
                                onChange={value => onSelectCompany(value)}
                                onBlur={event => event.preventDefault()}
                                blurInputOnSelect={false}
                            />
                        </div>
                        <input
                            name="password"
                            value={loginCred.password}
                            onChange={loginHandleChange}
                            type="password"
                            placeholder="Password"
                        />
                        {/* <a href="#">Forgot your password?</a> */}
                        <button disabled={isLoading}>Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To see who is here, please login</p>
                            <button className="ghost" id="signIn">
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, New Company!</h1>
                            <p>Enter your company's name and join us!</p>
                            <button
                                ref={signupButton}
                                className="ghost"
                                id="signUp"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
