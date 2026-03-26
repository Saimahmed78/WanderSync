import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { CtaButton } from "./CtaButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop and Mobile Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/50 bg-[#020617]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                WanderSync
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-400 hover:text-indigo-400 font-medium transition"
              >
                Features
              </a>
              <a
                href="#comparison"
                className="text-slate-400 hover:text-indigo-400 font-medium transition"
              >
                The Difference
              </a>
              <a
                href="#about"
                className="text-slate-400 hover:text-indigo-400 font-medium transition"
              >
                About Us
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <CtaButton 
                to="/login" 
                className="px-5 py-2 font-semibold text-slate-300 hover:text-white transition"
              >
                Log In
              </CtaButton>
              <CtaButton 
                to="/register" 
                className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 hover:scale-105 transition-all"
              >
                Start Planning
              </CtaButton>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#020617] z-[60] md:hidden overflow-y-auto">
          <div className="min-h-screen flex flex-col">
            {/* Header with Logo and Close Button */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                  WanderSync
                </span>
              </div>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Primary Navigation - Dark Mode Vertical Buttons */}
            <div className="p-6 space-y-4">
              <a
                href="#features"
                className="block w-full py-5 bg-slate-900 border border-slate-800 text-white text-lg font-bold text-center rounded-2xl hover:bg-slate-800 transition"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="#comparison"
                className="block w-full py-5 bg-slate-900 border border-slate-800 text-white text-lg font-bold text-center rounded-2xl hover:bg-slate-800 transition"
                onClick={toggleMenu}
              >
                The Difference
              </a>
              <a
                href="#about"
                className="block w-full py-5 bg-slate-900 border border-slate-800 text-white text-lg font-bold text-center rounded-2xl hover:bg-slate-800 transition"
                onClick={toggleMenu}
              >
                About Us
              </a>
            </div>

            {/* Authentication CTAs - Horizontal Spaced */}
            <div className="px-6 pb-8 mt-auto">
              <div className="flex gap-4">
                <CtaButton
                  to="/login"
                  className="flex-1 px-4 py-5 bg-transparent text-white text-lg font-bold rounded-2xl border-2 border-slate-700 hover:bg-slate-800 transition text-center"
                >
                  Log In
                </CtaButton>
                <CtaButton
                  to="/register"
                  className="flex-1 px-4 py-5 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-500 transition text-center shadow-xl shadow-indigo-900/40"
                >
                  Sign Up
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Navbar };