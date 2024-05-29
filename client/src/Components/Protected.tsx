import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface props {
  isAuthenticated: boolean;
  children?: ReactElement;
  admin?: boolean;
  adminOnly?: boolean;
  redirect?: string;
}

const Protected = ({ isAuthenticated, children, redirect, adminOnly, admin } :props) => {

   if(!isAuthenticated) return <Navigate to={String(redirect)} />

   if(adminOnly && !admin) return <Navigate to={String(redirect)} />

   return children ? children : <Outlet />

};

export default Protected;
