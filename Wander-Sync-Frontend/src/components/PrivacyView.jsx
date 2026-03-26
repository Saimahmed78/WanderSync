import { useState } from 'react';
import { Shield } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';
import CtaButton from "./CtaButton";

export function PrivacyView() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [profileSearchable, setProfileSearchable] = useState(true);
  const [isPublic, setIsPublic] = useState(false);

  const handleSave = () => {
    console.log('Saving privacy settings...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-indigo-600" />
        <h1 className="text-white">Privacy Settings</h1>
      </div>

      {/* Data & Analytics Card */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-white mb-4">Data & Analytics</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-white mb-2">Usage Analytics</div>
            <p className="text-gray-400">
              Help us improve by sharing anonymous usage data and analytics
            </p>
          </div>
          <ToggleSwitch enabled={analyticsEnabled} onChange={setAnalyticsEnabled} />
        </div>
      </div>

      {/* Communications Card */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-white mb-4">Communications</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-white mb-2">Marketing Emails</div>
            <p className="text-gray-400">
              Receive updates about new features, tips, and special offers
            </p>
          </div>
          <ToggleSwitch enabled={marketingEmails} onChange={setMarketingEmails} />
        </div>
      </div>

      {/* Profile Visibility Card */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-white mb-4">Profile Visibility</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-white mb-2">Searchable Profile</div>
            <p className="text-gray-400">
              Allow other users to find your profile in search results
            </p>
          </div>
          <ToggleSwitch enabled={profileSearchable} onChange={setProfileSearchable} />
        </div>
      </div>

      {/* Project Visibility Card */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-white mb-4">Project Visibility</h3>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white">
                {isPublic ? "Public" : "Private"}
              </span>
            </div>
            <p className="text-gray-400">
              {isPublic
                ? "Your projects are visible to everyone"
                : "Your projects are only visible to you and collaborators"}
            </p>
          </div>
          <ToggleSwitch enabled={isPublic} onChange={setIsPublic} />
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
