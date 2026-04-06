import React from 'react';
import { useAuth } from "../context/AuthContext"; // make sure path is correct
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const { user } = useAuth(); 
  console.log(user)
  const navigate = useNavigate(); 

  return (
    <div className="w-64 h-[1100px] bg-green-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8 text-green-100">Dashboard</h2>
      <ul className="space-y-4">
        <li className="hover:text-green-300 cursor-pointer">Overview</li>
        <li className="hover:text-green-300 cursor-pointer">Reports</li>
        <li className="hover:text-green-300 cursor-pointer">Settings</li>

        {/* ✅ ADMIN CHAT */}
        {user?.role === "admin" && (
          <li
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/admin-chat")}
          >
            Chat
          </li>
        )}

        {/* ✅ USER CHAT */}
        {user?.role === "user" && (
          <li
            className="hover:text-green-300 cursor-pointer"
            onClick={() => navigate("/user-chat")}
          >
            Chat with Admin
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
