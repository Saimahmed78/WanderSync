import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import apiClient from '../../services/apiClient.js';
import { useAuthStore } from '../store/AuthStore'; // To logout after deletion
import toast from 'react-hot-toast';

// --- SUB-COMPONENT: PASSWORD CONFIRMATION MODAL ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading, error }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-red-900/10">
          <h3 className="text-lg font-semibold text-red-500 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Final Security Check
          </h3>
          <button onClick={onClose} disabled={isLoading} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-zinc-300 text-sm">
            To permanently delete your account, please enter your password to confirm this is you.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all"
              placeholder="Enter your password"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(password)}
            disabled={!password || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
export function DangerZoneView() {
  const [confirmText, setConfirmText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout); // Zustand logout action

  // 1. First Check: User typed "DELETE"
  const handleInitialClick = () => {
    if (confirmText === 'DELETE') {
      setIsModalOpen(true);
    }
  };

  // 2. Second Check: User entered Password
  const handleFinalDelete = async (password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call your API Client (Make sure deleteAccount is implemented in ApiClient class)
      await apiClient.deleteAccount(password);
      // Cleanup
      logout(); // Clear global state
      
      navigate('/'); // Redirect to login
      toast.success("Your account has been deleted successfully.");

    } catch (err) {
      // Display the error from backend (e.g., "Incorrect Password")
      setError(err.message || "Failed to delete account");
      toast.error("Account deletion failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-2xl font-bold text-white">Danger Zone</h1>
        </div>

        {/* Delete Account Card */}
        <div className="bg-zinc-900/50 rounded-xl border border-red-900/30 overflow-hidden">
          <div className="p-6 border-b border-red-900/20 bg-red-900/5">
            <h3 className="text-lg font-semibold text-red-500">Delete Account</h3>
            <p className="text-zinc-400 text-sm mt-1">Permanently remove your account and all data.</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex gap-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-red-200 font-medium text-sm">
                  This action is irreversible
                </p>
                <p className="text-red-200/60 text-xs leading-relaxed">
                  Once you delete your account, there is no going back. All of your data, projects, and settings will be permanently removed from our servers immediately.
                </p>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label htmlFor="confirmDelete" className="block text-sm font-medium text-zinc-400 mb-2">
                  To confirm, type <span className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded">DELETE</span> below
                </label>
                <input
                  id="confirmDelete"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                />
              </div>

              <button
                // REMOVED: to="/deleteAccount"
                onClick={handleInitialClick}
                disabled={confirmText !== 'DELETE'}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 flex justify-center ${confirmText === 'DELETE'
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render the Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setError(null); }}
        onConfirm={handleFinalDelete}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}