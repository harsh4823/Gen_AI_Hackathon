import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OTP from "./pages/OTP";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SellProduct from "./pages/SellProduct";
import  React  from 'react';
import { Toaster } from "react-hot-toast";

function App() {
  return (
      <React.Fragment>
      <Router>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/" element={<Home />} />
        <Route path="/sellproduct" element={<SellProduct />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard path="/dashboard"/>
            </ProtectedRoute>
          }
          />
      </Routes>
      </Router>
      <Toaster position="bottom-center"/>
      </React.Fragment>
  );
}

export default App;
