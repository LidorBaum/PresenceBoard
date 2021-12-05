import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CompanyContext } from './contexts/CompanyContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { SnackbarHandlerContext } from './contexts/SnackbarHandlerContext';
import { Home } from './pages/Home.js';
import { Board } from './pages/Board.js';
import { LoginSignup } from './pages/LoginSignup.js';
import { CompanyProfile } from './pages/CompanyProfile';
import { Header } from './cmps/Header';
import Cookies from 'js-cookie';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { Button } from '@mui/material';

function App() {
    const [loggedCompany, setLoggedCompany] = useState(null);
    const [snack, setSnack] = useState({});
    useEffect(() => {
        if (loggedCompany) return;
        if (Cookies.get('loggedCompany')) {
            const jsonStr = Cookies.get('loggedCompany').slice(2);
            console.log(JSON.parse(jsonStr));
            setLoggedCompany(JSON.parse(jsonStr));
        }
    }, [loggedCompany]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnack(prevSnack => {
            return { ...prevSnack, open: false };
        });
    };

    const notificationHandler = {
        success: message => showNotification('success', message),
        error: message => showNotification('error', message),
        info: message => showNotification('info', message),
        warning: message => showNotification('warning', message),
    };

    const showNotification = (severity, message) => {
        console.log('I AM SHOWING NOTIFICATION FROM ROOT');
        const snackObj = { severity, message, open: true };
        if (snack.open) {
            setSnack(prevSnack => {
                return { ...prevSnack, open: false };
            });
            return setTimeout(() => {
                setSnack(snackObj);
            }, 100);
        } else setSnack(snackObj);
    };


    return (
        <div className="App">
            <Router>
                <CompanyContext.Provider
                    value={{ loggedCompany, setLoggedCompany }}
                >
                    <SnackbarHandlerContext.Provider
                        value={notificationHandler}
                    >
                        <SnackbarContext.Provider value={{ snack, setSnack }}>
                            {
                                <Snackbar
                                    TransitionComponent={Slide}
                                    onClose={handleClose}
                                    autoHideDuration={3000}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    open={snack.open}
                                >
                                    <Alert
                                        onClose={handleClose}
                                        severity={snack.severity}
                                        sx={{ width: '100%' }}
                                    >
                                        {snack.message}
                                        {/* <Button onClick={handleClose}>Share</Button> */}
                                    </Alert>
                                </Snackbar>
                            }
                            <Header />
                            <div className="content">
                                <Switch>
                                    <Route path="/" component={Home} exact />
                                    <Route
                                        path="/login"
                                        component={LoginSignup}
                                    />
                                    <Route path="/board" component={Board} />
                                    <Route
                                        path="/company"
                                        component={CompanyProfile}
                                    />
                                    {/* <Route path="/" component={About} exact/> */}
                                </Switch>
                            </div>
                            {/* <Footer /> */}
                        </SnackbarContext.Provider>
                    </SnackbarHandlerContext.Provider>
                </CompanyContext.Provider>
            </Router>
        </div>
    );
}

export default App;
