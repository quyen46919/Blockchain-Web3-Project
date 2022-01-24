import Header from 'components/Header';
import AccountPage from 'pages/AccountPage';
import detailProduct from 'pages/detailProduct';
import HomePage2 from 'pages/HomePage/index2';
// import HomePage from 'pages/HomePage/index2';
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
                        <div className="app__nested-routes">
                            <Header/>
                            {/* <detailProduct/> */}
                            <Switch>
                                <Route path="/" component={HomePage2} exact />
                                <Route path="/home" component={HomePage2} exact />
                                <Route path="/product" component={detailProduct} exact />
                            </Switch>
                        </div>
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