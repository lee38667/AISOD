'use client';

import React, { useState } from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, children }) => {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      priceDropAlerts: true,
      weeklyReports: true,
    },
    preferences: {
      currency: 'NAD',
      theme: 'dark',
      defaultPriority: 'medium',
      autoSave: true,
    },
    marketplace: {
      preferredSource: 'aliexpress',
      maxSearchResults: 20,
    }
  });

  const handleToggle = (category: keyof typeof settings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]]
      }
    }));
  };

  const handleSelect = (category: keyof typeof settings, setting: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleExportData = () => {
    // Mock export functionality
    const dataBlob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spenda-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Reset to default settings
      setSettings({
        notifications: {
          emailNotifications: true,
          pushNotifications: false,
          priceDropAlerts: true,
          weeklyReports: true,
        },
        preferences: {
          currency: 'NAD',
          theme: 'dark',
          defaultPriority: 'medium',
          autoSave: true,
        },
        marketplace: {
          preferredSource: 'aliexpress',
          maxSearchResults: 20,
        }
      });
      alert('All data has been cleared and reset to defaults.');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      alert('Account deletion is not implemented in this demo.');
    }
  };

  const handleSaveChanges = () => {
    // Mock save functionality
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-[Orbitron] bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Customize your Spenda experience</p>
      </div>

      {/* Notifications */}
      <SettingsSection
        title="Notifications"
        description="Manage how you receive updates and alerts"
      >
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-gray-400 text-sm">
                  {key === 'emailNotifications' && 'Receive email updates about your items'}
                  {key === 'pushNotifications' && 'Get browser notifications for important updates'}
                  {key === 'priceDropAlerts' && 'Alert when tracked item prices decrease'}
                  {key === 'weeklyReports' && 'Weekly summary of your spending and progress'}
                </p>
              </div>
              <button
                onClick={() => handleToggle('notifications', key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-[var(--neon-blue)]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection
        title="General Preferences"
        description="Customize your default settings and preferences"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <select
              value={settings.preferences.currency}
              onChange={(e) => handleSelect('preferences', 'currency', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200"
            >
              <option value="NAD">NAD (N$)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Default Priority</label>
            <select
              value={settings.preferences.defaultPriority}
              onChange={(e) => handleSelect('preferences', 'defaultPriority', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="col-span-full">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Auto-save changes</h4>
                <p className="text-gray-400 text-sm">Automatically save changes as you make them</p>
              </div>
              <button
                onClick={() => handleToggle('preferences', 'autoSave')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.preferences.autoSave ? 'bg-[var(--neon-blue)]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Marketplace Settings */}
      <SettingsSection
        title="Marketplace Settings"
        description="Configure search and marketplace preferences"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Source</label>
              <select
                value={settings.marketplace.preferredSource}
                onChange={(e) => handleSelect('marketplace', 'preferredSource', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200"
              >
                <option value="aliexpress">AliExpress</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Search Results</label>
              <select
                value={settings.marketplace.maxSearchResults}
                onChange={(e) => handleSelect('marketplace', 'maxSearchResults', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200"
              >
                <option value={10}>10 results</option>
                <option value={20}>20 results</option>
                <option value={50}>50 results</option>
                <option value={100}>100 results</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">
                Spenda is currently integrated with AliExpress to provide you with the best deals on products from around the world, with prices automatically converted to Namibian Dollars (NAD).
              </p>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Data Management */}
      <SettingsSection
        title="Data Management"
        description="Manage your data and privacy settings"
      >
        <div className="space-y-4">
          <button 
            onClick={handleExportData}
            className="w-full md:w-auto px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-200"
          >
            Export Data
          </button>
          <button 
            onClick={handleClearData}
            className="w-full md:w-auto px-6 py-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg text-yellow-400 hover:bg-yellow-600/30 transition-all duration-200"
          >
            Clear All Data
          </button>
          <button 
            onClick={handleDeleteAccount}
            className="w-full md:w-auto px-6 py-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all duration-200"
          >
            Delete Account
          </button>
        </div>
      </SettingsSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveChanges}
          className="px-8 py-3 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-[var(--neon-blue)]/25 transition-all duration-300"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
