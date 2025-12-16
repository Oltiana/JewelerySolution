import "./Dashboard.css";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.email}</h2>
      <button onClick={logout}>Logout</button>
    </div>
    

  );
};

export default Dashboard;
