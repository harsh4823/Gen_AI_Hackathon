import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/AuthReducers";

const user = localStorage.getItem("auth")?
        JSON.parse(localStorage.getItem("auth")):
    null;
        
const initialState = {
    auth: {
        user: user
    }
};

export const store = configureStore(
    {
        reducer: {
            auth : authReducer,
        },
        preloadedState : initialState,
    }
);

export default store;