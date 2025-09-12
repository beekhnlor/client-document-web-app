import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useDocumentStore from "../store/document-store"; 
import  Logo from '../assets/logo.png'

const MainNav = () => {
  const token = useDocumentStore((state) => state.token);
  const user = useDocumentStore((state) => state.user);
  const actionLogout = useDocumentStore((state) => state.actionLogout);
  const navigate = useNavigate();

  const handleLogout = () => {
    actionLogout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium rounded-md transition ${
      isActive ? "bg-gray-600 text-white" : "hover:bg-gray-700 text-white"
    }`;

  return (
    <nav className="shadow-emerald-50 bg-gray-800 text-gray-300">
      <div className="w-full mx-auto px-4 h-24 ">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="text-2xl font-bold text-white">
          <img src={Logo} className="w-32" />
          </Link>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <span className="text-white font-medium"></span>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-sm font-medium rounded-md transition bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/register" className={navLinkClass}>Register</NavLink>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;