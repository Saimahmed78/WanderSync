import React, { useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useAuthStore } from '../store/AuthStore';
import { ToggleSwitch } from './ToggleSwitch';

export function AppearanceView() {
  const { theme, toggleTheme } = useAuthStore();
  const [selectedAccent, setSelectedAccent] = useState('indigo');

  const accentColors = [
    { name: 'indigo', label: 'Indigo', color: 'from-indigo-500 to-indigo-600' },
    { name: 'blue', label: 'Blue', color: 'from-blue-500 to-blue-600' },
    { name: 'purple', label: 'Purple', color: 'from-purple-500 to-purple-600' },
    { name: 'pink', label: 'Pink', color: 'from-pink-500 to-pink-600' },
    { name: 'red', label: 'Red', color: 'from-red-500 to-red-600' },
    { name: 'green', label: 'Green', color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Palette className="w-8 h-8 text-indigo-500" />
        <h1 className="text-white text-2xl md:text-3xl font-bold">Appearance</h1>
      </div>

      {/* Theme Selection Card */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <h3 className="text-white text-xl font-semibold mb-4">Theme</h3>
        <p className="text-gray-400 text-sm mb-6">
          Choose your preferred theme for the interface
        </p>

        {/* Theme Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Dark Theme Option */}
          <button
            onClick={() => useAuthStore.getState().setTheme('dark')}
            className={`p-6 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-gray-700/50'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gray-900 rounded-lg">
                <Moon className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <h4 className="text-white font-semibold mb-2">Dark</h4>
            <p className="text-gray-400 text-sm">Easy on the eyes, perfect for night</p>
            {theme === 'dark' && (
              <div className="mt-3 flex items-center justify-center">
                <span className="text-indigo-400 text-xs font-semibold">✓ Active</span>
              </div>
            )}
          </button>

          {/* Light Theme Option */}
          <button
            onClick={() => useAuthStore.getState().setTheme('light')}
            className={`p-6 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'border-indigo-500 bg-gray-700/50'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-white rounded-lg">
                <Sun className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h4 className="text-white font-semibold mb-2">Light</h4>
            <p className="text-gray-400 text-sm">Bright and clean, ideal for daytime</p>
            {theme === 'light' && (
              <div className="mt-3 flex items-center justify-center">
                <span className="text-indigo-400 text-xs font-semibold">✓ Active</span>
              </div>
            )}
          </button>
        </div>

        {/* Theme Toggle Switch */}
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div>
            <p className="text-white font-medium">Quick Toggle</p>
            <p className="text-gray-400 text-sm">Switch between themes instantly</p>
          </div>
          <ToggleSwitch 
            enabled={theme === 'light'} 
            onChange={() => useAuthStore.getState().toggleTheme()}
          />
        </div>
      </div>

      {/* Accent Color Card */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <h3 className="text-white text-xl font-semibold mb-4">Accent Color</h3>
        <p className="text-gray-400 text-sm mb-6">
          Choose an accent color for buttons, links, and highlights
        </p>

        {/* Color Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {accentColors.map((accent) => (
            <button
              key={accent.name}
              onClick={() => setSelectedAccent(accent.name)}
              className={`relative p-4 rounded-lg border-2 transition-all group ${
                selectedAccent === accent.name
                  ? 'border-white'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Color Preview */}
              <div
                className={`w-full h-16 rounded-lg mb-2 bg-gradient-to-br ${accent.color} transition-transform group-hover:scale-105`}
              />
              
              {/* Label */}
              <p className="text-white text-xs font-medium text-center">{accent.label}</p>

              {/* Active Indicator */}
              {selectedAccent === accent.name && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Display Options Card */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <h3 className="text-white text-xl font-semibold mb-4">Display Options</h3>
        
        {/* Compact Mode */}
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg mb-4">
          <div>
            <p className="text-white font-medium">Compact Mode</p>
            <p className="text-gray-400 text-sm">Reduce spacing and padding</p>
          </div>
          <ToggleSwitch enabled={false} onChange={() => {}} />
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
          <div>
            <p className="text-white font-medium">Reduce Motion</p>
            <p className="text-gray-400 text-sm">Minimize animations and transitions</p>
          </div>
          <ToggleSwitch enabled={false} onChange={() => {}} />
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <h3 className="text-white text-xl font-semibold mb-4">Preview</h3>
        
        <div className={`p-6 rounded-lg border border-gray-700 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            This is how your interface will look with the current theme settings.
          </p>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Primary Button
            </button>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}>
              Secondary Button
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4">
        <p className="text-indigo-300 text-sm">
          💡 Your appearance preferences are saved automatically and will be remembered when you log in again.
        </p>
      </div>
    </div>
  );
}