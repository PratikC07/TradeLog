import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
} from "../../../components/ui/Icons";
import { AuthLayout } from "./AuthLayout";
import { authService } from "../api/authService";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validate = () => {
    const errors: { username?: string; email?: string; password?: string } = {};
    if (!formData.username.trim()) errors.username = "Display Name is required";
    else if (formData.username.length < 3)
      errors.username = "Display Name must be at least 3 chars";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Please enter a valid email address";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name as keyof typeof fieldErrors]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
    }
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setFormError(null);

    try {
      const response = await authService.register(formData);
      localStorage.setItem("access_token", response.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setFormError(
        err.response?.data?.detail ||
          "Registration failed. Please try a different email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your professional trading journey today."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5 md:space-y-6"
        noValidate
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">
            Display Name
          </label>
          <div className="relative group/input">
            <User
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                fieldErrors.username
                  ? "text-red-500"
                  : "text-gray-600 group-focus-within/input:text-neon-green"
              }`}
            />
            <input
              type="text"
              name="username"
              placeholder="Satoshi_Nakamoto"
              value={formData.username}
              onChange={handleChange}
              className={`w-full bg-white/5 border rounded-xl py-3.5 md:py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all text-sm md:text-base font-medium ${
                fieldErrors.username
                  ? "border-red-500/50 focus:border-red-500 focus:bg-red-500/5"
                  : "border-white/10 focus:border-neon-green/40 focus:bg-white/10"
              }`}
            />
          </div>
          {fieldErrors.username && (
            <p className="text-red-500 text-xs ml-1">{fieldErrors.username}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">
            Email
          </label>
          <div className="relative group/input">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                fieldErrors.email
                  ? "text-red-500"
                  : "text-gray-600 group-focus-within/input:text-neon-green"
              }`}
            />
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-white/5 border rounded-xl py-3.5 md:py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all text-sm md:text-base font-medium ${
                fieldErrors.email
                  ? "border-red-500/50 focus:border-red-500 focus:bg-red-500/5"
                  : "border-white/10 focus:border-neon-green/40 focus:bg-white/10"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-500 text-xs ml-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">
            Password
          </label>
          <div className="relative group/input">
            <Lock
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                fieldErrors.password
                  ? "text-red-500"
                  : "text-gray-600 group-focus-within/input:text-neon-green"
              }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-white/5 border rounded-xl py-3.5 md:py-4 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none transition-all text-sm md:text-base font-medium ${
                fieldErrors.password
                  ? "border-red-500/50 focus:border-red-500 focus:bg-red-500/5"
                  : "border-white/10 focus:border-neon-green/40 focus:bg-white/10"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors focus:outline-none flex items-center"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-xs ml-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* ERROR MESSAGE MOVED HERE */}
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 md:py-4 bg-neon-green hover:bg-[#b3e600] text-black font-bold rounded-xl transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2 mt-6 md:mt-8 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base tracking-wide"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 md:mt-8 text-center pt-6 md:pt-8 border-t border-white/10">
        <p className="text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-white font-bold hover:text-neon-green ml-1 transition-colors focus:outline-none"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
