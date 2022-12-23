import Header from 'components/Header';
import AccountPage from 'pages/LoginPage';
import AdminPage from 'pages/AdminPage';
import CartPage from 'pages/CartPage';
import DetailProduct from 'pages/DetailProduct';
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
import TokenPage from 'pages/TokenPage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';

function App() {
    
    // const { dispatch } = useContext(AuthContext);
    // const [tokenIns, setTokenInstance] = useState();
    // const [tokenSaleInstance, setTokenSaleInstance] = useState();
    // const [kycInstance, setKycInstance] = useState();
    // const [account, setAccount] = useState('');
    // const [userTokens, setUserToken] = useState(0);
    // const [web3Ins, setWeb3Ins] = useState();

    // useEffect(() => {
    //     const initLoad = async () => {
    //         try {
    //             const web3 = await getWeb3();
    //             const account = await web3.eth.getAccounts();
    //             const networkId = await web3.eth.net.getId();
    //             const tokenInstance = new web3.eth.Contract(
    //                 MyToken.abi,
    //                 MyToken.networks[networkId] && MyToken.networks[networkId].address
    //             );
    //             const tokenSaleInstance = new web3.eth.Contract(
    //                 MyTokenSale.abi,
    //                 MyTokenSale.networks[networkId] &&
    //                     MyTokenSale.networks[networkId].address
    //             );
    //             const kycInstance = new web3.eth.Contract(
    //                 KycContract.abi,
    //                 KycContract.networks[networkId] &&
    //                     KycContract.networks[networkId].address
    //             );
    //             setAccount(account[0]);
    //             setWeb3Ins(web3);
    //             setTokenInstance(tokenInstance);
    //             setTokenSaleInstance(tokenSaleInstance);
    //             setKycInstance(kycInstance);
    //         } catch (err) {
    //             // eslint-disable-next-line no-console
    //             console.log(err);
    //         }
    //     };
    //     initLoad();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useEffect(() => {
    //     if (tokenIns && tokenSaleInstance && kycInstance && web3Ins) {
    //         console.log(JSON.stringify(tokenIns));
    //         dispatch({ type: 'ADD_CONTRACT_INSTANCES', payload: tokenIns.toString() });
    //     }
    // }, [tokenIns, tokenSaleInstance, kycInstance, web3Ins, dispatch]);

    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route path="/login" component={LoginPage} exact/>
                    <Route path="/logup" component={RegisterPage} exact/>
                    <Route path="/" render={() =>
                        // user ? (
                        <div className="app__nested-routes">
                            <Header/>
                            {/* <DetailProduct/> */}
                            <Switch>
                                <Route path="/" component={HomePage2} exact />
                                <Route path="/home" component={HomePage2} exact />
                                <Route path="/product/:productId" component={DetailProduct} exact />
                                <Route path="/admin" component={AdminPage} exact />
                                <Route path="/post" component={PostItemPage} exact />
                                <Route path="/cart" component={CartPage} exact />
                                <Route path="/kyc" component={KYCRegisterPage} exact />
                                <Route path="/kyc" component={KYCRegisterPage} exact />
                                <Route path="/token" component={TokenPage} exact />
                            </Switch>
                        </div>
                        // ) : ( <Redirect to="/account"/> )
                    }/>
                    <Route component={NotFoundPage}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;