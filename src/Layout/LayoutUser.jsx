// src/Layout/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNav from '../components/MainNav';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
 
    <div className="flex flex-col h-screen bg-slate-50"> 

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto"> 
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;