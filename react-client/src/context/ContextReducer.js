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
            error: false
        };
    case 'LOGIN_FAILURE': case 'LOGOUT':
        return {
            user: null,
            isFetching: false,
            error: true
        };
    case 'UPDATE_PROFILE':
        return {
            user: action.payload,
            isFetching: false,
            error: true
        };
    case 'ADD_TO_CART':
        if (state.shoppingCart.find((item) => item.id === action.payload.id)) {
            console.log('item da trung!');
            return {
                user: state.user,
                shoppingCart: state.shoppingCart
            };
        }
        return {
            user: state.user,
            shoppingCart: [...state.shoppingCart, action.payload]
        };
    case 'REMOVE_ITEM_IN_CART':
        return {
            user: state.user,
            shoppingCart: state.shoppingCart.filter((item) => item.id !== action.payload.id)
        };
    case 'CHANGE_METAMASK':
        return {
            user: state.user,
            shoppingCart: state.shoppingCart,
            metamaskAddress: action.payload
        };
    default:
        return state;
    }
};

export default ContextReducer;
