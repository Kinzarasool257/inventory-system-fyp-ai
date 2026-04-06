import React from 'react';

const Dashboard = ({ title, value }) => {
  return (
    <div className="bg-green-50 border border-green-200 p-6 rounded-2xl shadow-md w-full transition duration-300 hover:shadow-lg">
      <h3 className="text-green-700 text-sm mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold text-green-900">{value}</p>
    </div>
  );
};

export default Dashboard;
