import React, { useState } from "react";
import { Link, NavLink,useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  const toggleDropdown = () => setIsOpen(!isOpen);

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium rounded-md transition 
    ${isActive 
      ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white" 
      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`;

  return (
    <nav className="bg-white shadow-md">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white ">LOGO</Link>
          </div>



        
            <div className="flex items-center gap-4">
              <NavLink to="register" className={navLinkClass}>Register</NavLink>
              <NavLink to="login" className={navLinkClass}>Login</NavLink>
            </div>
    
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
