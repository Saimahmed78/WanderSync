import React from 'react';

export function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      // Toggles the state by calling onChange with the opposite of the current state
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        enabled ? 'bg-green-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          // Moves the circle based on the 'enabled' state
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}