import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaImage,
  FaUserCircle,
} from "react-icons/fa";

function Signup() {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

  //  for (let [key, value] of data.entries()) {
  //    console.log(`${key}:`, value);
  //  }


    try {
      await dispatch(signup(data)).unwrap();
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error(`Signup failed: ${err}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl">
        <h2 className="text-xl font-bold text-center text-gray-200 mb-4">
          Signup
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Full Name + Username */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <InputGroup
              icon={<FaUserCircle />}
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
            <InputGroup
              icon={<FaUser />}
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>

          {/* Email + Password */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <InputGroup
              icon={<FaEnvelope />}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            <InputGroup
              icon={<FaLock />}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          {/* Avatar Upload */}
          <FileInputGroup
            icon={<FaImage />}
            label="Avatar (required)"
            name="avatar"
            onChange={handleChange}
            required
          />

          {/* Cover Image Upload */}
          <FileInputGroup
            icon={<FaImage />}
            label="Cover Image (optional)"
            name="coverImage"
            onChange={handleChange}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-bold text-lg rounded-md transition duration-300 cursor-pointer ${
              loading
                ? "bg-red-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "SignUp..." : "Sign Up"}
          </button>

         
        </form>

        <div className="mt-3 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const InputGroup = ({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="w-full">
    <label className="block text-gray-400 text-sm mb-1">{label}</label>
    <div className="flex items-center border border-gray-600 rounded-md px-2 py-1.5 bg-gray-700">
      <span className="text-gray-400 mr-3">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-white focus:outline-none text-sm"
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

const FileInputGroup = ({ icon, label, name, onChange, required = false }) => (
  <div className="w-full">
    <label className="block text-gray-400 text-sm mb-1">{label}</label>
    <div className="flex items-center border border-gray-600 rounded-md px-2 py-1.5 bg-gray-700">
      <span className="text-gray-400 mr-3">{icon}</span>
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        className="text-white text-sm"
        required={required}
      />
    </div>
  </div>
);

export default Signup;
