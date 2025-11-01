import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Contexts/user.context";

const PrivateRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // send them to login, and come back here after
    const redirectTo = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
