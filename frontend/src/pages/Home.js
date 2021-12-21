import React from 'react';
import { useHistory } from 'react-router-dom';
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
                <div className="cta-text">
                    <p>Wanna join with your company?</p>
                    {window.innerWidth > 900 && <Button
                        color="success"
                        style={{
                            maxWidth: '200px',
                            maxHeight: '50px',
                            minWidth: '30px',
                            minHeight: '30px',
                        }}
                        variant="contained"
                        onClick={onSignup}
                    >
                        Register Now!
                    </Button>}
                    {window.innerWidth < 900 && <p>Please switch to desktop and join now!</p>}
                </div>
                <img src={joinURL} className="img-signup" alt="signip" />
            </div>

            <div className="signin-cta">
                <img src={signinURL} className="img-signin" alt="signin" />
                <div className="cta-text">
                    <p>Already joined?</p>
                    {window.innerWidth > 900 && <Button
                        color="success"
                        style={{
                            maxWidth: '200px',
                            maxHeight: '50px',
                            minWidth: '30px',
                            minHeight: '30px',
                        }}
                        variant="contained"
                        onClick={onLogin}
                    >
                        Log in now!
                    </Button>}
                    {window.innerWidth < 900 && <p>Please switch to desktop and login now!</p>}
                </div>
            </div>
        </>
    );
};
