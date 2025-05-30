import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users,
  X,
  Calendar,
  ArrowRight,
  BarChart,
  Trash2,
  Edit,
  Loader2,
  Share2,
  MessageSquare,
  Link as LinkIcon,
  FileText,
  MoreVertical,
  ExternalLink,
  Download,
  Clock
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed';
  progress: number;
  dueDate: string;
  team: string[];
  tasks: number;
  files: number;
  comments: {
    id: number;
    author: string;
    text: string;
    date: string;
  }[];
}

export const ProjectsSection: React.FC = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'planning' as const
  });
  const [editProject, setEditProject] = useState<Project | null>(null);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'Website Redesign',
      description: 'Complete overhaul of the main website with new branding',
      status: 'active',
      progress: 65,
      dueDate: '2025-07-15',
      team: ['John D.', 'Sarah M.'],
      tasks: 12,
      files: 5,
      comments: [
        {
          id: 1,
          author: 'John D.',
          text: 'Homepage design is ready for review',
          date: '2025-06-20'
        }
      ]
    },
    {
      id: 2,
      title: 'Content Strategy',
      description: 'Develop Q3 content strategy and editorial calendar',
      status: 'planning',
      progress: 25,
      dueDate: '2025-08-01',
      team: ['Emma K.'],
      tasks: 8,
      files: 3,
      comments: []
    },
    {
      id: 3,
      title: 'Social Media Campaign',
      description: 'Summer promotion campaign across all platforms',
      status: 'completed',
      progress: 100,
      dueDate: '2025-06-15',
      team: ['Mike R.', 'Lisa T.'],
      tasks: 15,
      files: 8,
      comments: []
    }
  ]);

  const filteredProjects = projects
    .filter(project => activeFilter === 'all' || project.status === activeFilter)
    .filter(project => 
      searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleCreateProject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newId = Math.max(...projects.map(p => p.id)) + 1;
      const project: Project = {
        id: newId,
        title: newProject.title,
        description: newProject.description,
        status: newProject.status,
        progress: 0,
        dueDate: newProject.dueDate,
        team: [],
        tasks: 0,
        files: 0,
        comments: []
      };

      setProjects([...projects, project]);
      setIsNewProjectModalOpen(false);
      setNewProject({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'planning'
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    }
  };

  const handleSaveEditProject = () => {
    if (!editProject) return;
    setProjects(projects.map(p => p.id === editProject.id ? editProject : p));
    setIsEditModalOpen(false);
    setSelectedProject(null);
    setEditProject(null);
  };

  const handleSendInvites = async () => {
    if (!selectedProject || !inviteEmails.trim()) return;

    setIsSubmitting(true);
    const emails = inviteEmails.split(',').map(email => email.trim()).filter(Boolean);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-invites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          projectTitle: selectedProject.title,
          emails,
          invitedBy: 'user@example.com' // This should be the logged-in user's email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send invites');
      }

      setInviteEmails('');
      setSelectedProject({
        ...selectedProject,
        team: [...selectedProject.team, ...emails]
      });
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error sending invites:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'planning':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
      case 'completed':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Project Filters */}
      <div className="flex space-x-2">
        <Button 
          variant={activeFilter === 'all' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </Button>
        <Button 
          variant={activeFilter === 'active' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={activeFilter === 'planning' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('planning')}
        >
          Planning
        </Button>
        <Button 
          variant={activeFilter === 'completed' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </Button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(project => (
          <Card key={project.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">{project.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    <span className="text-sm text-neutral-500">
                      Due {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-neutral-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      project.status === 'completed' 
                        ? 'bg-green-500' 
                        : 'bg-primary-400'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Team</p>
                  <p className="font-medium">{project.team.length} members</p>
                </div>
                <div>
                  <p className="text-neutral-500">Tasks</p>
                  <p className="font-medium">{project.tasks}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Files</p>
                  <p className="font-medium">{project.files}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline"
                  size="sm"
                  icon={<Share2 size={16} />}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsShareModalOpen(true);
                  }}
                >
                  Share
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => {
                      setSelectedProject(project);
                      setEditProject(project);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* New Project Card */}
        <Card 
          className="border-dashed border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-primary-400 dark:hover:border-primary-500 transition-all flex items-center justify-center cursor-pointer"
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-3">
              <Plus size={24} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">Create New Project</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Start a new project from scratch
            </p>
            <Button variant="primary" size="sm">Get Started</Button>
          </CardContent>
        </Card>
      </div>

      {/* New Project Modal */}
      <Modal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Create New Project</h2>
            <button 
              onClick={() => setIsNewProjectModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                rows={3}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe your project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'planning' | 'active' | 'completed' })}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline"
              onClick={() => setIsNewProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleCreateProject}
              disabled={isSubmitting || !newProject.title || !newProject.description}
              icon={isSubmitting ? <Loader2 className="animate-spin" size={16} /> : undefined}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Edit Project</h2>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          {editProject && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editProject.title}
                  onChange={e => setEditProject({ ...editProject, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  rows={3}
                  value={editProject.description}
                  onChange={e => setEditProject({ ...editProject, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editProject.dueDate}
                  onChange={e => setEditProject({ ...editProject, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editProject.status}
                  onChange={e => setEditProject({ ...editProject, status: e.target.value as 'planning' | 'active' | 'completed' })}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Progress</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editProject.progress}
                  min="0"
                  max="100"
                  onChange={e => setEditProject({ ...editProject, progress: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEditProject}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Delete Project</h2>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Are you sure you want to delete this project? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteProject}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Share Project Modal */}
      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Share Project</h2>
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          {selectedProject && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Link</label>
                <div className="flex">
                  <input
                    type="text"
                    value={`${window.location.origin}/projects/${selectedProject.id}`}
                    readOnly
                    className="flex-1 p-2 rounded-l-lg border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                  <Button variant="outline" className="rounded-l-none">
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Invite Team Members</label>
                <input
                  type="text"
                  placeholder="Enter email addresses (comma-separated)"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Enter multiple emails separated by commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Team Members</label>
                <div className="space-y-2">
                  {selectedProject.team.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                    >
                      <span>{member}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<X size={14} />}
                        onClick={() => {
                          setSelectedProject({
                            ...selectedProject,
                            team: selectedProject.team.filter((_, i) => i !== index)
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="primary" 
                fullWidth 
                icon={isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Share2 size={14} />}
                onClick={handleSendInvites}
                disabled={isSubmitting || !inviteEmails.trim()}
              >
                {isSubmitting ? 'Sending Invites...' : 'Send Invites'}
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};