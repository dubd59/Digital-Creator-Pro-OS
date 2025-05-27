import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  Mail,
  Users,
  BarChart2,
  Send,
  Sparkles,
  Copy,
  Save,
  Trash2,
  Edit,
  X,
  Loader2,
  AlertCircle,
  FileText,
  MessageSquare,
  Newspaper,
  BriefcaseIcon,
  UserIcon,
  Megaphone,
  Search,
  Filter
} from 'lucide-react';

interface EmailTemplate {
  id: number;
  subject: string;
  content: string;
  category: string;
  created: string;
  type: EmailType;
}

type EmailType = 'business' | 'marketing' | 'storytelling' | 'personal' | 'newsletter';

interface EmailPrompt {
  type: EmailType;
  topic: string;
  audience: string;
  tone: 'formal' | 'casual' | 'inspirational' | 'professional';
  length: 'short' | 'medium' | 'long';
  callToAction?: string;
  story?: {
    core: string;
    emotion: string;
    lesson: string;
  };
}

export const EmailMarketingSection: React.FC = () => {
  const [emailPrompt, setEmailPrompt] = useState<EmailPrompt>({
    type: 'business',
    topic: '',
    audience: '',
    tone: 'professional',
    length: 'medium'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<EmailTemplate | null>(null);
  const [savedEmails, setSavedEmails] = useState<EmailTemplate[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendEmailData, setSendEmailData] = useState({
    to: '',
    subject: '',
    content: '',
    scheduledDate: '',
    scheduledTime: ''
  });
  const [isSending, setIsSending] = useState(false);

  const emailTypes = [
    {
      id: 'business',
      label: 'Business/Professional',
      icon: <BriefcaseIcon size={24} />,
      description: 'Formal business communications and professional correspondence'
    },
    {
      id: 'marketing',
      label: 'Marketing/Email Blast',
      icon: <Megaphone size={24} />,
      description: 'Promotional content and marketing campaigns'
    },
    {
      id: 'storytelling',
      label: 'Storytelling/Narrative',
      icon: <MessageSquare size={24} />,
      description: 'Engaging stories and narrative content'
    },
    {
      id: 'personal',
      label: 'Personal Update',
      icon: <UserIcon size={24} />,
      description: 'Personal communications and updates'
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: <Newspaper size={24} />,
      description: 'Regular newsletters and content roundups'
    }
  ];

  const generateEmail = async () => {
    if (!emailPrompt.topic.trim()) {
      setError('Please enter a topic for your email');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPrompt)
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setGeneratedEmail({
        id: Date.now(),
        subject: data.subject,
        content: data.content,
        category: emailPrompt.type,
        created: new Date().toISOString(),
        type: emailPrompt.type
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
      console.error('Error generating email:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEmail = () => {
    if (generatedEmail) {
      setSavedEmails([generatedEmail, ...savedEmails]);
      setGeneratedEmail(null);
      setEmailPrompt({
        type: 'business',
        topic: '',
        audience: '',
        tone: 'professional',
        length: 'medium'
      });
    }
  };

  const handleEditEmail = () => {
    if (!editingEmail) return;
    
    setSavedEmails(savedEmails.map(email => 
      email.id === editingEmail.id ? editingEmail : email
    ));
    setShowEditModal(false);
    setEditingEmail(null);
  };

  const handleDeleteEmail = (id: number) => {
    setSavedEmails(savedEmails.filter(email => email.id !== id));
  };

  const handleUseTemplate = (email: EmailTemplate) => {
    setSendEmailData({
      to: '',
      subject: email.subject,
      content: email.content,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00'
    });
    setShowSendModal(true);
  };

  const handleSendEmail = async () => {
    if (!sendEmailData.to || !sendEmailData.subject || !sendEmailData.content) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: sendEmailData.to.split(',').map(email => email.trim()),
          subject: sendEmailData.subject,
          content: sendEmailData.content,
          scheduledDate: sendEmailData.scheduledDate,
          scheduledTime: sendEmailData.scheduledTime
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setShowSendModal(false);
      setSendEmailData({
        to: '',
        subject: '',
        content: '',
        scheduledDate: '',
        scheduledTime: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Subscribers</p>
                <h4 className="text-2xl font-bold mt-1">2,845</h4>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
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
                <p className="text-sm font-medium text-neutral-500">Open Rate</p>
                <h4 className="text-2xl font-bold mt-1">32.4%</h4>
                <p className="text-xs text-green-500 mt-1">+5% from last month</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <Mail size={20} className="text-green-500 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Click Rate</p>
                <h4 className="text-2xl font-bold mt-1">24.8%</h4>
                <p className="text-xs text-green-500 mt-1">+3% from last month</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <BarChart2 size={20} className="text-purple-500 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {emailTypes.map(type => (
                  <button
                    key={type.id}
                    className={`p-4 rounded-lg border ${
                      emailPrompt.type === type.id
                        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-400'
                    } flex items-start space-x-3 transition-all`}
                    onClick={() => setEmailPrompt({ ...emailPrompt, type: type.id as EmailType })}
                  >
                    <div className={`p-2 rounded-lg ${
                      emailPrompt.type === type.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-500'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                    }`}>
                      {type.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs text-neutral-500 mt-1">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Topic/Purpose</label>
              <textarea
                className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                rows={3}
                value={emailPrompt.topic}
                onChange={(e) => setEmailPrompt({ ...emailPrompt, topic: e.target.value })}
                placeholder="What's your email about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={emailPrompt.audience}
                onChange={(e) => setEmailPrompt({ ...emailPrompt, audience: e.target.value })}
                placeholder="Who are you writing to?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tone</label>
                <select
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={emailPrompt.tone}
                  onChange={(e) => setEmailPrompt({ ...emailPrompt, tone: e.target.value as any })}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Length</label>
                <select
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={emailPrompt.length}
                  onChange={(e) => setEmailPrompt({ ...emailPrompt, length: e.target.value as any })}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            {emailPrompt.type === 'storytelling' && (
              <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <h3 className="font-medium">Story Elements</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Core Story</label>
                  <textarea
                    className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                    rows={2}
                    value={emailPrompt.story?.core || ''}
                    onChange={(e) => setEmailPrompt({
                      ...emailPrompt,
                      story: { ...emailPrompt.story, core: e.target.value } as any
                    })}
                    placeholder="What's the main story or anecdote?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Emotional Elements</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                    value={emailPrompt.story?.emotion || ''}
                    onChange={(e) => setEmailPrompt({
                      ...emailPrompt,
                      story: { ...emailPrompt.story, emotion: e.target.value } as any
                    })}
                    placeholder="What emotions should the story convey?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message/Lesson</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                    value={emailPrompt.story?.lesson || ''}
                    onChange={(e) => setEmailPrompt({
                      ...emailPrompt,
                      story: { ...emailPrompt.story, lesson: e.target.value } as any
                    })}
                    placeholder="What's the main message or lesson?"
                  />
                </div>
              </div>
            )}

            {(emailPrompt.type === 'marketing' || emailPrompt.type === 'business') && (
              <div>
                <label className="block text-sm font-medium mb-1">Call to Action</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={emailPrompt.callToAction || ''}
                  onChange={(e) => setEmailPrompt({ ...emailPrompt, callToAction: e.target.value })}
                  placeholder="What action should the reader take?"
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}

            <Button
              variant="primary"
              fullWidth
              icon={isGenerating ? <Loader2 className="animate-spin\" size={16} /> : <Sparkles size={16} />}
              onClick={generateEmail}
              disabled={isGenerating || !emailPrompt.topic.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate Email'}
            </Button>

            {generatedEmail && (
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Subject:</h3>
                  <p className="text-neutral-800 dark:text-neutral-200">
                    {generatedEmail.subject}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Content:</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                      {generatedEmail.content}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    icon={<Copy size={16} />}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Subject: ${generatedEmail.subject}\n\n${generatedEmail.content}`
                      );
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    icon={<Edit size={16} />}
                    onClick={() => {
                      setEditingEmail(generatedEmail);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Save size={16} />}
                    onClick={handleSaveEmail}
                  >
                    Save Template
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedEmails.length === 0 ? (
                <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                  No saved templates yet. Generate and save some emails to see them here.
                </p>
              ) : (
                savedEmails.map(email => (
                  <div
                    key={email.id}
                    className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{email.subject}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {email.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={14} />}
                          onClick={() => {
                            setEditingEmail(email);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Copy size={14} />}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Subject: ${email.subject}\n\n${email.content}`
                            );
                          }}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Send size={14} />}
                          onClick={() => handleUseTemplate(email)}
                        >
                          Use
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => handleDeleteEmail(email.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Created: {new Date(email.created).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Edit Email Template</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          {editingEmail && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={editingEmail.subject}
                  onChange={(e) => setEditingEmail({
                    ...editingEmail,
                    subject: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  rows={10}
                  value={editingEmail.content}
                  onChange={(e) => setEditingEmail({
                    ...editingEmail,
                    content: e.target.value
                  })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleEditEmail}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={showSendModal} onClose={() => setShowSendModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Send Email</h2>
            <button
              onClick={() => setShowSendModal(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={sendEmailData.to}
                onChange={(e) => setSendEmailData({ ...sendEmailData, to: e.target.value })}
                placeholder="Enter email addresses (comma-separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                value={sendEmailData.subject}
                onChange={(e) => setSendEmailData({ ...sendEmailData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                rows={10}
                value={sendEmailData.content}
                onChange={(e) => setSendEmailData({ ...sendEmailData, content: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={sendEmailData.scheduledDate}
                  onChange={(e) => setSendEmailData({ ...sendEmailData, scheduledDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Time</label>
                <input
                  type="time"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  value={sendEmailData.scheduledTime}
                  onChange={(e) => setSendEmailData({ ...sendEmailData, scheduledTime: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowSendModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={isSending ? <Loader2 className="animate-spin\" size={16} /> : <Send size={16} />}
                onClick={handleSendEmail}
                disabled={isSending || !sendEmailData.to || !sendEmailData.subject || !sendEmailData.content}
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};