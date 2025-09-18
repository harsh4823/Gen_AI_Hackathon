import { useState } from "react";
import { sendOTP, loginWithPassword } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { otpGenerate } from "../store/actions/authAction";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const Login = () => {
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Email + Password Login
  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      const res = await loginWithPassword({ email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  // OTP Login
  const handleOtpLogin = async () => {
    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number");
      return;
    }
    dispatch(otpGenerate(phone, toast, navigate));
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] sm:w-[420px]">
        <h1 className="text-3xl font-extrabold text-center text-[var(--artisan-dark)] mb-6">
          Welcome Back 👋
        </h1>

        {/* Mode Switch */}
        <div className="flex justify-center mb-6">
          <button
            className={`w-1/2 py-2 rounded-l-lg ${
              mode === "email"
                ? "bg-[var(--artisan-dark)] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setMode("email")}
          >
            Email Login
          </button>
          <button
            className={`w-1/2 py-2 rounded-r-lg ${
              mode === "phone"
                ? "bg-[var(--artisan-dark)] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setMode("phone")}
          >
            Phone Login
          </button>
        </div>

        {/* Email Login Form */}
        {mode === "email" && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
              />
            </div>
            <button
              onClick={handleEmailLogin}
              className="w-full bg-[var(--artisan-dark)] text-white py-2 rounded-lg hover:bg-[var(--artisan-brown)] transition duration-300"
            >
              Login
            </button>
          </>
        )}

        {/* Phone Login Form */}
        {mode === "phone" && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter 10-digit phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
              />
            </div>
            <button
              onClick={handleOtpLogin}
              className="w-full bg-[var(--artisan-dark)] text-white py-2 rounded-lg hover:bg-[var(--artisan-brown)] transition duration-300"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[var(--artisan-dark)] font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
