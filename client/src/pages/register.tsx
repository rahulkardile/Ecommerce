import { Link, useNavigate } from "react-router-dom";
import React, { SyntheticEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useGoogleHandlerMutation } from "../redux/API/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { addUser, noUser } from "../redux/Slices/UserSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageRes } from "../types/types";

const Login = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [GoogleLogin] = useGoogleHandlerMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    console.log(formData);
  };

  const handleManual = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      toast("Working on it!", {
        duration: 2000,
      });

      const res = await fetch("/api/user/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
      } else {
        setLoading(false);
        toast.success(data.message);
        navigate("/login");
        setFormData({});
      }
    } catch (error) {
      toast.error("Can't Register");
      setLoading(false);
    }
  };

  const GoogleHandler = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, Provider);

      const res = await GoogleLogin({
        email: String(user.email),
        name: String(user.displayName),
        google: String(user.uid),
        photo: String(user.photoURL),
      });

      if ("data" in res) {
        toast.success(res.data.message);
        dispatch(addUser(res.data.user));
        navigate("/");
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as messageRes).message;
        dispatch(noUser());
        toast.error(message);
      }
    } catch (error) {
      toast.error("Sign In Failed");
      dispatch(noUser());
      console.log(error);
    }
  };

  return (
    <main className="login">
      <div className="headings">
        <h1>Welcome</h1>
        <p className="des">Welcome! Please enter your details</p>
      </div>

      <form onSubmit={handleManual} className="">
        <div className="">
          <p>Name</p>
          <input
            type="text"
            required
            placeholder="Full Name"
            id="name"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <p>Email</p>
          <input
            type="email"
            required
            placeholder="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <p>Gender</p>
          <select required id="gender" onChange={handleChange} name="">
            <option selected value="select">
              select
            </option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
          </select>
        </div>
        <div className="">
          <p>Date Of Birth</p>
          <input
            type="date"
            required
            placeholder="Date Of Birth"
            id="dob"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <p>Password</p>
          <input
            type="password"
            required
            placeholder="password"
            id="password"
            onChange={handleChange}
          />
        </div>
        <button disabled={loading} style={loading ? { opacity: "50%" } : {}}>
          Register
        </button>
      </form>
      <div className="google">
        <button onClick={GoogleHandler}>
          <FaGoogle />
          Continue with Google
        </button>
        <p>
          Have an account? <Link to={"/login"}>Login</Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Login;
