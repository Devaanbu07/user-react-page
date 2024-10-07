import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';  

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Our App</h1>
      <div className="button-container">
        <button className="home-button" onClick={() => navigate('/login')}>
          Go to Login Page
        </button>
        <button className="home-button" onClick={() => navigate('/users')}>
          Go to Display User Page
        </button>
      </div>
    </div>
  );
};

export default Home;
