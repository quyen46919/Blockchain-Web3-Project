import Header from 'components/Header';
import AccountPage from 'pages/AccountPage';
import AdminPage from 'pages/AdminPage';
import CartPage from 'pages/CartPage';
// import DetailProduct from 'pages/DetailProduct';
import DetailProduct from 'pages/detailProduct';
import HomePage2 from 'pages/HomePage/index2';
// import HomePage from 'pages/HomePage/index2';
import NotFoundPage from 'pages/NotFoundPage';
import PostItemPage from 'pages/PostItemPage';
import React from 'react';
import {
    BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import './app.scss';

import KYCRegisterPage from 'pages/KYCRegisterPage';
import WelcomePage from 'pages/WelcomePage';

function App() {
    // const { user } = useContext(AuthContext);

    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route path="/account" component={AccountPage} exact />
                    <Route path="/" render={() =>
                        // user ? (
                        <div className="app__nested-routes">
                            <Header />
                            {/* <DetailProduct/> */}
                            <Switch>
                                {/* <Route path="/" component={HomePage2} exact /> */}
                                <Route path="/" component={WelcomePage} exact />
                                <Route path="/home" component={HomePage2} exact />
                                <Route path="/product/:productId" component={DetailProduct} exact />
                                <Route path="/admin" component={AdminPage} exact />
                                <Route path="/post" component={PostItemPage} exact />
                                <Route path="/cart" component={CartPage} exact />
                                <Route path="/kyc" component={KYCRegisterPage} exact />
                            </Switch>
                        </div>
                        // ) : ( <Redirect to="/account"/> )
                    } />
                    <Route component={NotFoundPage} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;