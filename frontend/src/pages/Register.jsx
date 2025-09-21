import { useState, useEffect } from "react";
// Assuming a new service function to update the user's name
// import { updateUser } from "../services/auth"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUsername } from "../store/actions/authAction";

const Register = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // On component load, check if the user should be on this page.
  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (!authData) {
      toast.error("No session found. Please start again.");
      navigate("/login");
      return;
    }

    const parsedData = JSON.parse(authData);
    // If a full user object with a name exists, they don't need to be here.
    if (parsedData?.username) {
       navigate("/");
    }
    // If there is no temporary token, the flow is broken.
    if (!parsedData.temporaryToken && !parsedData.jwtToken) {
        toast.error("Invalid session. Please try logging in again.");
        navigate("/login");
    }
  }, [navigate]);


  const handleProfileComplete = async () => {
    dispatch(setUsername(name, toast, navigate));
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[90%] sm:w-[400px]">
        <h1 className="text-2xl font-bold text-center text-[var(--artisan-dark)] mb-6">
          Complete Your Profile
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Just one last step. Please enter your full name.
        </p>

        {/* Name Input */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
        />

        {/* Submit Button */}
        <button
          onClick={handleProfileComplete}
          className="w-full bg-[var(--artisan-dark)] text-white py-2 rounded-lg hover:bg-[var(--artisan-brown)] transition duration-300"
        >
          Save & Complete
        </button>
      </div>
    </div>
  );
};

export default Register;