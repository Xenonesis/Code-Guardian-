import React from 'react';
import { ModernAboutLayout } from '@/components/layouts/ModernAboutLayout';
import { ModernHeroSection } from '@/components/pages/about/redesigned/ModernHeroSection';
import { InteractiveStatsSection } from '@/components/pages/about/redesigned/InteractiveStatsSection';
import { FeatureShowcaseSection } from '@/components/pages/about/redesigned/FeatureShowcaseSection';
import { TechStackSection } from '@/components/pages/about/redesigned/TechStackSection';
import { ProcessFlowSection } from '@/components/pages/about/redesigned/ProcessFlowSection';
import { TeamShowcaseSection } from '@/components/pages/about/redesigned/TeamShowcaseSection';
import { ToolsEcosystemSection } from '@/components/pages/about/redesigned/ToolsEcosystemSection';
import { ModernCallToActionSection } from '@/components/pages/about/redesigned/ModernCallToActionSection';
import { useDarkMode } from '@/hooks/useDarkMode';

const AboutRedesigned = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ModernAboutLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
      {/* Hero Section with Modern Design */}
      <ModernHeroSection />
      
      {/* Interactive Statistics */}
      <InteractiveStatsSection />
      
      {/* Feature Showcase with Cards */}
      <FeatureShowcaseSection />
      
      {/* Tech Stack & Version Info */}
      <TechStackSection />
      
      {/* How It Works Process Flow */}
      <ProcessFlowSection />
      
      {/* Team Showcase */}
      <TeamShowcaseSection />
      
      {/* Tools Ecosystem */}
      <ToolsEcosystemSection />
      
      {/* Modern Call to Action */}
      <ModernCallToActionSection />
    </ModernAboutLayout>
  );
};

export default AboutRedesigned;