import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { 
  Film, 
  Sparkles, 
  Compass, 
  Sun, 
  Moon, 
  Menu, 
  X 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Film },
    { id: 'analyzer', label: 'Analyzer', icon: Sparkles },
    { id: 'explorer', label: 'Movie Explorer', icon: Compass },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b dark:border-slate-800/80 border-slate-200 dark:bg-slate-950/80 bg-white/90 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleSelectTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
              <div className="w-full h-full dark:bg-slate-950 bg-white rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-purple-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinematic font-black tracking-wider text-xl dark:text-white text-slate-900 group-hover:text-purple-600 dark:group-hover:text-cyan-300 transition-colors">
                  CineSense
                </span>
              </div>
              <p className="text-[10px] dark:text-slate-400 text-slate-600 font-sans tracking-tight hidden md:block">
                Intelligent Movie Sentiment Analyzer
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'dark:bg-gradient-to-r dark:from-purple-900/60 dark:to-cyan-900/60 bg-purple-100 text-purple-900 dark:text-cyan-300 border dark:border-cyan-500/30 border-purple-300 shadow-sm'
                      : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border dark:border-slate-800 border-slate-300 dark:bg-slate-900/80 bg-slate-100 dark:text-slate-400 text-slate-700 hover:text-slate-900 dark:hover:text-white dark:hover:border-slate-700 hover:border-slate-400 transition-colors"
              aria-label="Toggle visual theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg border dark:border-slate-800 border-slate-300 dark:bg-slate-900/80 bg-slate-100 dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950/95 bg-white/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 mb-2 border-b dark:border-slate-900 border-slate-200">
            <span className="text-xs uppercase tracking-wider dark:text-slate-400 text-slate-600 font-mono">Navigation Menu</span>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'dark:bg-purple-950/50 bg-purple-100 dark:text-cyan-300 text-purple-900 border dark:border-cyan-500/40 border-purple-300 font-semibold'
                    : 'dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'dark:text-cyan-400 text-purple-600' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
