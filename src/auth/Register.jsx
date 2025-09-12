import React, { useState, useEffect } from "react";
import apiClient from "../api/api.jsx";
import { toast } from "react-toastify";
const register = () => {
  const [form, setForm] = useState({
    user_name: "",
    password: "",
    ConfirmPassword: "",
  });
  const handleOnChange = (e) => {
    // console.log(e.target.name,e.target.value)
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_name && !form.password) {
      return toast.warning("ກາລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ");
    }
    if (form.password !== form.ConfirmPassword) {
      return alert("Confirm Password is not match");
    }
    try {
      const res = await apiClient.post("/api/register", form);
      toast.success(res.data.message);
      console.log(res);
    } catch(err){
      console.log(err);
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
    console.log(form);
  };
  return (
    <div>
      Registe
      <form onSubmit={handleSubmit}>
        User_name
        <input
          className="border"
          onChange={handleOnChange}
          name="user_name"
          type="user_name"
          required
        />
        Password
        <input
          className="boder"
          onChange={handleOnChange}
          name="password"
          type="password"
          required
        />
        Confirm Password
        <input
          className="boder"
          onChange={handleOnChange}
          name="ConfirmPassword"
          type="password"
          required
        />
        <button className="bg-blue-600 rounded-md">Register</button>
      </form>
    </div>
  );
};

export default register;
