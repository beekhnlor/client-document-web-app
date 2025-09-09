import React from 'react';
import { FaFileAlt, FaPlusSquare, FaUsers } from 'react-icons/fa';

const StatCard = ({ icon, title, value, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="bg-blue-100 p-4 rounded-full">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};


const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Client!</h1>
        <p className="text-gray-500 mt-1">Here's a summary of your activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<FaFileAlt className="text-blue-500 text-2xl" />} 
          title="Total Documents"
          value="1,250"
          description="+20% from last month"
        />
        <StatCard 
          icon={<FaPlusSquare className="text-green-500 text-2xl" />} 
          title="Newly Created"
          value="82"
          description="In the last 7 days"
        />
        <StatCard 
          icon={<FaUsers className="text-indigo-500 text-2xl" />} 
          title="Active Users"
          value="15"
          description="Online right now"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Activity Graph</h2>
        <div className="h-64 mt-4 bg-gray-100 rounded flex items-center justify-center">
           <p className="text-gray-400">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;