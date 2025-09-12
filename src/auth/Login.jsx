import React, { useState, useEffect } from "react";
import apiClient from "../api/api.jsx";
import { toast } from "react-toastify";
import useDocumentStore from "../store/document-store.jsx";

const Login= () => {
  const actionLogin = useDocumentStore((state)=>state.actionLogin)
  const [form,setForm] = useState({
    user_name: "",
    password: "",
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
    try{
     const res = await actionLogin(form)
     console.log(res)
    }catch(err){
      console.log(err)
    }
   
  };
  return (
    <div>
      Login
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

        <button className="bg-blue-600 rounded-md">Login</button>
      </form>
    </div>
  );
};

export default Login;
