import React, { useState, useEffect } from 'react';
import { Lock, Monitor, Smartphone, Tablet, LogOut, Loader2 } from 'lucide-react';
import CtaButton from "./CtaButton";
import { ToggleSwitch } from './ToggleSwitch';
import apiClient from '../../services/apiClient';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/AuthStore';

export function SecurityView() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const navigate = useNavigate();
  const { logout: storeLogout } = useAuthStore();

  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getSessions();
      const activeSessions= data.data 
      if (activeSessions.active) {
        console.log("Active Sessions",activeSessions)
        setSessions(data.data.active);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      await apiClient.revokeSession(sessionId);
    } catch (error) {
      console.error("Error revoking session:", error);
      fetchSessions();
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Are you sure you want to log out of all other devices?")) return;
    try {
      await apiClient.revokeAllSessions();
      await storeLogout();
      fetchSessions();
      navigate("/");
    } catch (error) {
      console.error("Error logging out all devices:", error);
    }
  };

  const getDeviceIcon = (type) => {
    const safeType = type ? type.toLowerCase() : 'desktop';
    switch (safeType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-indigo-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-indigo-400" />;
      default:
        return <Monitor className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-10 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Lock className="w-8 h-8 text-indigo-500" />
        <h1 className="text-white text-2xl md:text-3xl font-bold">Security & Sessions</h1>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <h3 className="text-white text-xl font-semibold mb-4">Two-Factor Authentication (MFA)</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-gray-400 text-sm">
              Add an extra layer of security to your account by enabling two-factor authentication (recommended).
            </p>
          </div>
          <ToggleSwitch enabled={twoFactorEnabled} onChange={setTwoFactorEnabled} />
        </div>
      </div>

      {/* Active Sessions List - Responsive Implementation */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-xl font-semibold">Active Sessions</h3>
          {isLoading && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
        </div>
        
        <p className="text-gray-400 text-sm mb-6">
          Review the devices currently logged into your ProjectFlow account.
        </p>

        <div className="rounded-lg ring-1 ring-gray-700 overflow-hidden">
          {/* ADDED: 
             1. max-h-[350px]: Approximate height for 5 rows (Desktop) 
             2. overflow-y-auto: Enables scrolling
             3. scrollbar styling: For a cleaner look
          */}
          <div className="overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <table className="w-full divide-y divide-gray-700 relative">
              {/* UPDATED THEAD: 
                 1. sticky top-0: Keeps header fixed
                 2. bg-gray-800: Solid background prevents content bleed-through
                 3. z-10: Ensures header stays on top of scrolling content
              */}
              <thead className="hidden md:table-header-group bg-gray-800 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Device</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm">Last Activity</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {!isLoading && sessions.length === 0 && (
                  <tr className="block md:table-row">
                    <td colSpan="4" className="py-8 px-4 text-center text-gray-500 block md:table-cell">
                      No active sessions found.
                    </td>
                  </tr>
                )}
                
                {sessions.map((session) => (
                  <tr
                    key={session.id || session._id} 
                    className={`
                      flex flex-col md:table-row 
                      p-4 md:p-0 
                      ${session.isCurrent ? 'bg-indigo-900/10' : 'hover:bg-gray-700/50 transition-colors'}
                    `}
                  >
                    {/* Device Info */}
                    <td className="md:py-4 md:px-4 block md:table-cell mb-3 md:mb-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-700/50 rounded-lg md:bg-transparent md:p-0">
                          {getDeviceIcon(session.deviceType)}
                        </div>
                        <div>
                          <div className={session.isCurrent ? 'text-indigo-400 font-semibold' : 'text-white font-medium'}>
                            {session?.browserName || 'Unknown Device'} on {session?.osName?.toLowerCase() || 'Unknown Device'}
                          </div>
                          {session.isCurrent && <span className="text-xs text-indigo-300 block">Current Session</span>}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="md:py-4 md:px-4 text-gray-400 text-sm block md:table-cell mb-2 md:mb-0 pl-[3.25rem] md:pl-4">
                      <div className="flex justify-between md:block w-full">
                          <span className="md:hidden text-gray-500 font-medium text-xs uppercase tracking-wider">Location</span>
                          <span>{session.location || 'Unknown Location'}</span>
                      </div>
                    </td>

                    {/* Last Activity */}
                    <td className="md:py-4 md:px-4 text-gray-400 text-sm block md:table-cell mb-4 md:mb-0 pl-[3.25rem] md:pl-4">
                      <div className="flex justify-between md:block w-full">
                          <span className="md:hidden text-gray-500 font-medium text-xs uppercase tracking-wider">Last Active</span>
                          <span>
                              {session.lastActiveAt
                              ? formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })
                              : 'now'}
                          </span>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="md:py-4 md:px-4 text-right block md:table-cell">
                        <button 
                            onClick={() => handleRevokeSession(session.id || session._id)}
                            disabled={session.isCurrent} 
                            className={`w-full md:w-auto inline-flex justify-center items-center gap-2 px-3 py-2 md:py-1.5 text-sm font-medium rounded-lg transition-colors border border-transparent 
                              ${session.isCurrent 
                                  ? 'text-gray-600 cursor-not-allowed bg-gray-800 md:bg-transparent' 
                                  : 'text-red-400 bg-red-400/10 hover:bg-red-400/20 md:bg-transparent md:hover:bg-red-400/10'
                              }`}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Revoke</span>
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-white mb-4">Password</h3>
        <CtaButton to="/changePass">Change Password</CtaButton>
      </div>

      {/* Emergency Logout */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <h3 className="text-white text-xl font-semibold mb-4">Emergency Logout</h3>
        <p className="text-gray-400 mb-6 text-sm">
          If you suspect unauthorized access, click the button below to immediately log out of all active sessions (except your current one).
        </p>

        <button
          onClick={handleLogoutAll}
          className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg transform hover:scale-[1.01]"
        >
          Logout of All Devices
        </button>
      </div>
    </div>
  );
}