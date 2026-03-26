import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../../../services/apiClient";
import { registerSchema } from "../../schemas/authSchema";
import { FcGoogle } from "react-icons/fc"; // Import Google icon

const handleGoogleSignup = () => {
  window.location.href = apiClient.loginwithGoogle();
};

export default function RegisterUser() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.register(
        data.name,
        data.email,
        data.password,
      );
      console.log("Registration Response:", response);
      toast.success(response?.message || "Account Created ✅");
      reset();
      navigate("/verification-notice", {
        state: {
          title: "Account Created! 🚀",
          subtitle:
            "We've sent a verification link to complete your registration.",
        },
      });
      // localStorage.setItem("lastResendTimestamp", Date.now().toString());
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);
    } catch (error) {
      console.error("Registration Error in form:", error);
      
      const backendErrors = error?.errors;
      console.log("Backend Errors:", backendErrors);
      console.log("Backend Errors:", error) ;

      if (backendErrors && backendErrors.length > 0) {
        // Display the first error message in toast
        const firstErrorMsg = backendErrors[0];
        console.log("Registration Error:", firstErrorMsg);
        toast.error(firstErrorMsg);
      } else {
        toast.error("Registration failed. Please try again.");
      }

      if (error?.response?.status === 409) {
        setError("email", { type: "manual", message: "Email already exists" });
      }
    }
  };

  return (<>

    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative flex flex-col gap-4 w-full max-w-md p-8 bg-[#1e293b] rounded-2xl shadow-xl animate-fadeIn overflow-hidden"
    >
    
      {/* --- UPDATED BUTTON --- */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-all hover:-translate-y-1"
      >
        <FcGoogle size={24} />
        <span>Sign up with Google</span>
      </button>

        <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-600"></div>
        <span className="px-3 text-sm text-gray-400">OR</span>
        <div className="flex-grow h-px bg-gray-600"></div>
      </div>

      {/* Top loading line */}
      {isSubmitting && (
        <div className="absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-[#4cafef] via-blue-600 to-[#4cafef] animate-slide z-10" />
      )}

      {/* Name */}
      <label className="text-sm font-medium text-slate-200">Name</label>
      <input
        type="text"
        placeholder="Enter your name"
        {...register("name")}
        className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:border-blue-500 focus:bg-[#1e293b] focus:ring-1 focus:ring-blue-500 transition"
      />
      <p className="text-red-400 text-base mt-[-4px]">
        {errors.name?.message || " "}
      </p>

      {/* Email */}
      <label className="text-sm font-medium text-slate-200">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        {...register("email")}
        className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:border-blue-500 focus:bg-[#1e293b] focus:ring-1 focus:ring-blue-500 transition"
      />
      <p className="text-red-400 text-base mt-[-4px]">
        {errors.email?.message || " "}
      </p>

      {/* Password */}
      <label className="text-sm font-medium text-slate-200">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...register("password")}
          className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-600 bg-slate-800 text-white focus:border-blue-500 focus:bg-[#1e293b] focus:ring-1 focus:ring-blue-500 transition"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <p className="text-red-400 text-base mt-[-4px]">
        {errors.password?.message || " "}
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-500 rounded-lg font-semibold text-white hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:animate-pulse transition"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* Already have account */}
      <p className="text-sm text-slate-300 text-center">
        Already have an account?{" "}
        <Link
          className="text-blue-500 hover:text-blue-600 font-semibold"
          to="/login"
        >
          Login
        </Link>
      </p>
    </form>
  </>
  );
}
