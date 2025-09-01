import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user/admin session data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("adminId");

    // Optional: clear everything
    // localStorage.clear();

    // Notify
    toast.success("Logged out successfully");

    // Redirect to login page after short delay
    setTimeout(() => {
      navigate("/admin/login"); // change path if normal user logout
    }, 1000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
