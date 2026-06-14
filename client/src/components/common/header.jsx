import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="bg-green-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Welcome, Admin</h1>
      <button
        onClick={handleLogout}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
