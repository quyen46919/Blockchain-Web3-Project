import { createContext, useEffect, useReducer } from 'react';
import ContextReducer from './ContextReducer';

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    shoppingCart: JSON.parse(localStorage.getItem('shoppingCart')) || [],
    metamaskAddress: JSON.parse(localStorage.getItem('metamaskAddress')) || [],
    isFetching: false,
    error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ContextReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user));
    }, [state.user]);

    useEffect(() => {
        localStorage.setItem('shoppingCart', JSON.stringify(state.shoppingCart));
    }, [state.shoppingCart]);

    useEffect(() => {
        localStorage.setItem('metamaskAddress', JSON.stringify(state.metamaskAddress));
    }, [state.metamaskAddress]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                shoppingCart: state.shoppingCart,
                metamaskAddress: state.metamaskAddress,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
