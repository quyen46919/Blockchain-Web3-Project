const ContextReducer = (state, action) => {
    switch (action.type) {
    case 'LOGIN_START':
        return {
            user: null,
            isFetching: true,
            error: false
        };
    case 'LOGIN_SUCCESS':
        return {
            user: action.payload,
            isFetching: false,
            error: false,
            metamaskAddress: state.metamaskAddress,
            shoppingCart: state.shoppingCart,
            isKycCompleted: state.isKycCompleted
        };
    case 'LOGIN_FAILURE': case 'LOGOUT':
        return {
            user: null,
            isFetching: false,
            error: true,
            metamaskAddress: [],
            shoppingCart: [],
            isKycCompleted: []
        };
    case 'UPDATE_PROFILE':
        return {
            user: action.payload,
            isFetching: false,
            error: true
        };
    case 'ADD_TO_CART':
        if (state.shoppingCart.find((item) => item.id === action.payload.id)) {
            return {
                user: state.user,
                shoppingCart: state.shoppingCart,
                metamaskAddress: state.metamaskAddress,
                isKycCompleted: state.isKycCompleted
            };
        }
        return {
            user: state.user,
            shoppingCart: [...state.shoppingCart, action.payload],
            metamaskAddress: state.metamaskAddress,
            isKycCompleted: state.isKycCompleted
        };
    case 'REMOVE_ITEM_IN_CART':
        return {
            user: state.user,
            shoppingCart: state.shoppingCart.filter((item) => item.id !== action.payload),
            metamaskAddress: state.metamaskAddress,
            isKycCompleted: state.isKycCompleted
        };
    case 'CHANGE_METAMASK':
        return {
            user: state.user,
            shoppingCart: state.shoppingCart,
            metamaskAddress: action.payload,
            isKycCompleted: state.isKycCompleted
        };
    case 'SET_KYC_USER':
        return {
            user: state.user,
            shoppingCart: state.shoppingCart,
            metamaskAddress: state.metamaskAddress,
            isKycCompleted: action.payload
        };
    default:
        return state;
    }
};

export default ContextReducer;
