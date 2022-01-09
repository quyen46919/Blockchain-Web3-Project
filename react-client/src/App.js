import AccountPage from 'pages/AccountPage';
import HomePage from 'pages/HomePage';
import NotFoundPage from 'pages/NotFoundPage';
import React from 'react';
import {
    BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import './app.scss';

function App() {
    // const { user } = useContext(AuthContext);
    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route path="/" render={() =>
                        // user ? (
                        <Switch>
                            <Route path="/" component={HomePage} exact />
                            <Route path="/home" component={HomePage} exact />
                            <Route component={NotFoundPage} />
                        </Switch>
                        // ) : ( <Redirect to="/account"/> )
                    }/>
                    <Route path="/account" component={AccountPage} exact/>
                    <Route component={NotFoundPage}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;