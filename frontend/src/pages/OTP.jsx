import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { otpVerify } from "../store/actions/authAction";
import toast from "react-hot-toast";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loginWithToken } = useAuth();

  const handleVerify = () => {
    dispatch(otpVerify(otp, toast, navigate));
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleVerify}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OTP;
