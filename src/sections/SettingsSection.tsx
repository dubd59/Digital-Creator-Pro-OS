import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Settings,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Shield,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const SettingsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');

  const settingsCategories = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: <User className="h-5 w-5" />,
      description: 'Manage your account information and preferences'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      description: 'Configure how you want to be notified'
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Lock className="h-5 w-5" />,
      description: 'Protect your account and data'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Palette className="h-5 w-5" />,
      description: 'Customize how Creator Pro looks'
    },
    {
      id: 'billing',
      title: 'Billing & Subscription',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Manage your subscription and payment methods'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Globe className="h-5 w-5" />,
      description: 'Connect with other services and platforms'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeTab === category.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className={`${
                    activeTab === category.id
                      ? 'text-primary-500'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {category.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{category.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {category.description}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-400" />
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {settingsCategories.find(c => c.id === activeTab)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      defaultValue="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      rows={4}
                      defaultValue="Digital creator and entrepreneur"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary">
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-neutral-500">Receive updates via email</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-12 h-6 bg-primary-400 rounded-full"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-6"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-neutral-500">Receive browser notifications</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      />
                    </div>
                    <div className="mt-4">
                      <Button variant="primary">
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                    <Button variant="outline">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              )}

              {/* Add more tab content as needed */}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
                  <HelpCircle size={16} />
                  <span className="text-sm">Need help? Check out our documentation or contact support</span>
                </div>
                <Button variant="outline" size="sm">
                  Get Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};