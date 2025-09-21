import api from "../../services/api";

export const otpGenerate = (sendData, toast, navigate) => async (dispatch) => {
    try {
        const data = {
            "identifier" : sendData,
        }
        await api.post(`/auth/otp/generate`, data);
        localStorage.setItem("identifier",sendData);
        toast.success("Otp Sent Successfully");
        navigate("/otp");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        
    }
}

export const otpVerify = (otp, toast, navigate) => async (dispatch) => {
    try {
        const sendData = {
            "identifier": localStorage.getItem("identifier"),
            "otp" : otp
        }
        const { data } = await api.post(`/auth/otp/login`, sendData);
        dispatch(
            {
                type: "Login_User",
                payload: data,
            }
        );
        localStorage.setItem("auth", JSON.stringify(data));
        if (data && data.user && data.user.username) {
            // --- EXISTING USER ---
            // The user profile is complete, proceed to login.
            dispatch({
                type: "Login_User",
                payload: data,
            });
            toast.success("Login Successfully");
            navigate("/"); // Navigate to the main app

        } else {
            // --- NEW USER ---
            // The user needs to complete their profile (e.g., add a username).
            // The backend returns a message and a temporary token.
            toast.success(data.message || "OTP Verified! Please complete your profile.");
            navigate("/register"); // Navigate to the profile setup/register page
        }

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        
    }
}

export const setUsername = (name, toast, navigate) => async (dispatch) => {
    try {
        const sendData = {
            "username" : name,
        }
        const { data } = await api.put(`/auth/profile/username`, sendData);
        dispatch(
            {
                type: "Login_User",
                payload: data,
            }
        );
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Login Successfully");
        navigate("/"); // Navigate to the main app

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
    }
}

export const logOutUser = (navigate,dispatch) => {
    dispatch(
        {
            type: "Log_Out"
        }
    );
    localStorage.removeItem("auth");
    navigate("/login");
}

export const deleteUser = (toast, navigate, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        await api.delete(`auth/delete-account`);
        dispatch(
            {
                type: "Delete_User"
            }
        );
        localStorage.removeItem("auth");
        toast.success("Account Deleted Successfully");
        navigate("/login");
    } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
    } finally {
        setLoader(false);
    }
}