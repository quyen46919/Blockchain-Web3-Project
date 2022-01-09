import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import { AuthContextProvider } from './context/AuthContext';
import './index.css';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
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
    </React.StrictMode>,
    document.getElementById('root')
);