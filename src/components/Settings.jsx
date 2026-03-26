import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Load current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Correcting endpoint to match backend router mounting point
        const res = await axios.get("/api/settings/profile");
        const data = res.data || {};
        setSettings((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          password: "",           // Ensure password fields are always strings
          confirmPassword: "",
        }));
      } catch (err) {
        console.error("Error loading profile:", err);
        toast.error("Failed to load profile");
        // Maintain defined state even on error to prevent "controlled to uncontrolled" warning
        setSettings(prev => ({
          ...prev,
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }));
      }
    };
    fetchSettings();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value || "" }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (settings.password && settings.password !== settings.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      await axios.post("/api/settings/settings", {
        name: settings.name,
        email: settings.email,
        password: settings.password || undefined,
      });

      toast.success("Settings updated successfully!");
      setSettings((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <h3 className="mb-4 text-center">Account Settings</h3>
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white rounded shadow-sm position-relative"
        >
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={settings.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={settings.email}
              onChange={handleChange}
              required
            />
          </div>

          <hr />
          <h5 className="mb-3">Change Password</h5>

          {/* New Password */}
          <div className="mb-3 position-relative">
            <label className="form-label">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              name="password"
              value={settings.password}
              onChange={handleChange}
            />
            <span
              className="material-symbols-outlined"
              onClick={() => setShowPass(!showPass)}
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "10px",
                top: "38px",
              }}
            >
              {showPass ? "visibility_off" : "visibility"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              name="confirmPassword"
              value={settings.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
