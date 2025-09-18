import api from "./api";

//  OTP Login
export const sendOTP = (phone) => api.post("/auth/send-otp", { phone });
export const verifyOTP = (data) => api.post("/auth/verify-otp", data);

// Register (Name + Email + Phone + Password)
export const registerUser = (form) => api.post("/auth/register", form);

// Login with Email + Password
export const loginWithPassword = ({ email, password }) =>
  api.post("/auth/login", { email, password });
