import { User, Lock, Shield, AlertTriangle, Palette } from "lucide-react";

export function Sidebar({ activeView, setActiveView }) {
  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Lock },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6">
        <h2 className="text-white text-xl font-semibold">Settings</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Danger Zone button, visually separated */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setActiveView("danger")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
            activeView === "danger"
              ? "bg-red-700 text-white shadow-lg"
              : "text-red-400 hover:bg-red-900/30"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Danger Zone</span>
        </button>
      </div>
    </aside>
  );
}