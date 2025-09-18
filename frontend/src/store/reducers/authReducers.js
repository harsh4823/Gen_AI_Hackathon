const initialState = {
    user : null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "Login_User": {
            return {
                ...state,
                user: action.payload,
            }
        };
        case "Log_Out": {
            return {
                ...state,
                user: null,
            }
        };
        case "Delete_User": {
            return {
                ...state,
                user: null,
            }
        };
        default:
            return state;
    }
}