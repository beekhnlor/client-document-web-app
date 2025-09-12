import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDocumentStore from "../store/document-store.jsx";
import { toast } from 'react-toastify';

const Login = () => {
  const actionLogin = useDocumentStore((state) => state.actionLogin);
  const setLoading = useDocumentStore((state) => state.setLoading);
  const isLoading = useDocumentStore((state) => state.isLoading);
  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    user_name: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_name || !form.password) {
      return toast.warning("กรุณากรอก Username และ Password");
    }

    setLoading(true); 
    try {
      await actionLogin(form);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLoading(false)
      navigate('/'); 
    } catch (err) {
      console.error("Login attempt failed:", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-300px)] bg-gray-50 p-4">
      <div className="w-full max-w-5xl p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back!
          </h2>
          <p className="text-gray-500 mt-2">Sign in to continue to your account.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input id="user_name" name="user_name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="Enter your username" onChange={handleOnChange} value={form.user_name} />
          </div>

          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password-input" name="password" type="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="Enter your password" onChange={handleOnChange} value={form.password} />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex font-phetsarath justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'ເຂົ້າສູ່ລະບົບ'
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;