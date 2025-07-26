import React, { Suspense } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useDarkMode } from '@/hooks/useDarkMode';

// Lazy load the AI Key Manager
const AIKeyManager = React.lazy(() => import('@/components/AIKeyManager').then(module => ({ default: module.AIKeyManager })));

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <PageLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your Code Guardian preferences and AI integrations
          </p>
        </div>

        <div className="space-y-8">
          {/* AI Configuration Section */}
          <section>
            <Suspense fallback={
              <div className="flex justify-center p-8" role="status" aria-label="Loading AI configuration">
                <LoadingSpinner size="lg" text="Loading AI Configuration..." />
              </div>
            }>
              <AIKeyManager />
            </Suspense>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;