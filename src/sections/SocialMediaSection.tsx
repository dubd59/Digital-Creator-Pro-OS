import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Video,
  Hash,
  Clock,
  Image as ImageIcon,
  Copy,
  Calendar,
  Trash2,
  Edit,
  Send,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ContentPrompt {
  topic: string;
  audience: string;
  voice: string;
  goals: string;
  contentType: string;
}

interface SocialPost {
  content: string;
  hashtags?: string[];
  imagePrompt?: string;
  callToAction?: string;
}

interface PlatformContent {
  twitter: SocialPost;
  facebook: SocialPost;
  instagram: SocialPost;
  linkedin: SocialPost;
}

export const SocialMediaSection: React.FC = () => {
  const [prompt, setPrompt] = useState<ContentPrompt>({
    topic: '',
    audience: '',
    voice: 'professional',
    goals: 'engagement',
    contentType: 'text'
  });

  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [platformContent, setPlatformContent] = useState<PlatformContent | null>(null);

  const generateContent = async () => {
    if (!prompt.topic || !prompt.topic.trim()) {
      setError('Please enter a topic before generating ideas');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ideas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.topic.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate ideas');
      }

      const data = await response.json();
      setGeneratedIdeas(data.ideas);
      setPlatformContent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ideas');
      console.error('Error generating ideas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectIdea = async (idea: string) => {
    setSelectedIdea(idea);
    if (!selectedPlatform) {
      setSelectedPlatform('twitter');
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ideas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.topic.trim(),
          selectedIdea: idea
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate platform content');
      }

      const data = await response.json();
      setPlatformContent(data.platformContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate platform content');
      console.error('Error generating platform content:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPlatformPreview = (idea: string) => {
    if (!selectedPlatform || !platformContent) return null;
    
    const content = platformContent[selectedPlatform as keyof PlatformContent];
    let preview = content.content;

    if (content.hashtags && content.hashtags.length > 0) {
      preview += '\n\n' + content.hashtags.join(' ');
    }

    if (content.callToAction) {
      preview += '\n\n' + content.callToAction;
    }

    return preview;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Media Content Generator</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              What's your main topic or theme?
            </label>
            <textarea
              className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              rows={3}
              value={prompt.topic}
              onChange={(e) => setPrompt({ ...prompt, topic: e.target.value })}
              placeholder="Describe your product, service, or content theme..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Who's your target audience?
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              value={prompt.audience}
              onChange={(e) => setPrompt({ ...prompt, audience: e.target.value })}
              placeholder="e.g., Small business owners, tech enthusiasts, fitness beginners..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand Voice</label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={prompt.voice}
                onChange={(e) => setPrompt({ ...prompt, voice: e.target.value })}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="humorous">Humorous</option>
                <option value="educational">Educational</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Primary Goal</label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={prompt.goals}
                onChange={(e) => setPrompt({ ...prompt, goals: e.target.value })}
              >
                <option value="engagement">Engagement</option>
                <option value="sales">Sales</option>
                <option value="awareness">Brand Awareness</option>
                <option value="traffic">Website Traffic</option>
                <option value="leads">Lead Generation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content Type</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                className={`p-3 rounded-lg border ${
                  prompt.contentType === 'text'
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                } flex flex-col items-center`}
                onClick={() => setPrompt({ ...prompt, contentType: 'text' })}
              >
                <Hash size={24} className="mb-2" />
                <span className="text-sm">Text</span>
              </button>
              <button
                className={`p-3 rounded-lg border ${
                  prompt.contentType === 'image'
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                } flex flex-col items-center`}
                onClick={() => setPrompt({ ...prompt, contentType: 'image' })}
              >
                <ImageIcon size={24} className="mb-2" />
                <span className="text-sm">Image</span>
              </button>
              <button
                className={`p-3 rounded-lg border ${
                  prompt.contentType === 'video'
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                } flex flex-col items-center`}
                onClick={() => setPrompt({ ...prompt, contentType: 'video' })}
              >
                <Video size={24} className="mb-2" />
                <span className="text-sm">Video</span>
              </button>
              <button
                className={`p-3 rounded-lg border ${
                  prompt.contentType === 'mixed'
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700'
                } flex flex-col items-center`}
                onClick={() => setPrompt({ ...prompt, contentType: 'mixed' })}
              >
                <Calendar size={24} className="mb-2" />
                <span className="text-sm">Mixed</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              variant="primary"
              disabled={!prompt.topic.trim() || isGenerating}
              onClick={generateContent}
              icon={isGenerating ? <Loader2 className="animate-spin\" size={16} /> : undefined}
            >
              {isGenerating ? 'Generating...' : 'Generate Ideas'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generatedIdeas.length > 0 ? (
                generatedIdeas.map((idea, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedIdea === idea
                        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-400'
                    }`}
                    onClick={() => handleSelectIdea(idea)}
                  >
                    <p className="text-sm">{idea}</p>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                  {isGenerating ? 'Generating ideas...' : 'Generated content ideas will appear here'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button 
                  variant={selectedPlatform === 'twitter' ? 'primary' : 'outline'}
                  size="sm"
                  icon={<Twitter size={16} />}
                  onClick={() => setSelectedPlatform('twitter')}
                >
                  X (Twitter)
                </Button>
                <Button 
                  variant={selectedPlatform === 'facebook' ? 'primary' : 'outline'}
                  size="sm"
                  icon={<Facebook size={16} />}
                  onClick={() => setSelectedPlatform('facebook')}
                >
                  Facebook
                </Button>
                <Button 
                  variant={selectedPlatform === 'instagram' ? 'primary' : 'outline'}
                  size="sm"
                  icon={<Instagram size={16} />}
                  onClick={() => setSelectedPlatform('instagram')}
                >
                  Instagram
                </Button>
                <Button 
                  variant={selectedPlatform === 'linkedin' ? 'primary' : 'outline'}
                  size="sm"
                  icon={<Linkedin size={16} />}
                  onClick={() => setSelectedPlatform('linkedin')}
                >
                  LinkedIn
                </Button>
              </div>

              <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                {selectedIdea && platformContent ? (
                  <div className="space-y-4">
                    <p className="whitespace-pre-wrap">
                      {getPlatformPreview(selectedIdea)}
                    </p>
                    {selectedPlatform === 'instagram' && platformContent.instagram.imagePrompt && (
                      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-sm text-neutral-500">Suggested image:</p>
                        <p className="mt-1 text-sm">{platformContent.instagram.imagePrompt}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                    Select a platform and content idea to preview
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <Clock size={14} />
                  <span>Best time to post: 9:00 AM</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<Edit size={14} />}
                    disabled={!selectedIdea}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<Copy size={14} />}
                    disabled={!selectedIdea}
                    onClick={() => {
                      if (selectedIdea) {
                        navigator.clipboard.writeText(getPlatformPreview(selectedIdea) || selectedIdea);
                      }
                    }}
                  >
                    Copy
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    icon={<Calendar size={14} />}
                    disabled={!selectedIdea}
                  >
                    Schedule
                  </Button>
                  <Button 
                    variant="primary"
                    size="sm"
                    icon={<Send size={14} />}
                    disabled={!selectedIdea}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};