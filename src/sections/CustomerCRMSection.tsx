import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  Plus, 
  Search, 
  Filter,
  Users,
  X,
  Trash2,
  Edit,
  Loader2,
  Share2,
  Star,
  StarOff,
  Mail,
  Phone,
  Send
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'lead';
  lastPurchase: string | null;
  totalSpent: number;
  tags: string[];
  isFavorite: boolean;
}

export const CustomerCRMSection: React.FC = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive' | 'lead'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  const [projects, setProjects] = useState<Customer[]>([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      status: 'active',
      lastPurchase: '2025-06-15',
      totalSpent: 1250.75,
      tags: ['course', 'coaching'],
      isFavorite: true
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      phone: '(555) 987-6543',
      status: 'active',
      lastPurchase: '2025-06-10',
      totalSpent: 850.50,
      tags: ['course'],
      isFavorite: false
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '(555) 456-7890',
      status: 'inactive',
      lastPurchase: '2025-03-22',
      totalSpent: 475.25,
      tags: ['membership'],
      isFavorite: false
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '(555) 789-0123',
      status: 'lead',
      lastPurchase: null,
      totalSpent: 0,
      tags: ['lead', 'newsletter'],
      isFavorite: true
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@example.com',
      phone: '(555) 234-5678',
      status: 'active',
      lastPurchase: '2025-06-01',
      totalSpent: 2100.00,
      tags: ['coaching', 'membership'],
      isFavorite: false
    }
  ]);

  const filteredProjects = projects
    .filter(project => activeFilter === 'all' || project.status === activeFilter)
    .filter(project => 
      searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setProjects(projects.filter(p => p.id !== selectedCustomer.id));
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleEditCustomer = () => {
    if (!editedCustomer) return;

    setProjects(projects.map(customer => 
      customer.id === editedCustomer.id ? editedCustomer : customer
    ));
    setIsEditModalOpen(false);
    setEditedCustomer(null);
  };

  const toggleFavorite = (customerId: number) => {
    setProjects(projects.map(customer => 
      customer.id === customerId 
        ? { ...customer, isFavorite: !customer.isFavorite }
        : customer
    ));
  };

  const handleSendInvites = async () => {
    if (!selectedCustomer || !inviteEmails.trim()) return;

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
          projectId: selectedCustomer.id,
          projectTitle: selectedCustomer.name,
          emails,
          invitedBy: 'user@example.com' // This should be the logged-in user's email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send invites');
      }

      setInviteEmails('');
      setSelectedCustomer({
        ...selectedCustomer,
        tags: [...selectedCustomer.tags, ...emails]
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
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300';
      case 'lead':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Contact Management</h1>
        <div className="flex justify-between items-center">
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
          >
            Add Contact
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search contacts..."
              className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          variant={activeFilter === 'all' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('all')}
        >
          All Contacts
        </Button>
        <Button 
          variant={activeFilter === 'active' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={activeFilter === 'inactive' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('inactive')}
        >
          Inactive
        </Button>
        <Button 
          variant={activeFilter === 'lead' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('lead')}
        >
          Leads
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-neutral-500">Name</th>
                  <th className="px-6 py-3 text-left font-medium text-neutral-500">Email</th>
                  <th className="px-6 py-3 text-left font-medium text-neutral-500">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-neutral-500">Last Purchase</th>
                  <th className="px-6 py-3 text-left font-medium text-neutral-500">Total Spent</th>
                  <th className="px-6 py-3 text-left font-medium text-neutral-500">Tags</th>
                  <th className="px-6 py-3 text-left font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(customer => (
                  <tr 
                    key={customer.id}
                    className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button 
                          className="mr-2 text-neutral-400 hover:text-yellow-400 transition-colors"
                          onClick={() => toggleFavorite(customer.id)}
                        >
                          {customer.isFavorite ? (
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff size={16} />
                          )}
                        </button>
                        <span 
                          className="font-medium cursor-pointer hover:text-primary-500 transition-colors"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowDetailsModal(true);
                          }}
                        >
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="cursor-pointer hover:text-primary-500 transition-colors"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDetailsModal(true);
                        }}
                      >
                        {customer.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.lastPurchase 
                        ? new Date(customer.lastPurchase).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4">${customer.totalSpent.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={14} />}
                          onClick={() => {
                            setEditedCustomer({ ...customer });
                            setIsEditModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          icon={<Share2 size={14} />}
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsShareModalOpen(true);
                          }}
                        >
                          Share
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Edit Contact</h2>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          {editedCustomer && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editedCustomer.name}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editedCustomer.email}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editedCustomer.phone}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editedCustomer.status}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editedCustomer.tags.join(', ')}
                  onChange={(e) => setEditedCustomer({ 
                    ...editedCustomer, 
                    tags: e.target.value.split(',').map(tag => tag.trim()) 
                  })}
                  placeholder="Enter tags separated by commas"
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
            <Button 
              variant="primary"
              onClick={handleEditCustomer}
              disabled={!editedCustomer?.name || !editedCustomer?.email}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Share Contact Details</h2>
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Addresses</label>
              <textarea
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                rows={3}
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="Enter email addresses separated by commas"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline"
              onClick={() => setIsShareModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              icon={isSubmitting ? <Loader2 className="animate-spin\" size={16} /> : <Send size={16} />}
              onClick={handleSendInvites}
              disabled={isSubmitting || !inviteEmails.trim()}
            >
              {isSubmitting ? 'Sending...' : 'Send Invites'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Delete Contact</h2>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Are you sure you want to delete this contact? This action cannot be undone.
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
              onClick={handleDeleteCustomer}
            >
              Delete Contact
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        {selectedCustomer && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{selectedCustomer.name}</h2>
                <p className="text-neutral-500">{selectedCustomer.email}</p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail size={16} className="text-neutral-500 mr-2" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-neutral-500 mr-2" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedCustomer.status)}`}>
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Purchase History</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Last Purchase</span>
                    <span>
                      {selectedCustomer.lastPurchase 
                        ? new Date(selectedCustomer.lastPurchase).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spent</span>
                    <span>${selectedCustomer.totalSpent.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  icon={<Share2 size={16} />}
                  onClick={() => {
                    setShowDetailsModal(false);
                    setIsShareModalOpen(true);
                  }}
                >
                  Share
                </Button>
                <Button 
                  variant="primary"
                  icon={<Edit size={16} />}
                  onClick={() => {
                    setShowDetailsModal(false);
                    setEditedCustomer({ ...selectedCustomer });
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit Contact
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};