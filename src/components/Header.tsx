import React, { useState } from 'react';
import { Mail, User, LogIn, UserPlus, Bell, Settings, LogOut, X } from 'lucide-react';
import PricingModal from './PricingModal';
import NotificationsPanel from './NotificationsPanel';
import SettingsPanel from './SettingsPanel';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Email Automation</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Dashboard
            </a>
            <button 
              onClick={() => setPricingOpen(true)} 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </button>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>

            {/* Settings */}
            <button 
              onClick={() => setSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a
                      href="#login"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </a>
                    <a
                      href="#signup"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </a>
                    <hr className="my-1" />
                    <a
                      href="#logout"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}