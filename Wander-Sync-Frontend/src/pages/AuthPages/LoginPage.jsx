import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router"; 
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; 
import { loginSchema } from "../../schemas/authSchema";
import { useAuthStore } from "../../store/AuthStore.js";
import apiClient from "../../../services/apiClient.js"; // <--- Make sure this path is correct!

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login: storeLogin } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // --- YOUR REQUESTED SEPARATE HANDLER ---Q
const [isGoogleLoading, setIsGoogleLoading] = useState(false);

const handleGoogleLogin = () => {
  setIsGoogleLoading(true);
  window.location.href = apiClient.loginwithGoogle();
};

// In your JSX:
<button
  type="button" 
  onClick={handleGoogleLogin} 
  disabled={isGoogleLoading}
  className="..."
>
  <FcGoogle size={24} />
  <span>{isGoogleLoading ? "Redirecting..." : "Sign in with Google"}</span>
</button>

  const onSubmit = async (data) => {
    try {
      await storeLogin(data.email, data.password);
      reset();
      navigate("/dashboard");
    } catch (error) {
      const msg = error?.message || "Login failed.";
      toast.error(msg);

      if (error.message === "AccountNotVerified") {
        const email = error.response?.data?.email || data.email;
        localStorage.setItem("email", email);
        navigate("/verification-notice", {
          state: {
            title: "Verification Required ⚠️",
            subtitle: "You cannot log in until you verify your email address.",
          },
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-[#1e293b] rounded-2xl shadow-xl animate-fadeIn overflow-hidden">
      {isSubmitting && (
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#4cafef] via-blue-600 to-[#4cafef] animate-slide z-10" />
      )}

      <h2 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* ... (Email and Password inputs remain the same) ... */}
        
        {/* Email */}
        <div>
          <label className="text-gray-300 font-medium text-sm mb-1 block" htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} placeholder="Enter your email" 
            className="w-full px-4 py-3 rounded-lg border border-gray-500 bg-[#334155] text-white outline-none focus:border-blue-500" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-300 font-medium text-sm mb-1 block" htmlFor="password">Password</label>
          <div className="relative flex items-center">
            <input type={showPassword ? "text" : "password"} id="password" {...register("password")} placeholder="Enter your password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-500 bg-[#334155] text-white outline-none pr-10 focus:border-blue-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400 hover:text-gray-100">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex justify-end text-sm text-gray-300">
          <Link to="/forgotPass" className="text-blue-500 hover:text-blue-600">Forgot Password?</Link>
        </div>

        <button type="submit" disabled={isSubmitting} 
          className={`mt-2 w-full px-6 py-3 rounded-lg font-semibold text-white shadow transition-all 
          ${isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-600"></div>
        <span className="px-3 text-sm text-gray-400">OR</span>
        <div className="flex-grow h-px bg-gray-600"></div>
      </div>

      {/* --- UPDATED BUTTON --- */}
      <button
        type="button" 
        onClick={handleGoogleLogin} 
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-all hover:-translate-y-1"
      >
        <FcGoogle size={24} />
        <span>Sign in with Google</span>
      </button>

      <p className="mt-6 text-gray-300 text-sm text-center">
        Don’t have an account? <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold">Sign up</Link>
      </p>
    </div>
  );
}