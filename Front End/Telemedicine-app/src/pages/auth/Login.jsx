import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMPORARY LOGIC (will connect backend later)
    if (role === "patient") navigate("/patient/dashboard");
    if (role === "doctor") navigate("/doctor/dashboard");
    if (role === "admin") navigate("/admin/dashboard");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h3 className="text-center">Telemedicine Login</h3>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              required
            />

            <select
              className="form-control mb-3"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>

            <button className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
