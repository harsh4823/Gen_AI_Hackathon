import { useState } from "react";
import { sendOTP, registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password) {
      alert("All fields are required");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    try {
      await registerUser(form);
      await sendOTP(phone);
      navigate("/otp", { state: { ...form } });
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[90%] sm:w-[400px]">
        <h1 className="text-2xl font-bold text-center text-[var(--artisan-dark)] mb-6">
          Create an Account
        </h1>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone (10-digit)"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--artisan-dark)]"
        />

        {/* Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-[var(--artisan-dark)] text-white py-2 rounded-lg hover:bg-[var(--artisan-brown)] transition duration-300"
        >
          Register & Send OTP
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[var(--artisan-dark)] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
