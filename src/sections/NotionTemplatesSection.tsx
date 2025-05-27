import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Plus,
  Sparkles,
  Copy,
  CheckCircle,
  Tag,
  ArrowRight,
  X,
  Trash2
} from 'lucide-react';

interface Template {
  id: number;
  title: string;
  description: string;
  category: string[];
  downloads: number;
  image: string;
  isNew: boolean;
  isPremium: boolean;
  content?: string;
}

export const NotionTemplatesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'productivity' | 'content' | 'business' | 'personal'>('all');
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('notionTemplates') || '[]');
    setTemplates([...mockTemplates, ...savedTemplates]);
  }, []);

  const mockTemplates: Template[] = [
    {
      id: 1,
      title: 'Content Calendar',
      description: 'Organize all your content planning, scheduling, and tracking in one place.',
      category: ['content', 'productivity'],
      downloads: 3245,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
      isNew: false,
      isPremium: false,
      content: `Content Calendar Template

Overview
--------
A comprehensive content planning and tracking system for creators.

Features
--------
- Content pipeline tracking
- Publishing schedule
- Performance metrics
- Team collaboration tools

Database Structure
-----------------
Title: Content piece title
Status: Draft, In Review, Scheduled, Published
Due Date: Publication date
Platform: Where content will be published
Assigned To: Team member responsible
Notes: Additional information

Views
-----
1. Calendar View
   - See all content by publication date
   - Color-coded by status
   - Quick-add new content

2. Pipeline View
   - Kanban board style
   - Drag and drop between status columns
   - Progress tracking

3. Analytics Dashboard
   - Content performance metrics
   - Publishing consistency
   - Platform breakdown`
    },
    {
      id: 2,
      title: 'Client Project Tracker',
      description: 'Manage all your client projects with deadlines, deliverables, and payment tracking.',
      category: ['business', 'productivity'],
      downloads: 2187,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
      isNew: false,
      isPremium: true,
      content: `Client Project Tracker Template

Overview
--------
A comprehensive project management system for client work.

Features
--------
- Project timeline tracking
- Deliverables management
- Payment tracking
- Client communication log

Database Structure
-----------------
Project Name: Client project name
Client: Client details
Status: Active, On Hold, Completed
Start Date: Project start date
Due Date: Project deadline
Budget: Project budget
Paid: Amount paid to date
Deliverables: List of project deliverables
Notes: Project notes and updates

Views
-----
1. Project Overview
   - All active projects
   - Upcoming deadlines
   - Payment status

2. Client Dashboard
   - Client-specific view
   - Project history
   - Communication log

3. Financial Overview
   - Project budgets
   - Payment tracking
   - Revenue forecasting`
    },
    {
      id: 3,
      title: 'YouTube Video Planner',
      description: 'Plan, script, and track performance of your YouTube videos.',
      category: ['content'],
      downloads: 1876,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
      isNew: true,
      isPremium: false,
      content: `YouTube Video Planner Template

Overview
--------
Complete YouTube content planning and performance tracking system.

Features
--------
- Video idea bank
- Content calendar
- Script writing
- Performance analytics

Database Structure
-----------------
Video Title: Title of the video
Status: Idea, Scripting, Filming, Editing, Published
Publish Date: Scheduled publication date
Duration: Estimated video length
Category: Video category/topic
Tags: SEO tags
Script: Video script/outline
Thumbnail: Thumbnail ideas
Equipment: Required filming equipment

Views
-----
1. Content Calendar
   - Upcoming videos
   - Publishing schedule
   - Content pipeline

2. Performance Tracker
   - View counts
   - Engagement metrics
   - Revenue tracking

3. Resource Library
   - B-roll footage
   - Music tracks
   - Template elements`
    },
    {
      id: 4,
      title: 'Productivity Dashboard',
      description: 'Track goals, habits, and daily tasks in one comprehensive dashboard.',
      category: ['productivity', 'personal'],
      downloads: 4532,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
      isNew: false,
      isPremium: false,
      content: `Productivity Dashboard Template

Overview
--------
All-in-one productivity tracking and task management system.

Features
--------
- Goal tracking
- Habit monitoring
- Task management
- Time tracking

Database Structure
-----------------
Tasks: Daily to-dos
Goals: Long-term objectives
Habits: Daily habits to track
Projects: Current projects
Time Blocks: Schedule management
Notes: Quick capture area

Views
-----
1. Daily Dashboard
   - Today's tasks
   - Habit tracker
   - Time blocks
   - Quick notes

2. Weekly Review
   - Goal progress
   - Habit consistency
   - Time analysis

3. Monthly Overview
   - Project status
   - Goal milestones
   - Productivity metrics`
    },
    {
      id: 5,
      title: 'Income Tracker',
      description: 'Track multiple income streams, expenses, and taxes for creators.',
      category: ['business', 'personal'],
      downloads: 2911,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
      isNew: true,
      isPremium: true,
      content: `Income Tracker Template

Overview
--------
Comprehensive financial tracking system for multiple income streams.

Features
--------
- Income tracking
- Expense management
- Tax calculation
- Financial reporting

Database Structure
-----------------
Income: Revenue entries
Source: Income source
Category: Income type
Date: Transaction date
Amount: Income amount
Expenses: Business expenses
Tax Rate: Applicable tax rate
Notes: Transaction notes

Views
-----
1. Income Dashboard
   - Monthly revenue
   - Income by source
   - Year-to-date totals

2. Expense Tracker
   - Monthly expenses
   - Category breakdown
   - Budget vs. actual

3. Tax Planning
   - Quarterly estimates
   - Deduction tracking
   - Tax liability`
    },
    {
      id: 6,
      title: 'Digital Product Launch',
      description: 'Plan and execute your digital product launches with this template.',
      category: ['business', 'content'],
      downloads: 1543,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
      isNew: false,
      isPremium: true,
      content: `Digital Product Launch Template

Overview
--------
Complete system for planning and executing digital product launches.

Features
--------
- Launch timeline
- Marketing planning
- Sales tracking
- Customer feedback

Database Structure
-----------------
Product: Product details
Launch Date: Release date
Timeline: Launch phases
Tasks: Launch tasks
Marketing: Campaign details
Sales: Revenue tracking
Feedback: Customer responses

Views
-----
1. Launch Overview
   - Timeline view
   - Task status
   - Key metrics

2. Marketing Hub
   - Campaign planning
   - Content calendar
   - Promotion tracking

3. Sales Dashboard
   - Revenue tracking
   - Customer analytics
   - Conversion rates`
    }
  ];

  const filteredTemplates = templates
    .filter(template => activeFilter === 'all' || template.category.includes(activeFilter))
    .filter(template => 
      searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleGenerateTemplate = () => {
    window.scrollTo(0, 0); // Scroll to top before navigation
    const dashboardEvent = new CustomEvent('sectionChange', { 
      detail: { section: 'notion-generator' } 
    });
    window.dispatchEvent(dashboardEvent);
  };

  const handleDownloadTemplate = (template: Template) => {
    if (!template.content) {
      console.error('No content available for download');
      alert('This template is currently unavailable for download. Please try another template.');
      return;
    }

    const blob = new Blob([template.content], { type: 'text/plain' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(link.href);

    setTemplates(prevTemplates =>
      prevTemplates.map(t =>
        t.id === template.id ? { ...t, downloads: t.downloads + 1 } : t
      )
    );
  };

  const handleDeleteTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedTemplate) return;

    const updatedTemplates = templates.filter(t => t.id !== selectedTemplate.id);
    setTemplates(updatedTemplates);

    const savedTemplates = JSON.parse(localStorage.getItem('notionTemplates') || '[]');
    const updatedSavedTemplates = savedTemplates.filter((t: Template) => t.id !== selectedTemplate.id);
    localStorage.setItem('notionTemplates', JSON.stringify(updatedSavedTemplates));

    setShowDeleteModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Notion Templates</h1>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search templates..."
              className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            icon={<Filter size={16} />}
          >
            Filter
          </Button>
          
          <Button 
            variant="outline" 
            icon={<Download size={16} />}
          >
            Export
          </Button>
          
          <Button 
            variant="primary" 
            icon={<Sparkles size={16} />}
            onClick={handleGenerateTemplate}
          >
            Generate Template
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 mb-4">
        <div className="flex space-x-2">
          <Button 
            variant={activeFilter === 'all' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All Templates
          </Button>
          <Button 
            variant={activeFilter === 'productivity' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('productivity')}
          >
            Productivity
          </Button>
          <Button 
            variant={activeFilter === 'content' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('content')}
          >
            Content
          </Button>
          <Button 
            variant={activeFilter === 'business' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('business')}
          >
            Business
          </Button>
          <Button 
            variant={activeFilter === 'personal' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('personal')}
          >
            Personal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="overflow-hidden hover:shadow-md transition-all flex flex-col">
            <div className="relative h-40 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img 
                src={template.image} 
                alt={template.title} 
                className="w-full h-full object-cover"
              />
              
              {template.isNew && (
                <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-primary-400 text-white">
                  New
                </span>
              )}
              
              {template.isPremium && (
                <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900">
                  Premium
                </span>
              )}
            </div>
            
            <CardContent className="flex-grow p-4">
              <h3 className="font-medium text-lg mb-1">{template.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {template.category.map(cat => (
                  <span 
                    key={cat} 
                    className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-neutral-500">
                <Download size={14} className="mr-1" />
                <span>{template.downloads.toLocaleString()} downloads</span>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                icon={<Edit size={14} />}
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowPreviewModal(true);
                }}
              >
                Preview
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={<Trash2 size={14} />}
                  onClick={() => handleDeleteTemplate(template)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  icon={<Download size={14} />}
                  onClick={() => handleDownloadTemplate(template)}
                >
                  {template.isPremium ? 'Buy' : 'Download'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        <Card 
          className="border-dashed border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-primary-400 dark:hover:border-primary-500 transition-all flex items-center justify-center cursor-pointer"
          onClick={handleGenerateTemplate}
        >
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-3">
              <Plus size={24} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">Create New Template</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Design a custom Notion template
            </p>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleGenerateTemplate}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)}>
        {selectedTemplate && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{selectedTemplate.title}</h2>
                <div className="flex items-center mt-2 space-x-2">
                  {selectedTemplate.isNew && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-400 text-white">
                      New
                    </span>
                  )}
                  {selectedTemplate.isPremium && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900">
                      Premium
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <img 
                  src={selectedTemplate.image} 
                  alt={selectedTemplate.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {selectedTemplate.description}
                </p>
              </div>

              {selectedTemplate.content && (
                <div>
                  <h3 className="font-medium mb-2">Template Content</h3>
                  <pre className="whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg overflow-auto">
                    {selectedTemplate.content}
                  </pre>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.category.map(cat => (
                    <span 
                      key={cat}
                      className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span>Customizable dashboard layout</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span>Pre-built database structures</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span>Automated workflows</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span>Integration capabilities</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  icon={<Copy size={16} />}
                  onClick={() => {
                    if (selectedTemplate.content) {
                      navigator.clipboard.writeText(selectedTemplate.content);
                    }
                  }}
                >
                  Copy Template
                </Button>
                <Button 
                  variant="primary"
                  icon={<Download size={16} />}
                  onClick={() => handleDownloadTemplate(selectedTemplate)}
                >
                  {selectedTemplate.isPremium ? 'Purchase Template' : 'Download Template'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Delete Template</h2>
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Are you sure you want to delete "{selectedTemplate?.title}"? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};