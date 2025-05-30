import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Layout,
  Database,
  Table,
  Calendar as CalendarIcon,
  Grid,
  List,
  Kanban,
  Link,
  Settings,
  Plus,
  X,
  Sparkles,
  Loader2,
  PaintBucket,
  Layers,
  Users,
  FileText,
  Zap,
  CheckCircle2,
  Copy,
  Save,
  ExternalLink,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface TemplateConfig {
  purpose: string;
  audience: string;
  features: string[];
  layout: 'minimal' | 'detailed' | 'visual';
  colorScheme: 'default' | 'neutral' | 'colorful';
  databases: {
    name: string;
    type: 'table' | 'calendar' | 'gallery' | 'list' | 'kanban';
    properties: {
      name: string;
      type: string;
      options?: string[];
    }[];
  }[];
}

export default function NotionTemplateGenerator() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [config, setConfig] = useState<TemplateConfig>({
    purpose: '',
    audience: '',
    features: [],
    layout: 'minimal',
    colorScheme: 'default',
    databases: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<any | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showApiDocs, setShowApiDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDatabase, setNewDatabase] = useState({
    name: '',
    type: 'table' as const,
    properties: []
  });
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    type: 'text'
  });

  const generateNotionTableMarkdown = (template: any) => {
  let markdown = '';

  // Add header section
  markdown += '# ' + (config.purpose?.split('\n')[0] || 'Notion Template') + '\n\n';
  markdown += (config.purpose || '') + '\n\n';

  // Structure section
  markdown += '## Structure\n\n';
  markdown += '| Section | Content |\n';
  markdown += '|---------|----------|\n';
  (template.structure || []).forEach((section: any) => {
    markdown += `| ${section.section} | ${(section.content || []).join(', ')} |\n`;
  });
  markdown += '\n';

  // Databases section
  markdown += '## Databases\n\n';
  markdown += '| Database | Type | Views | Properties |\n';
  markdown += '|-----------|------|--------|------------|\n';
  (template.databases || []).forEach((db: any) => {
    markdown += `| ${db.name || ''} | ${db.type || ''} | ${(db.views || []).join(', ')} | ${(db.properties || []).map((p: any) => (p.name || '') + ' (' + (p.type || '') + ')').join(', ')} |\n`;
  });
  markdown += '\n';

  // Widgets section
  markdown += '## Widgets\n\n';
  markdown += '| Type | Purpose | Placement | Implementation |\n';
  markdown += '|------|---------|-----------|----------------|\n';
  (template.widgets || []).forEach((widget: any) => {
    markdown += `| ${widget.type || ''} | ${widget.purpose || ''} | ${widget.placement || ''} | ${(widget.implementation || '').split('\n').join('; ')} |\n`;
  });
  markdown += '\n';

  // Automations section
  markdown += '## Automations\n\n';
  markdown += '| Trigger | Action | Description | Implementation |\n';
  markdown += '|---------|--------|-------------|----------------|\n';
  (template.automations || []).forEach((automation: any) => {
    markdown += `| ${automation.trigger || ''} | ${automation.action || ''} | ${automation.description || ''} | ${(automation.implementation || '').split('\n').join('; ')} |\n`;
  });
  markdown += '\n';

  // Embeds section
  markdown += '## Embeds\n\n';
  markdown += '| Type | Purpose | Setup |\n';
  markdown += '|------|---------|-------|\n';
  (template.embeds || []).forEach((embed: any) => {
    markdown += `| ${embed.type || ''} | ${embed.purpose || ''} | ${(embed.setup || []).join('; ')} |\n`;
  });
  markdown += '\n';

  // API Integration section
  markdown += '## API Integration\n\n';
  markdown += '| Endpoint | Method | Permissions | Rate Limit |\n';
  markdown += '|----------|--------|-------------|------------|\n';
  if (template.apiIntegration) {
    markdown += `| ${template.apiIntegration.endpoint || ''} | ${template.apiIntegration.method || ''} | ${(template.apiIntegration.permissions || []).join(', ')} | ${template.apiIntegration.rateLimit || ''} |\n`;
  }

  return markdown;
};

  const handleGenerateTemplate = async () => {
    if (!config.purpose.trim()) {
      setError('Please provide a purpose for your template');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
     const response = await fetch('http://localhost:3000/api/openai/generate-template', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...config,
    prompt: `Create a Notion template for: ${config.purpose} (Audience: ${config.audience}, Layout: ${config.layout})`
  })
});
      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      setGeneratedTemplate(data);
      setShowPreview(true);
    } catch (error) {
      setError(error.message || 'An error occurred while generating the template');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddDatabase = () => {
    if (!newDatabase.name.trim()) return;

    setConfig(prev => ({
      ...prev,
      databases: [...prev.databases, { ...newDatabase, properties: [] }]
    }));
    setNewDatabase({
      name: '',
      type: 'table',
      properties: []
    });
    setShowDatabaseModal(false);
  };

  const handleAddProperty = () => {
    if (!newProperty.name.trim()) return;

    setNewDatabase(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty]
    }));
    setNewProperty({
      name: '',
      type: 'text'
    });
  };

  const handleSaveTemplate = () => {
    if (!generatedTemplate) return;

    const notionMarkdown = generateNotionTableMarkdown(generatedTemplate);
    
    const template = {
      id: Date.now(),
      title: config.purpose.split('\n')[0] || 'Untitled Template',
      description: config.purpose,
      category: ['productivity'],
      downloads: 0,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
      isNew: true,
      isPremium: false,
      content: notionMarkdown
    };

    const existingTemplates = JSON.parse(localStorage.getItem('notionTemplates') || '[]');
    localStorage.setItem('notionTemplates', JSON.stringify([...existingTemplates, template]));

    const dashboardEvent = new CustomEvent('sectionChange', { 
      detail: { section: 'notion-templates' } 
    });
    window.dispatchEvent(dashboardEvent);
  };

  const handleBackToTemplates = () => {
    const dashboardEvent = new CustomEvent('sectionChange', { 
      detail: { section: 'notion-templates' } 
    });
    window.dispatchEvent(dashboardEvent);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={handleBackToTemplates}
          >
            Back to Templates
          </Button>
          <h1 className="text-2xl font-bold">Notion Template Generator</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Link size={16} />}
            onClick={() => setShowApiDocs(true)}
          >
            API Docs
          </Button>
          <Button
            variant="primary"
            icon={isGenerating ? <Loader2 className="animate-spin\" size={16} /> : <Sparkles size={16} />}
            onClick={handleGenerateTemplate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Template'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings size={20} className="mr-2" />
              Template Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Purpose</label>
              <textarea
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                rows={3}
                value={config.purpose}
                onChange={(e) => setConfig({ ...config, purpose: e.target.value })}
                placeholder="Describe the main purpose of your template..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={config.audience}
                onChange={(e) => setConfig({ ...config, audience: e.target.value })}
                placeholder="Who will be using this template?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Layout Style</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`p-3 rounded-lg border ${
                    config.layout === 'minimal'
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  } flex flex-col items-center`}
                  onClick={() => setConfig({ ...config, layout: 'minimal' })}
                >
                  <Layout size={24} className="mb-2" />
                  <span className="text-sm">Minimal</span>
                </button>
                <button
                  className={`p-3 rounded-lg border ${
                    config.layout === 'detailed'
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  } flex flex-col items-center`}
                  onClick={() => setConfig({ ...config, layout: 'detailed' })}
                >
                  <Layers size={24} className="mb-2" />
                  <span className="text-sm">Detailed</span>
                </button>
                <button
                  className={`p-3 rounded-lg border ${
                    config.layout === 'visual'
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  } flex flex-col items-center`}
                  onClick={() => setConfig({ ...config, layout: 'visual' })}
                >
                  <Grid size={24} className="mb-2" />
                  <span className="text-sm">Visual</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color Scheme</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`p-3 rounded-lg border ${
                    config.colorScheme === 'default'
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  } flex flex-col items-center`}
                  onClick={() => setConfig({ ...config, colorScheme: 'default' })}
                >
                  <PaintBucket size={24} className="mb-2" />
                  <span className="text-sm">Default</span>
                </button>
                <button
                  className={`p-3 rounded-lg border ${
                    config.colorScheme === 'neutral'
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  } flex flex-col items-center`}
                  onClick={() => setConfig({ ...config, colorScheme: 'neutral' })}
                >
                  <PaintBucket size={24} className="mb-2" />
                  <span className="text-sm">Neutral</span>
                </button>
                <button
                  className={`p-3 rounded-lg border ${
                    config.colorScheme === 'colorful'
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  } flex flex-col items-center`}
                  onClick={() => setConfig({ ...config, colorScheme: 'colorful' })}
                >
                  <PaintBucket size={24} className="mb-2" />
                  <span className="text-sm">Colorful</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Databases</label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => setShowDatabaseModal(true)}
                >
                  Add Database
                </Button>
              </div>
              <div className="space-y-2">
                {config.databases.map((db, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{db.name}</h4>
                        <p className="text-sm text-neutral-500">
                          {db.type} • {db.properties.length} properties
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<X size={14} />}
                        onClick={() => {
                          setConfig(prev => ({
                            ...prev,
                            databases: prev.databases.filter((_, i) => i !== index)
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 flex justify-center py-4">
          <Button
            variant="primary"
            size="lg"
            icon={isGenerating ? <Loader2 className="animate-spin\" size={16} /> : <Sparkles size={16} />}
            onClick={handleGenerateTemplate}
            disabled={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating ? 'Generating...' : 'Generate Template'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText size={20} className="mr-2" />
              Template Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedTemplate ? (
              <div className="space-y-6">
                <pre className="whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg overflow-auto">
                  {generateNotionTableMarkdown(generatedTemplate)}
                </pre>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    icon={<Copy size={16} />}
                    onClick={() => {
                      navigator.clipboard.writeText(generateNotionTableMarkdown(generatedTemplate));
                    }}
                  >
                    Copy Template
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Save size={16} />}
                    onClick={handleSaveTemplate}
                  >
                    Save Template
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                Configure your template and click "Generate Template" to preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={showDatabaseModal} onClose={() => setShowDatabaseModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Database</h2>
            <button
              onClick={() => setShowDatabaseModal(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Database Name</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={newDatabase.name}
                onChange={(e) => setNewDatabase({ ...newDatabase, name: e.target.value })}
                placeholder="Enter database name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">View Type</label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={newDatabase.type}
                onChange={(e) => setNewDatabase({ ...newDatabase, type: e.target.value as any })}
              >
                <option value="table">Table</option>
                <option value="calendar">Calendar</option>
                <option value="gallery">Gallery</option>
                <option value="list">List</option>
                <option value="kanban">Kanban</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Properties</label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={handleAddProperty}
                >
                  Add Property
                </Button>
              </div>

              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  placeholder="Property name"
                />
                <select
                  className="w-1/3 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={newProperty.type}
                  onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="date">Date</option>
                  <option value="person">Person</option>
                  <option value="file">File</option>
                </select>
              </div>

              <div className="space-y-2">
                {newDatabase.properties.map((prop, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                  >
                    <div>
                      <span className="font-medium">{prop.name}</span>
                      <span className="text-sm text-neutral-500 ml-2">{prop.type}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X size={14} />}
                      onClick={() => {
                        setNewDatabase(prev => ({
                          ...prev,
                          properties: prev.properties.filter((_, i) => i !== index)
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDatabaseModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddDatabase}
              disabled={!newDatabase.name.trim()}
            >
              Add Database
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showApiDocs} onClose={() => setShowApiDocs(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">API Documentation</h2>
            <button
              onClick={() => setShowApiDocs(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Integration Setup</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Follow these steps to integrate the template with your Notion workspace:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-sm">
                <li>Create a new integration in your Notion workspace</li>
                <li>Grant the necessary permissions to the integration</li>
                <li>Copy your integration token</li>
                <li>Use the token to authenticate API requests</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">Required Permissions</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Read and write access to databases</li>
                <li>Create and modify pages</li>
                <li>Manage page content and properties</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Rate Limits</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                The Notion API has the following rate limits:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>3 requests per second per integration</li>
                <li>90 requests per minute per integration</li>
                <li>1000 requests per day per integration</li>
              </ul>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                fullWidth
                icon={<ExternalLink size={16} />}
                onClick={() => window.open('https://developers.notion.com', '_blank')}
              >
                View Full Documentation
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { NotionTemplateGenerator };