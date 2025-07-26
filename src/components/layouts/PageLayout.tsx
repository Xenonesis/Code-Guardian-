import React, { useState, useEffect } from 'react';
import { Shield, Github, Twitter } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { FeatureGrid } from '@/components/features/FeatureGrid';
import { Footer } from '@/components/Footer';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  benefits?: string[];
}

interface PageLayoutProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  showNavigation?: boolean;
  className?: string;
  features?: Feature[];
  noContainer?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  isDarkMode = false,
  toggleDarkMode,
  showNavigation = true,
  className = '',
  features,
  noContainer = false
}) => {

  return (
    <div className={`min-h-screen gradient-enterprise transition-all duration-700 ${className}`}>
      {/* Ultra-Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 sm:w-[32rem] sm:h-[32rem] bg-gradient-to-r from-blue-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-enterprise"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-gradient-to-r from-emerald-400/15 via-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-float-enterprise" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-orange-400/15 to-red-400/15 rounded-full blur-3xl animate-pulse-enterprise"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-r from-violet-400/12 via-indigo-400/12 to-blue-400/12 rounded-full blur-3xl animate-float-enterprise" style={{animationDelay: '4s'}}></div>
      </div>
      {showNavigation && toggleDarkMode && (
        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      )}

      <main className="relative z-10">
        {noContainer ? (
          children
        ) : (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        )}
      </main>

      {/* Features Section in Footer */}
      {features && features.length > 0 && (
        <section className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-16 lg:py-24">
          <FeatureGrid
            features={features}
            title="Comprehensive Security & Quality Analysis"
            subtitle="Everything you need to secure and optimize your codebase in one powerful platform"
            columns={4}
            variant="modern"
          />
        </section>
      )}

      {/* Enhanced Footer Component */}
      <Footer />
    </div>
  );
};

export default PageLayout;
