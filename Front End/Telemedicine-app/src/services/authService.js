import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border p-6 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <input
          type="text"
          placeholder="Email"
          className="border p-2 rounded w-full mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full mb-4"
        />

        {/* Dummy Role Buttons */}
        <button
          className="bg-blue-500 text-white w-full p-2 rounded mb-2"
          onClick={() => navigate("/patient")}
        >
          Login as Patient
        </button>

        <button
          className="bg-green-500 text-white w-full p-2 rounded mb-2"
          onClick={() => navigate("/doctor")}
        >
          Login as Doctor
        </button>

        <button
          className="bg-purple-500 text-white w-full p-2 rounded"
          onClick={() => navigate("/admin")}
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
};

export default Login;
