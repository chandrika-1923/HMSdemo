import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const nav = useNavigate();
  const location = useLocation();
  const roleParam = new URLSearchParams(location.search).get("role") || "";

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      await API.post("/auth/forgot", { email: email.trim() });
      setOtpSent(true);
      setStatus("OTP sent to your email. Enter OTP and new password below.");
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/reset", { email: email.trim(), otp: otp.trim(), newPassword: newPassword.trim() });
      const role = (data?.role || roleParam || "").toLowerCase();
      const target = role === "admin" ? "/admin/login" : role === "doctor" ? "/doctor/login" : "/login";
      nav(target);
    } catch (err) {
      setStatus(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-24">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200">
          <div className="text-center text-indigo-700 font-semibold mb-4">Forgot Password</div>
          <form onSubmit={otpSent ? submitReset : submit}>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {otpSent && (
              <>
                <label className="block text-sm font-medium text-slate-700 mb-1">OTP</label>
                <input
                  className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  placeholder="Enter the 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  className="border border-slate-300 rounded-md p-2 w-full mb-3 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  placeholder="New password (min 6 chars)"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </>
            )}
            {status && <div className="text-slate-700 mb-3 text-sm">{status}</div>}
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-10 rounded-full"
              disabled={loading}
            >
              {loading ? (otpSent ? "Resetting..." : "Sending...") : (otpSent ? "Reset Password" : "Send Reset Instructions")}
            </button>
          </form>
          <div className="mt-3 text-sm text-slate-700">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}