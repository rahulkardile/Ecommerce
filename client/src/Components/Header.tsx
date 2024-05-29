import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingBag } from "react-icons/fa";
import { User } from "../types/types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { noUser } from "../redux/Slices/UserSlice";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { useGetSearchResultQuery } from "../redux/API/Product";

interface userType {
  user: User | null;
}

const Header = ({ user }: userType) => {
  const [selected, setSelected] = useState(false);
  const [search, setSearch] = useState("");
  const [searchMain, setSearchMain] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

const { data } = useGetSearchResultQuery({search: searchMain})

  const logoutHandler = async() => {
      const res = await fetch("/api/user/logout");
    const data = await res.json();
// 
      if(data.success === true){

        await signOut(auth)
        
        toast(data.message, {
          duration: 4000,
          position: 'top-center',
          icon: '🥺',
        })
        dispatch(noUser());
      }else{
        toast.error("Can't Logout")
      }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault() 
    setSearchMain(search);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("search", search)
    navigate("/search")
  }

  return (
    <nav className="header">
      <div className="logo">
        <Link to={"/"}>
          <h2>WixShop</h2>
        </Link>
      </div>
      <form className="input" onSubmit={(e)=> handleSubmit(e)}>
        <input type="text" value={search} placeholder="Search . . ." onChange={(e) =>setSearch(e.target.value) }/>
        <Link to={"/search"}>
          <FaSearch />
        </Link>
      </form>

      <div className="other">
        <Link to={"/"}>Home</Link>
        <Link to={"/cart"}>
          <FaShoppingBag />
        </Link>

        <>
          <button type="button" onMouseEnter={()=> setSelected(true)} >
            <img
              src={user?.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt="pro img"
            />
          </button>

          <dialog open={selected} onMouseEnter={()=> setSelected(true)} onMouseLeave={()=> setSelected(false)} className="dialog">
            <div className="inDialog">
              {user?.name ? (
                <>
                  <Link to={"/profile"}>Profile</Link>
                  <Link to={"/orders"}>Orders</Link>
                <Link to={"/list-Product"}>Become Seller</Link>
                  {user.role === "admin" && (
                    <Link to={"/admin/dashboard"}>admin</Link>
                    
                  )}
                  <button onClick={logoutHandler}>Log Out</button>
                </>
              ) : (
                <Link to={"/login"}>Login</Link>
              )}
            </div>
          </dialog>
        </>
      </div>
    </nav>
  );
};

export default Header;
