// src/reducers/productsReducer.js

// Define the initial state for this part of the Redux store
const initialState = {
    products: [],
    pageNumber: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 0,
    lastPage: true,
    loading: false,
    error: null,
};

// Create the reducer function
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        // When a fetch begins, set loading to true and clear any previous errors
        case "Is_Fetching":
            return {
                ...state,
                loading: true,
                error: null,
            };

        // When products are fetched successfully, update the state with the payload
        case "Fetch_Products":
            return {
                ...state,
                products: action.payload.products,
                pageNumber: action.payload.pageNumber,
                totalPages: action.payload.totalPages,
                totalItems: action.payload.totalItems,
                pageSize: action.payload.pageSize,
                lastPage: action.payload.lastPage,
            };

        // When the fetch is complete and successful, set loading to false
        case "Is_Success":
            return {
                ...state,
                loading: false,
            };

        // If the fetch fails, set loading to false and store the error message
        case "Is_Error":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // For any other action, return the current state without changes
        default:
            return state;
    }
};

export default productsReducer;