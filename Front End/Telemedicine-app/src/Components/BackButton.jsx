import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
    >
      ← Logout / Back to Login
    </button>
  );
};

export default BackButton;
