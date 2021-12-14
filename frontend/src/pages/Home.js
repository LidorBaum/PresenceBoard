import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import companyService from '../services/companyService';
import { CompanyContext } from '../contexts/CompanyContext';
import { Button } from '@mui/material';
const monitorURL =
    'https://res.cloudinary.com/echoshare/image/upload/v1639472363/Monitor-amico_y3qtgo.svg';
const seekingURL =
    'https://res.cloudinary.com/echoshare/image/upload/v1639472277/Hiring-rafiki_l5zl2f.svg';
const powerURL =
    'https://res.cloudinary.com/echoshare/image/upload/v1639473292/Efficiency-amico_q6kxbc.svg';
const joinURL =
    'https://res.cloudinary.com/echoshare/image/upload/v1639473945/Sign_up-amico_h4lig3.svg';
const signinURL =
    'https://res.cloudinary.com/echoshare/image/upload/v1639474054/Mobile_login-amico_eyriw3.svg';
export const Home = props => {
    const { loggedCompany } = useContext(CompanyContext);
    let history = useHistory();

    const onLogin = () => {
        history.push('/login');
    };

    const onSignup = () => {
        history.push('/login?newCompany=1');
    };
    return (
        <>
            <div className="hero">
                <img src={monitorURL} className="img-monitor" alt="monitor" />
                <div>
                    {/* <h1>Welcome to Presence Board</h1> */}
                    <p>Welcome to</p>
                    <p>Presence Board</p>
                </div>
            </div>

            <div className="seeking">
                <div>
                    <p>Tired of walking around the office,</p>
                    <p>seeking for specific person?</p>
                </div>
                <img src={seekingURL} className="img-seeking" alt="seeking" />
            </div>

            <div className="solution">
                <img src={powerURL} className="img-power" alt="power" />
                <div>
                    <p>No more!</p>
                    <p>
                        Sign up now and check who is AFK, OOO, and save your
                        time, and power
                    </p>
                </div>
            </div>

            <div className="signup-cta">
                <div>
                    <p>Wanna join?</p>
                    <Button variant="contained" onClick={onSignup}>
                        Register your company Now!
                    </Button>
                </div>
                <img src={joinURL} className="img-signup" alt="signip" />
            </div>

            <div className="signin-cta">
                <img src={signinURL} className="img-signin" alt="signin" />
                <div>
                    <p>Already joined?</p>
                    <Button variant="contained" onClick={onLogin}>
                        Log in now!
                    </Button>
                </div>
            </div>
        </>
    );
};
