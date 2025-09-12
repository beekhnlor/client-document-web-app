import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/api.jsx";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    user_name: "",
    password: "",
    ConfirmPassword: "",
  });

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_name || !form.password || !form.ConfirmPassword) {
      return toast.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
    if (form.password !== form.ConfirmPassword) {
      return toast.error("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post("/api/register", form);
      toast.success(res.data.message || "สมัครสมาชิกสำเร็จ!");
      navigate("/login");
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
    <div className="flex justify-center items-center min-h-[calc(100vh-300px)] bg-gray-50 p-4 ">
      
      <div className="w-full max-w-5xl p-8 bg-white rounded-2xl shadow-lg">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h2>
          <p className="text-gray-500 mt-2">Join us and start your journey!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
   
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="user_name"
              name="user_name"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your username"
              onChange={handleOnChange}
              value={form.user_name}
            />
          </div>

        
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password-input"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Create a password"
              onChange={handleOnChange}
              value={form.password}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="ConfirmPassword"
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Confirm your password"
              onChange={handleOnChange}
              value={form.ConfirmPassword}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-phetsarath font-medium text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'ບັນທືກການລົງທະບຽນ'
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600 py-4">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline ">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;