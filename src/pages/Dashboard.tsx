import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { DashboardHome } from '../sections/DashboardHome';
import { SchedulingSection } from '../sections/SchedulingSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { AdCampaignsSection } from '../sections/AdCampaignsSection';
import { NotionTemplatesSection } from '../sections/NotionTemplatesSection';
import { NotionTemplateGenerator } from '../sections/NotionTemplateGenerator';
import { CustomerCRMSection } from '../sections/CustomerCRMSection';
import { SocialMediaSection } from '../sections/SocialMediaSection';
import { EmailMarketingSection } from '../sections/EmailMarketingSection';
import { FinancialTrackerSection } from '../sections/FinancialTrackerSection';
import { IdeaGeneratorSection } from '../sections/IdeaGeneratorSection';
import { SettingsSection } from '../sections/SettingsSection';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default width is 256px
  
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      setActiveSection(event.detail.section);
    };

    window.addEventListener('sectionChange', handleSectionChange as EventListener);
    return () => {
      window.removeEventListener('sectionChange', handleSectionChange as EventListener);
    };
  }, []);

  // Function to render the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome onSectionChange={setActiveSection} />;
      case 'scheduling':
        return <SchedulingSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'ad-campaigns':
        return <AdCampaignsSection />;
      case 'notion-templates':
        return <NotionTemplatesSection />;
      case 'notion-generator':
        return <NotionTemplateGenerator />;
      case 'crm':
        return <CustomerCRMSection />;
      case 'social-media':
        return <SocialMediaSection />;
      case 'email-marketing':
        return <EmailMarketingSection />;
      case 'financials':
        return <FinancialTrackerSection />;
      case 'idea-generator':
        return <IdeaGeneratorSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardHome onSectionChange={setActiveSection} />;
    }
  };

  // Function to get the title for the current section
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'scheduling':
        return 'Scheduling';
      case 'projects':
        return 'Projects';
      case 'ad-campaigns':
        return 'Ad Campaigns';
      case 'notion-templates':
        return 'Notion Templates';
      case 'notion-generator':
        return 'Template Generator';
      case 'crm':
        return 'Contact Management';
      case 'social-media':
        return 'Social Media Manager';
      case 'email-marketing':
        return 'Email Marketing';
      case 'financials':
        return 'Financial Tracker';
      case 'idea-generator':
        return 'Idea Generator';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };
  
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <Sidebar onSectionChange={setActiveSection} activeSection={activeSection} />
      
      <main 
        className="flex-1 ml-64 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Header sidebarWidth={sidebarWidth} title={getSectionTitle()} />
        
        <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;