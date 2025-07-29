import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Moon, Sun, Menu, X, Info, Lock, Award, Settings, BookOpen, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount detection and scroll detection for navbar styling
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: <Home className="h-4 w-4" />
    },
    {
      path: '/about',
      label: 'About',
      icon: <Info className="h-4 w-4" />
    },
    {
      path: '/documentation',
      label: 'Documentation',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      path: '/history',
      label: 'History',
      icon: <History className="h-4 w-4" />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />
    },
    {
      path: '/privacy',
      label: 'Privacy',
      icon: <Lock className="h-4 w-4" />
    },
    {
      path: '/terms',
      label: 'Terms',
      icon: <Award className="h-4 w-4" />
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  if (!mounted) return null;

  const navContent = (
    <nav 
      className={cn(
        "portal-navbar transition-all duration-700 nav-enterprise",
        isScrolled
          ? "shadow-enterprise-lg border-b border-slate-200 dark:border-slate-700"
          : "shadow-enterprise border-b border-slate-200 dark:border-slate-700"
      )}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        width: '100%',
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          {/* Code Guardian Logo - Enhanced Responsive Design */}
          <Link
            to="/"
            className="flex items-center gap-2 lg:gap-3 group transition-all duration-300 hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Shield Icon */}
            <div className="relative p-2 lg:p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300">
              <Shield className="h-4 lg:h-5 w-4 lg:w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                CodeGuardian
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block">
                Security Analysis
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced Modern Design */}
          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-1.5 lg:gap-2 px-2.5 md:px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg lg:rounded-xl font-medium transition-all duration-300 text-xs md:text-sm group overflow-hidden",
                  isActive(item.path)
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 shadow-sm ring-1 ring-blue-200/50 dark:ring-blue-800/50"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-sm"
                )}
              >
                <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {item.icon}
                </div>
                <span className="font-medium whitespace-nowrap hidden lg:inline">{item.label}</span>
                <span className="font-medium whitespace-nowrap lg:hidden">{item.label.length > 8 ? item.label.substring(0, 6) + '...' : item.label}</span>
                
                {/* Enhanced Active Indicator */}
                {isActive(item.path) && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    <div className="absolute inset-0 rounded-lg lg:rounded-xl bg-blue-500/5 dark:bg-blue-400/5"></div>
                  </>
                )}
                
                {/* Enhanced Hover Effect */}
                <div className="absolute inset-0 rounded-lg lg:rounded-xl bg-gradient-to-r from-transparent via-slate-100/50 dark:via-slate-700/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-lg lg:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-blue-500/10"></div>
              </Link>
            ))}
          </div>

          {/* Right side actions - Enhanced Responsive Design */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 lg:p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-sm transition-all duration-300 group relative overflow-hidden"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-4 lg:h-5 w-4 lg:w-5 text-amber-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              ) : (
                <Moon className="h-4 lg:h-5 w-4 lg:w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-amber-100/50 dark:via-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 lg:p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-sm transition-all duration-300 md:hidden group relative overflow-hidden"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 lg:h-5 w-4 lg:w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
              ) : (
                <Menu className="h-4 lg:h-5 w-4 lg:w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-all duration-300" />
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-slate-100/50 dark:via-slate-700/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" style={{backgroundColor: isDarkMode ? '#0f172a' : '#ffffff'}}>
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors duration-200",
                    isActive(item.path)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  return createPortal(navContent, document.body);
};

export default Navigation;