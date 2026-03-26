import { Outlet, useNavigate, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import { useEffect, useState, useRef } from "react"; // 1. Import useRef
import { useAuthStore } from "./store/AuthStore.js";

export default function App() {
  const { isAuthenticated, checkAuth, _hasHydrated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isReady, setIsReady] = useState(false);

  // 2. Create a ref to track if we have attempted the initial check
  const hasCheckedAuth = useRef(false);
  console.log("Auth Hydrated:", _hasHydrated, "Authenticated:", isAuthenticated);
  // Define Public Routes...
  const publicRoutes = [
    "/login", "/register", "/forgotPass", "/resetPass", "/google/callback", "/resendVerifyEmail", "changePass",
    "/verify", "/verification-notice", "/"
  ];

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  });

  // 3. THE INITIAL CHECK (Run Once)
  useEffect(() => {
    const initAuth = async () => {
      // Stop if Zustand hasn't loaded OR if we have already checked
      if (!_hasHydrated || hasCheckedAuth.current) return;

      // Mark as checked immediately so subsequent re-renders don't trigger this
      hasCheckedAuth.current = true;

      try {
        if (!isAuthenticated) {
          await checkAuth();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        // MARK APP AS READY
        setIsReady(true);
      }
    };

    initAuth();
  }, [_hasHydrated, isAuthenticated, checkAuth]); // Dependencies added safely now


  // REDIRECT LOGIC...
  useEffect(() => {
    if (!isReady) return;
    if (!isPublicRoute && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isReady, isPublicRoute, isAuthenticated, navigate]);

  // LOADING SCREEN...
  if (!_hasHydrated || !isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}