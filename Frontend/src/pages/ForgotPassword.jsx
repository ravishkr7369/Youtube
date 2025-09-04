import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Reset link sent to your email!");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
