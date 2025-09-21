import api from "../../services/api";

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "Is_Fetching" });

        // ✨ CHANGED: Appended the queryString to the API call
        const { data } = await api.get(`/products/artisan?${queryString}`);

        dispatch({
            type: "Fetch_Products",
            payload: {
                // The backend 'Page' object has the product list in the 'content' property
                products: data.content,

                // ✨ CHANGED: Mapped Spring Page properties to your Redux state properties
                pageNumber: data.number,          // Spring uses 'number' for the current page (0-indexed)
                totalPages: data.totalPages,    // This name is correct
                totalItems: data.totalElements,   // Spring uses 'totalElements' for the total count
                pageSize: data.size,            // Spring uses 'size' for the page size
                lastPage: data.last,            // Spring uses 'last' (a boolean) for the last page
            },
        });

        dispatch({ type: "Is_Success" });

    } catch (error) {
        console.log(error);
        dispatch({
            type: "Is_Error",
            payload: error?.response?.data?.message || "Failed To Fetch Products",
        });
    }
};