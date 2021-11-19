import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CompanyContext } from './contexts/CompanyContext';
import {Home} from './pages/Home.js';
import {Board} from './pages/Board.js';
import { LoginSignup } from './pages/LoginSignup.js';
import { CompanyProfile } from './pages/CompanyProfile';
import { Header } from './cmps/Header';
import Cookies from 'js-cookie'



function App() {
  const [loggedCompany, setLoggedCompany] = useState(null)

  useEffect(() => {
    if (loggedCompany) return
    if (Cookies.get('loggedCompany')) {
      const jsonStr = Cookies.get('loggedCompany').slice(2)
      setLoggedCompany(JSON.parse(jsonStr))
    }
  }, [loggedCompany])


  return (
    <div className="App">
      <Router>
        <CompanyContext.Provider value={{ loggedCompany, setLoggedCompany }}>
          <Header />
          <div className='content'>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/login" component={LoginSignup} />
            <Route path="/board" component={Board} />
            <Route path="/company" component={CompanyProfile} />
            {/* <Route path="/" component={About} exact/> */}
          </Switch>
          </div>
          {/* <Footer /> */}
        </CompanyContext.Provider>
      </Router>
    </div>
  );
}

export default App;
