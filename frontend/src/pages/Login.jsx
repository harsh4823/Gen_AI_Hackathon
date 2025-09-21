import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Assuming you have actions for both generating and verifying the OTP
import { otpGenerate, otpVerify } from "../store/actions/authAction";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const Login = () => {
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(300);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpSent(false); 
      toast.error("Time is up! Please try again.");
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = () => {
    let identifier;
    if (mode === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return toast.error("Please enter a valid email address");
      }
      identifier = email;
    } else {
      if (!/^\d{10}$/.test(phone)) {
        return toast.error("Enter a valid 10-digit phone number");
      }
      identifier = phone;
    }
    
    dispatch(otpGenerate(identifier, toast, () => {
        setOtpSent(true);
        setTimer(300); 
    }));
  };
  
  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      return toast.error("Please enter a valid OTP");
    }
    const identifier = mode === 'email' ? email : phone;
    dispatch(otpVerify(otp, toast, navigate));
  };

  const handleGoBack = () => {
    setOtpSent(false);
    setOtp("");
    setTimer(300);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] sm:w-[420px]">
        {!otpSent ? (
          <>
            <h1 className="text-2xl font-semibold text-center text-[var(--artisan-dark)] mb-6">
              Log in or Create Account
            </h1>

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

            {mode === "email" && (
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
            )}

            {mode === "phone" && (
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter 10-digit phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                {/* --- MESSAGE FOR PHONE OTP --- */}
                <p className="text-xs text-center text-amber-600 mt-2 px-2">
                  This feature is in testing and works only with registered numbers. Please try email OTP if it fails.
                </p>
              </div>
            )}
            
            <button
              onClick={handleSendOtp}
              className="w-full bg-[var(--artisan-dark)] text-white py-2 rounded-lg hover:bg-[var(--artisan-brown)] transition duration-300"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-center text-[var(--artisan-dark)] mb-4">
              Verify OTP
            </h1>
            <p className="text-center text-gray-600 mb-2">
              Enter the OTP sent to <span className="font-semibold">{mode === 'email' ? email : phone}</span>
            </p>

            {/* --- MESSAGE FOR EMAIL OTP --- */}
            {mode === 'email' && (
              <p className="text-center text-xs text-gray-500 mb-4">
                Tip: Please check your spam or junk folder for the OTP.
              </p>
            )}

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg text-center tracking-[0.5em]"
              />
            </div>

            <div className="text-center font-medium text-red-500 my-4">
              Time remaining: {formatTime(timer)}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[var(--artisan-dark)] text-white py-2 rounded-lg hover:bg-[var(--artisan-brown)] transition duration-300"
            >
              Verify OTP
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Didn't receive the OTP?{" "}
              <span onClick={handleGoBack} className="text-[var(--artisan-dark)] font-semibold cursor-pointer">
                Go Back & Retry
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;