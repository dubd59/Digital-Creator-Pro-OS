import { ToolCard } from '../components/dashboard/ToolCard';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
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
  ChevronRight,
  CheckCircle,
  Clock,
  PlusCircle
} from 'lucide-react';
import { useState } from 'react';

interface DashboardHomeProps {
  onSectionChange: (section: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onSectionChange }) => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const tools = [
    {
      id: 'scheduling',
      title: 'Scheduling',
      description: 'Manage your calendar and tasks',
      icon: <Calendar size={24} />,
      color: '#38BEBA'
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Organize your creative projects',
      icon: <Briefcase size={24} />,
      color: '#6366F1'
    },
    {
      id: 'ad-campaigns',
      title: 'Ad Campaigns',
      description: 'Create and track ad performance',
      icon: <Megaphone size={24} />,
      color: '#F59E0B'
    },
    {
      id: 'notion-templates',
      title: 'Notion Templates',
      description: 'Generate and customize templates',
      icon: <FileText size={24} />,
      color: '#EC4899'
    },
    {
      id: 'crm',
      title: 'Customer CRM',
      description: 'Manage client relationships',
      icon: <Users size={24} />,
      color: '#8B5CF6'
    },
    {
      id: 'social-media',
      title: 'Social Media',
      description: 'Plan and schedule your content',
      icon: <MessageSquare size={24} />,
      color: '#3B82F6'
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Create compelling email campaigns',
      icon: <Mail size={24} />,
      color: '#10B981'
    },
    {
      id: 'financials',
      title: 'Financial Tracker',
      description: 'Monitor revenue and expenses',
      icon: <BarChart2 size={24} />,
      color: '#64748B'
    },
    {
      id: 'idea-generator',
      title: 'Idea Generator',
      description: 'Get AI-powered creative ideas',
      icon: <Lightbulb size={24} />,
      color: '#F97316'
    }
  ];

  const handleCreateProject = () => {
    onSectionChange('projects');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome section */}
      <section className="bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl p-6 text-white">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Creator!</h1>
          <p className="opacity-90 mb-4">Here's an overview of your creator business and tools.</p>
          <Button 
            variant="outline" 
            className="bg-white/20 hover:bg-white/30 border-white/40 text-white"
            icon={<PlusCircle size={16} />}
            onClick={handleCreateProject}
          >
            Create New Project
          </Button>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Projects"
          value="8"
          change={12}
          icon={<Briefcase size={20} />}
          color="#6366F1"
        />
        <StatsCard
          title="Scheduled Posts"
          value="24"
          change={8}
          icon={<MessageSquare size={20} />}
          color="#3B82F6"
        />
        <StatsCard
          title="Email Subscribers"
          value="2,845"
          change={5}
          icon={<Mail size={20} />}
          color="#10B981"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$4,327"
          change={-3}
          icon={<BarChart2 size={20} />}
          color="#64748B"
        />
      </section>

      {/* Recent activity and upcoming tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex justify-between items-center">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <li key={item} className="flex items-start p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-full mr-3">
                    <CheckCircle size={16} className="text-primary-500 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New project "{['Brand Redesign', 'Q4 Marketing Plan', 'Email Template', 'Social Campaign'][item - 1]}" created</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">2 hours ago</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex justify-between items-center">
              <span>Upcoming Tasks</span>
              <Button variant="ghost" size="sm" className="text-xs">View Calendar</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <li key={item} className="flex items-start p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-full mr-3">
                    <Clock size={16} className="text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{['Client Meeting', 'Content Review', 'Newsletter Draft', 'Social Media Posts'][item - 1]}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300">
                        {['Today', 'Tomorrow', 'In 2 days', 'In 3 days'][item - 1]}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {['10:00 AM', '2:30 PM', '11:00 AM', '4:00 PM'][item - 1]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Tools Grid */}
      <section>
        <h2 className="text-xl font-bold mb-4">Creator Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              onClick={() => onSectionChange(tool.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};