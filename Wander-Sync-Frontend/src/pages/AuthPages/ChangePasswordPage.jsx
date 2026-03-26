import { useState } from "react"; // 1. Import useState
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // 2. Import Icons
import apiClient from "../../../services/apiClient";
import { changePassSchema } from "../../schemas/authSchema";
import { useNavigate } from "react-router";
export default function ChangePass() {
  const navigate = useNavigate();

  // 3. States for password visibility
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePassSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.changePass(
        data.oldPass,
        data.newPass,
        data.confirmPass
      );
      console.log("Change Password Response:", response);
      if (response?.success) {
        toast.success("Password reset successfully ✅");
        reset();
        navigate("/login");
      } else {
        toast.error("Something went wrong ❌");
      }
    } catch (error) {
      toast.error(error.message || "Password reset failed ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`bg-[#1e293b] p-8 rounded-2xl shadow-2xl max-w-md w-full flex flex-col gap-4 relative overflow-hidden ${
        isSubmitting
          ? "before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-1 before:bg-gradient-to-r before:from-blue-500 before:via-cyan-400 before:to-yellow-400 before:animate-flow"
          : ""
      }`}
    >
      {/* --- OLD PASSWORD --- */}
      <div>
        <label className="text-gray-200 font-medium text-sm mb-1 block" htmlFor="oldPass">
          Old Password
        </label>
        <div className="relative">
          <input
            type={showOldPass ? "text" : "password"} // Dynamic type
            id="oldPass"
            placeholder="Enter your Old Password"
            {...register("oldPass")}
            className="w-full px-3 py-3 pr-10 rounded-lg bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#1e293b]"
          />
          <button
            type="button" // Important: preventing form submission
            onClick={() => setShowOldPass(!showOldPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
          >
            {showOldPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.oldPass && (
          <p className="text-red-500 text-sm mt-1">{errors.oldPass.message}</p>
        )}
      </div>

      {/* --- NEW PASSWORD --- */}
      <div>
        <label className="text-gray-200 font-medium text-sm mb-1 block" htmlFor="newPass">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPass ? "text" : "password"}
            id="newPass"
            placeholder="Enter your New Password"
            {...register("newPass")}
            className="w-full px-3 py-3 pr-10 rounded-lg bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#1e293b]"
          />
          <button
            type="button"
            onClick={() => setShowNewPass(!showNewPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPass && (
          <p className="text-red-500 text-sm mt-1">{errors.newPass.message}</p>
        )}
      </div>

      {/* --- CONFIRM PASSWORD --- */}
      <div>
        <label className="text-gray-200 font-medium text-sm mb-1 block" htmlFor="confirmPass">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPass ? "text" : "password"}
            id="confirmPass"
            placeholder="Confirm your Password"
            {...register("confirmPass")}
            className="w-full px-3 py-3 pr-10 rounded-lg bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#1e293b]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPass && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPass.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition-transform transform hover:-translate-y-1 disabled:bg-gray-500 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}