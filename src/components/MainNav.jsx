// src/components/user/MainNav.jsx
import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

const MainNav = () => {
  // ข้อมูลผู้ใช้สมมติ
  const user = {
    name: "Client Name",
    email: "client@example.com",
  };

  return (
    // 👇 เปลี่ยนพื้นหลังเป็นสีขาว และเพิ่มเงา
    <nav className="bg-white shadow-sm">
      <div className="w-full mx-auto px-8"> {/* เพิ่ม px */}
        <div className="flex justify-between items-center h-16">
          
          {/* ส่วนนี้อาจจะใช้แสดง Breadcrumb หรือ Title ของหน้าปัจจุบัน */}
          <div>
            <NavLink to="/" className="text-black font-bold text-2xl">LOGO</NavLink>
          </div>

          {/* User Profile Menu */}
          <div className="flex items-center">
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex items-center text-left rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FaUserCircle className="w-9 h-9 text-gray-400" />
                  <div className="ml-3 hidden md:block">
                     <p className="text-sm font-medium text-gray-700">{user.name}</p>
                     <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a href="#" className={`${active ? 'bg-gray-100' : ''} group flex items-center px-4 py-2 text-sm text-gray-700`}>
                        <FaCog className="mr-3 text-gray-400" /> Settings
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a href="/" className={`${active ? 'bg-gray-100' : ''} group flex items-center px-4 py-2 text-sm text-gray-700`}>
                         <FaSignOutAlt className="mr-3 text-gray-400" /> Logout
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;