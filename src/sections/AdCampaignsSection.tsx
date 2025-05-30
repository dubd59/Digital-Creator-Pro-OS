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
  Loader2
} from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  description: string;
  budget: number;
  spent: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  platform: string;
  startDate: string;
  endDate: string;
  reach: number;
  engagement: number;
}

export const AdCampaignsSection: React.FC = () => {
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'paused' | 'completed' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    budget: 0,
    platform: 'facebook',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: 'Summer Sale 2025',
      description: 'Promote summer course bundle with early bird pricing',
      budget: 2000,
      spent: 850,
      status: 'active',
      platform: 'facebook',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      reach: 25000,
      engagement: 4.5
    },
    {
      id: 2,
      title: 'Product Launch',
      description: 'New digital product launch campaign',
      budget: 3000,
      spent: 1200,
      status: 'active',
      platform: 'instagram',
      startDate: '2025-06-15',
      endDate: '2025-07-15',
      reach: 35000,
      engagement: 3.8
    },
    {
      id: 3,
      title: 'Brand Awareness',
      description: 'Increase brand visibility and reach',
      budget: 1500,
      spent: 1500,
      status: 'completed',
      platform: 'linkedin',
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      reach: 20000,
      engagement: 2.9
    }
  ]);

  const filteredCampaigns = campaigns
    .filter(campaign => activeFilter === 'all' || campaign.status === activeFilter)
    .filter(campaign => 
      searchQuery === '' || 
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
  const averageEngagement = campaigns.length > 0
    ? campaigns.reduce((sum, campaign) => sum + campaign.engagement, 0) / campaigns.length
    : 0;

  const handleCreateCampaign = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
      const campaign: Campaign = {
        id: newId,
        title: newCampaign.title,
        description: newCampaign.description,
        budget: newCampaign.budget,
        spent: 0,
        status: 'active',
        platform: newCampaign.platform,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        reach: 0,
        engagement: 0
      };

      setCampaigns([...campaigns, campaign]);
      setIsNewCampaignModalOpen(false);
      setNewCampaign({
        title: '',
        description: '',
        budget: 0,
        platform: 'facebook',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsAnalyticsModalOpen(true);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCampaign) {
      setCampaigns(campaigns.filter(c => c.id !== selectedCampaign.id));
      setIsDeleteModalOpen(false);
      setSelectedCampaign(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ad Campaigns</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsNewCampaignModalOpen(true)}
          >
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Spent</p>
                <h4 className="text-2xl font-bold mt-1">${totalSpent.toFixed(2)}</h4>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>15% from last month</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900">
                <DollarSign size={20} className="text-primary-500 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Reach</p>
                <h4 className="text-2xl font-bold mt-1">{totalReach.toLocaleString()}</h4>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>8% from last month</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Users size={20} className="text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Avg. Engagement</p>
                <h4 className="text-2xl font-bold mt-1">{averageEngagement.toFixed(1)}%</h4>
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>3% from last month</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Target size={20} className="text-purple-500 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Filters */}
      <div className="flex space-x-2">
        <Button 
          variant={activeFilter === 'all' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('all')}
        >
          All Campaigns
        </Button>
        <Button 
          variant={activeFilter === 'active' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={activeFilter === 'paused' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('paused')}
        >
          Paused
        </Button>
        <Button 
          variant={activeFilter === 'completed' ? 'primary' : 'outline'} 
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </Button>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.map(campaign => (
          <Card key={campaign.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{campaign.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">{campaign.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<BarChart size={16} />}
                    onClick={() => handleViewAnalytics(campaign)}
                  >
                    Analytics
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => handleEditCampaign(campaign)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDeleteCampaign(campaign)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-neutral-500">Budget</p>
                  <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Spent</p>
                  <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Reach</p>
                  <p className="font-semibold">{campaign.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Engagement</p>
                  <p className="font-semibold">{campaign.engagement}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={isNewCampaignModalOpen} onClose={() => setIsNewCampaignModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Create New Campaign</h2>
            <button 
              onClick={() => setIsNewCampaignModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Title</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                placeholder="Enter campaign title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                rows={3}
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                placeholder="Describe your campaign"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="number"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseFloat(e.target.value) })}
                placeholder="Enter campaign budget"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={newCampaign.platform}
                onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline"
              onClick={() => setIsNewCampaignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleCreateCampaign}
              disabled={isSubmitting || !newCampaign.title || !newCampaign.description || newCampaign.budget <= 0}
              icon={isSubmitting ? <Loader2 className="animate-spin" size={16} /> : undefined}
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Edit Campaign</h2>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          {selectedCampaign && (
            <EditCampaignForm
              campaign={selectedCampaign}
              onCancel={() => setIsEditModalOpen(false)}
              onSave={updated => {
                setCampaigns(campaigns.map(c =>
                  c.id === updated.id ? updated : c
                ));
                setIsEditModalOpen(false);
                setSelectedCampaign(null);
              }}
            />
          )}
        </div>
      </Modal>

      {/* Analytics Modal */}
      <Modal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Campaign Analytics</h2>
            <button 
              onClick={() => setIsAnalyticsModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          {selectedCampaign && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-neutral-500">Total Spent</h3>
                    <p className="text-2xl font-bold mt-1">${selectedCampaign.spent.toLocaleString()}</p>
                    <p className="text-xs text-green-500 mt-1">
                      {((selectedCampaign.spent / selectedCampaign.budget) * 100).toFixed(1)}% of budget
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-neutral-500">Total Reach</h3>
                    <p className="text-2xl font-bold mt-1">{selectedCampaign.reach.toLocaleString()}</p>
                    <p className="text-xs text-green-500 mt-1">
                      ${(selectedCampaign.spent / selectedCampaign.reach * 1000).toFixed(2)} per 1k reach
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Performance Over Time</h3>
                  <div className="h-64 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <p className="text-neutral-500">Analytics chart would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Engagement Rate</span>
                      <span className="font-medium">{selectedCampaign.engagement}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cost per Engagement</span>
                      <span className="font-medium">
                        ${(selectedCampaign.spent / (selectedCampaign.reach * selectedCampaign.engagement / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Campaign Duration</span>
                      <span className="font-medium">
                        {Math.ceil((new Date(selectedCampaign.endDate).getTime() - new Date(selectedCampaign.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Delete Campaign</h2>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Are you sure you want to delete this campaign? This action cannot be undone.
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
              onClick={confirmDelete}
            >
              Delete Campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Place this at the bottom of your file (outside AdCampaignsSection)
function EditCampaignForm({
  campaign,
  onCancel,
  onSave
}: {
  campaign: Campaign;
  onCancel: () => void;
  onSave: (updated: Campaign) => void;
}) {
  const [form, setForm] = useState({ ...campaign });

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Campaign Title</label>
        <input
          type="text"
          className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
          rows={3}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Budget</label>
        <input
          type="number"
          className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
          value={form.budget}
          onChange={e => setForm({ ...form, budget: Number(e.target.value) })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value as Campaign['status'] })}
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
            value={form.endDate}
            onChange={e => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}