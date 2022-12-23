import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import './index.css';

// export const config = {
//     readOnlyChainId: Localhost.chainId,
//     readOnlyUrls: {
//         [Localhost.chainId]: 'http://127.0.0.1:8545'
//     }
// };

const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

ReactDOM.render(
    <React.StrictMode>
        {/* <DAppProvider config={config}> */}
        <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'USD' }}>
            <AuthContextProvider>
                <SnackbarProvider
                    maxSnack={1}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transitionDuration={{ exit: 200 }}
                >
                    <App />
                </SnackbarProvider>
            </AuthContextProvider>
            {/* </DAppProvider> */}
        </PayPalScriptProvider>
    </React.StrictMode>,
    document.getElementById('root')
);