import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Bell, User } from 'lucide-react';

interface HeaderProps {
  sidebarWidth: number;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ sidebarWidth, title }) => {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 right-0 z-30 flex items-center h-16 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-sm' 
          : 'bg-transparent'
      }`}
      style={{ left: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)` }}
    >
      <div className="flex justify-between items-center w-full px-6">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 relative">
            <Bell size={20} className="text-neutral-600 dark:text-neutral-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-400 rounded-full"></span>
          </button>
          
          {/* User menu */}
          <button className="p-1 rounded-full border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400">
            <User size={20} className="text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>
      </div>
    </header>
  );
};