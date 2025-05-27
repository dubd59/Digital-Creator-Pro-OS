import { useState } from 'react';
import { Link } from '../ui/Link';
import { useTheme } from '../../context/ThemeContext';
import { 
  Calendar, 
  Briefcase, 
  Megaphone, 
  FileText, 
  Users, 
  MessageSquare, 
  Mail, 
  BarChart2, 
  Lightbulb, 
  Settings,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, id, isActive, onClick }) => {
  return (
    <button
      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
        isActive 
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300' 
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
      }`}
      onClick={() => onClick(id)}
    >
      <span className={`mr-3 ${isActive ? 'text-primary-400' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-primary-400'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-6 bg-primary-400 rounded-full"></span>
      )}
    </button>
  );
};

interface SidebarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSectionChange, activeSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Calendar size={20} /> },
    { id: 'scheduling', label: 'Scheduling', icon: <Calendar size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { id: 'ad-campaigns', label: 'Ad Campaigns', icon: <Megaphone size={20} /> },
    { id: 'notion-templates', label: 'Notion Templates', icon: <FileText size={20} /> },
    { id: 'crm', label: 'Contact Management', icon: <Users size={20} /> },
    { id: 'social-media', label: 'Social Media', icon: <MessageSquare size={20} /> },
    { id: 'email-marketing', label: 'Email Marketing', icon: <Mail size={20} /> },
    { id: 'financials', label: 'Financial Tracker', icon: <BarChart2 size={20} /> },
    { id: 'idea-generator', label: 'Idea Generator', icon: <Lightbulb size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-700">
            {!isCollapsed && (
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Digital Creator Pro"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <h1 className="ml-2 text-lg font-bold text-neutral-900 dark:text-white">Digital Creator Pro</h1>
              </div>
            )}
            {isCollapsed && (
              <div className="mx-auto">
                <img 
                  src="https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Digital Creator Pro"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
            )}
            <button 
              className="hidden md:block text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.id}>
                  {isCollapsed ? (
                    <button
                      className={`flex justify-center p-3 rounded-lg transition-all duration-200 ${
                        activeSection === item.id 
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-400' 
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                      }`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      {item.icon}
                    </button>
                  ) : (
                    <NavItem
                      icon={item.icon}
                      label={item.label}
                      id={item.id}
                      isActive={activeSection === item.id}
                      onClick={handleNavClick}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme toggle and user */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            {isCollapsed ? (
              <button
                onClick={toggleTheme}
                className="w-full flex justify-center p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">John Doe</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Pro Plan</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};