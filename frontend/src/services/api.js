import axios from "axios";

const api = axios.create({
    baseURL: `http://localhost:8080/api`,
    withCredentials: true,
});

// ✨ THIS IS THE REQUIRED INTERCEPTOR LOGIC
// It runs before every request to add the authentication token.
api.interceptors.request.use(
    (config) => {
        // Get the auth data from localStorage
        const authDataString = localStorage.getItem("auth");

        if (authDataString) {
            const authData = JSON.parse(authDataString);
            // Assumes the token is at authData.user.token
            const token = authData?.jwtToken; 

            if (token) {
                // Add the token to the Authorization header
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        
        return config; // Return the modified configuration
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;