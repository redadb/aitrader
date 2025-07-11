import React from 'react';
import { TrendingUp, Bell, Settings, User } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({ activeSection, setActiveSection }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'signals', label: 'Signals' },
    { id: 'strategies', label: 'Strategies' },
    { id: 'backtesting', label: 'Backtesting' },
    { id: 'ai-analysis', label: 'AI Analysis' },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">CryptoAI Trading</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`transition-colors ${
                activeSection === item.id
                  ? 'text-emerald-400'
                  : 'text-gray-300 hover:text-emerald-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Bell className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
          <Settings className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
          <User className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
        </div>
      </div>
    </header>
  );
}