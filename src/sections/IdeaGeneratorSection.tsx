import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Lightbulb,
  Sparkles,
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const IdeaGeneratorSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdeas = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ideas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      setGeneratedIdeas(data.ideas);
    } catch (err) {
      setError('Failed to generate ideas. Please try again.');
      console.error('Error generating ideas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = [
    {
      title: "Content Ideas",
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      description: "Blog posts, videos, and social media content"
    },
    {
      title: "Product Ideas",
      icon: <Target className="h-5 w-5 text-purple-500" />,
      description: "Digital products and services"
    },
    {
      title: "Audience Growth",
      icon: <Users className="h-5 w-5 text-green-500" />,
      description: "Strategies to expand your reach"
    },
    {
      title: "Monetization",
      icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
      description: "Revenue streams and business models"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Idea Generator</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary-400" />
              <span>Generate New Ideas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  What kind of ideas are you looking for?
                </label>
                <textarea
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400"
                  rows={4}
                  placeholder="e.g., Content ideas for my tech blog, new digital product concepts, or audience growth strategies"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="primary"
                fullWidth
                icon={<Sparkles size={16} />}
                onClick={generateIdeas}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? 'Generating Ideas...' : 'Generate Ideas'}
              </Button>

              {generatedIdeas.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-medium text-neutral-900 dark:text-white">Generated Ideas:</h3>
                  {generatedIdeas.map((idea, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 transition-all"
                    >
                      <p className="text-neutral-800 dark:text-neutral-200">{idea}</p>
                      <div className="mt-2 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<ArrowRight size={14} />}
                        >
                          Develop Idea
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-primary-400" />
                <span>Idea Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {categories.map((category, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      {category.icon}
                      <div>
                        <h3 className="font-medium text-neutral-900 dark:text-white">
                          {category.title}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Create an online course', 'Start a newsletter', 'Launch a podcast'].map((idea, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                  >
                    <p className="text-sm">{idea}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};