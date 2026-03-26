import { DangerZoneView } from "../components/DangerZoneView";
import { PrivacyView } from "../components/PrivacyView";
import { AppearanceView } from "../components/AppearenceSettings";
import ProfileSettings from "../components/ProfileView";
import { SecurityView } from "../components/SecurityView";
import { Sidebar } from "../components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/AuthStore";

export default function DashboardApp() {
  const navigate = useNavigate();
  const { user, logout: storeLogout } = useAuthStore();

  const [activeView, setActiveView] = useState("profile");

  // New State for Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await storeLogout();
    navigate("/");
  };

  // Helper to close mobile menu when a link is clicked
  const handleSidebarClick = (viewName) => {
    setActiveView(viewName);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceView />;
      case 'security':
        return <SecurityView />;
      case 'privacy':
        return <PrivacyView />;
      case 'danger':
        return <DangerZoneView />;
      default:
        // Default to profile view if state is unexpected
        return <ProfileView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">

      {/* =========================================
          DESKTOP SIDEBAR 
          (Hidden on mobile, Visible & Normal on Desktop)
      ========================================= */}
      <div className="hidden md:flex h-full border-r border-gray-800">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* =========================================
          MOBILE SIDEBAR (DRAWER)
          (Only visible when isMobileMenuOpen is true)
      ========================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop (Click to close) */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar Content Container */}
          <div className="relative flex w-64 flex-col bg-gray-900 h-full shadow-2xl border-r border-gray-800">
            {/* Close Button (Top Right of Drawer) */}
            <div className="flex justify-end p-4">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* The Sidebar Component reused for Mobile */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar activeView={activeView} setActiveView={handleSidebarClick} />
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto py-6 md:py-8">

            {/* Header Area */}
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="flex items-center gap-3">

                {/* HAMBURGER BUTTON (Visible ONLY on Mobile) */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                </button>

                <h1 className="text-2xl md:text-3xl font-bold text-blue-400">
                  Welcome, {user?.name || "User"}!
                </h1>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.03] font-semibold text-sm md:text-base"
              >
                Logout
              </button>
            </div>

            {/* View Content */}
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}