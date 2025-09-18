import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useSelector(state=>state.auth);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {user?.userName || "Artisan"}</h1>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-yellow-100 rounded">Total Products</div>
        <div className="p-4 bg-green-100 rounded">Earnings</div>
      </div>
    </div>
  );
};

export default Dashboard;
