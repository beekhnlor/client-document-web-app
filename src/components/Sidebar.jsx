// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlusCircle, FaFolder, FaUpload } from 'react-icons/fa';

const Sidebar = () => {

  const navLinkClass = ({ isActive }) => 
    `flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors duration-200 
     hover:bg-slate-700 hover:text-white
     ${isActive ? 'bg-blue-600 text-white font-bold' : ''}`; // Active ยังใช้สีน้ำเงินเพื่อความโดดเด่น

  return (
    // 👇 เปลี่ยนสีพื้นหลังเป็นสีเทาเข้มอมน้ำเงิน
    <aside className="w-64 bg-slate-700 text-white flex flex-col p-4">
      <div className="flex items-center justify-center border-b border-slate-300 pb-4 mb-4">
        {/* อาจจะเปลี่ยนเป็นโลโก้จริงๆ ในอนาคต */}
        <span className="text-2xl font-semibold text-white tracking-wider text-center">ACCOUNTING DOCUMENT</span>
      </div>
      <nav className="flex-grow space-y-2"> {/* เพิ่ม space-y-2 ให้เมนูห่างกันเล็กน้อย */}
        <NavLink to="/document/create" className={navLinkClass}>
          <FaPlusCircle className="mr-3" />
          <span>Create Document</span>
        </NavLink>
        <NavLink to="/documents" className={navLinkClass}>
          <FaFolder className="mr-3" />
          <span>Documents</span>
        </NavLink>
        <NavLink to="/show" className={navLinkClass}>
          <FaUpload className="mr-3" />
          <span>upload Document</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;