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

ReactDOM.render(
    <React.StrictMode>
        {/* <DAppProvider config={config}> */}
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
    </React.StrictMode>,
    document.getElementById('root')
);