import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import OpenInboxButton from "../../components/OpenInboxButton.jsx";
import toast from "react-hot-toast";
import { useLocation } from "react-router";

export default function EmailVerificationNoticePage() {
  console.log("Email Verification Notice Page Rendered");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const COOLDOWN = 60;

  const pageTitle = useLocation().state?.title || "Verify Your Email Address";

  const pageSubtitle =
    useLocation().state?.subtitle ||
    "Please confirm your email to activate your account.";

  useEffect(() => {
    const lastClick = localStorage.getItem("lastResendTimestamp");
    if (lastClick) {
      const now = Date.now();
      const elapsed = Math.floor((now - parseInt(lastClick, 10)) / 1000);
      if (elapsed < COOLDOWN) {
        setCooldown(COOLDOWN - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) {
      toast.error(`You requested recently! Please wait ${cooldown}s ⏳`);
      return;
    }
    navigate("/resendVerifyEmail");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f172a] px-5 font-inter animate-fadeIn">
      <div className="bg-[#1e293b] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Dynamic Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-500 mb-2">
          {pageTitle}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="text-gray-300 mb-6">{pageSubtitle}</p>

        <OpenInboxButton email={email} />

        <p className="text-gray-400 mt-4">
          If you don't see the email, check your spam or junk folder. It might
          be hiding there!
        </p>
        <p className="text-gray-400">
          Didn’t get the email? No problem—it happens.
        </p>

        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className={`mt-6 px-6 py-3 rounded-lg font-semibold text-white shadow transition-transform transform hover:-translate-y-1 
            ${
              cooldown > 0
                ? "bg-gray-500 cursor-not-allowed animate-pulse"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {cooldown > 0
            ? `Please wait ${cooldown}s...`
            : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
}
