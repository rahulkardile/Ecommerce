import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";

import {
  useManualHandlerMutation,
  useGoogleHandlerMutation,
} from "../redux/API/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageRes } from "../types/types";
import { addUser, noUser } from "../redux/Slices/UserSlice";

const Login = () => {
  const [FormData, setFormData] = useState({});

  const [ GoogleLogin ] = useGoogleHandlerMutation();
  const [ ManualLogin ] = useManualHandlerMutation();
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...FormData,
      [e.target.id]: e.target.value,
    });
  };

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      
     const res = await ManualLogin(Object(FormData));
    
      if("data" in res) {

        toast.success(res.data.message);
        dispatch(addUser(res.data.user))
        Navigate("/");
        setFormData({});
      
      }else {

        const error = res.error as FetchBaseQueryError;
        const message = (error.data as messageRes).message;
        toast.error(message);
      
      }

    } catch (error) {
      toast.error("Can't Login Something Went Wrong!");
    }
  };

  const GoogleHandler = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, Provider);

      const res = await GoogleLogin({
        name: String(user.displayName),
        email: String(user.email),
        photo: String(user.photoURL),
        google: String(user.uid),
      })

      if("data" in res) {

        toast.success(res.data.message);
        dispatch(addUser(res.data.user));
        Navigate("/");
        
      }else {

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
        <h1>Welcome back</h1>
        <p className="des">Welcome back! Please enter your details</p>
      </div>

      <form onSubmit={handleManualSubmit} className="">
        <div className="">
          <p>Email</p>
          <input
            type="email"
            placeholder="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="">
          <p>Password</p>
          <input
            type="password"
            placeholder="password"
            id="password"
            onChange={handleChange}
          />
        </div>
        <span>
          <Link to={""}>Forgot Password</Link>
        </span>
        <button type="submit">Login</button>
      </form>
      <div className="google">
        <button onClick={GoogleHandler}>
          <FaGoogle />
          Sign in with Google
        </button>
        <p>
          Don't have an account? <Link to={"/register"}>Sign up</Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Login;
