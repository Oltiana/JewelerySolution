import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="nav-buttons">
        <Link to="/login" className="nav-btn login-btn">
          Login
        </Link>
        <Link to="/signup" className="nav-btn signup-btn">
          Sign Up
        </Link>
      </div>

      <div className="center-box">
        <h1>Welcome to Jewelry Store</h1>
        <p>Choose an option above to continue.</p>
      </div>
    </div>
  );
};

export default Home;
