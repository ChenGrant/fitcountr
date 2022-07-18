import React from 'react'
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state);

  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <div>Profile</div>
  )
}

export default Profile