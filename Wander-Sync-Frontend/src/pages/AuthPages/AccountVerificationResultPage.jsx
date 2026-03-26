import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import Confetti from "react-confetti";
import apiClient from "../../../services/apiClient";

export default function AccountVerificationResultPage() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useParams();
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const verifiedTokens = useRef(new Set());

  useEffect(() => {
    // Prevent running if already ran or no token
    if (verifiedTokens.current.has(token) || !token) return;
    verifiedTokens.current.add(token);

    const verify = async () => {
      setLoading(true);
      try {
        const response = await apiClient.verify(token);
        if (response?.success) {
          setVerified(true);
          setSuccessMessage(
            response.data || "Your account has been verified successfully 🎉"
          );
        }
        // Handle failed verification from server
        else {
          setErrorMessage(
            response?.message || response?.data || "Something went wrong from the server ❌"
          );
          setVerified(false);
        }
      } catch (error) {
        // Handle API error response with status code
        if (error?.response?.data) {
          const errorData = error.response.data;
          setErrorMessage(
            errorData.message || errorData.data || "Verification failed ❌"
          );
        }
        // Handle network or other errors
        else {
          setErrorMessage(error.message || "Verification failed ❌");
        }
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] font-inter px-5">
      {verified && <Confetti recycle={false} numberOfPieces={2400} />}
      <div className="bg-[#1e293b] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        {loading ? (
          <>
            <div className="w-12 h-12 border-4 border-white border-t-pink-500 rounded-full mx-auto animate-spin mb-4"></div>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-2">Verifying your account...</h2>
            <p className="text-gray-300">Please wait while we confirm your details.</p>
          </>
        ) : verified ? (
          <>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-2">✅ Account Verified!</h2>
            <p className="text-green-500 font-bold text-lg mb-4 animate-fadeIn">{successMessage}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-3 rounded-lg shadow transition-transform transform hover:-translate-y-1"
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-2">❌ Verification Failed</h2>
            <p className="text-red-500 font-bold text-lg mb-4 animate-fadeIn">{errorMessage}</p>
            <button
              onClick={() => navigate("/resendVerifyEmail")}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-3 rounded-lg shadow transition-transform transform hover:-translate-y-1"
            >
              Resend Verification Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}