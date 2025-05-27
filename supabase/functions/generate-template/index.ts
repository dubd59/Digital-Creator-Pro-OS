import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const config: TemplateConfig = await req.json();

    // Generate template structure based on purpose and features
    const structure = [
      {
        section: 'Overview',
        content: [
          'Quick summary and purpose',
          'Getting started guide',
          'Key features and functionality',
          'Navigation instructions'
        ]
      },
      {
        section: 'Main Dashboard',
        content: config.features.map(feature => `${feature} section`)
      }
    ];

    // Configure database views based on type
    const databases = config.databases.map(db => ({
      name: db.name,
      views: [
        db.type,
        ...(db.type === 'table' ? ['calendar', 'gallery'] :
          db.type === 'calendar' ? ['table', 'list'] :
          db.type === 'gallery' ? ['table', 'list'] :
          db.type === 'list' ? ['table', 'calendar'] :
          ['table', 'calendar'])
      ],
      properties: db.properties
    }));

    // Generate widget implementations
    const widgets = [
      {
        type: 'Quick Actions',
        purpose: 'Access frequently used functions',
        placement: 'Top of dashboard',
        implementation: `1. Create a new callout block at the top of your dashboard
2. Add button blocks for each quick action
3. Link each button to its corresponding page or database
4. Style buttons using your chosen color scheme
5. Test each action to ensure proper functionality`
      },
      {
        type: 'Progress Overview',
        purpose: 'Visual representation of progress',
        placement: 'Dashboard sidebar',
        implementation: `1. Add a new database view block
2. Select 'Gallery' view type
3. Configure progress property as primary display
4. Add progress bar visualization
5. Set up automatic calculations for progress tracking`
      },
      {
        type: 'Recent Activity',
        purpose: 'Track latest updates and changes',
        placement: 'Dashboard sidebar',
        implementation: `1. Create a linked database view
2. Filter by last modified date
3. Sort by most recent first
4. Limit display to 5-10 items
5. Configure automatic refresh interval`
      }
    ];

    // Generate automation implementations
    const automations = [
      {
        trigger: 'New item is created',
        action: 'Send notification',
        description: 'Automatically notify team members when new items are added',
        implementation: `1. Open the database settings
2. Navigate to the Automations tab
3. Create new automation with "When new item is created" trigger
4. Add "Send notification" action
5. Configure notification recipients and message template
6. Test the automation with a sample item`
      },
      {
        trigger: 'Due date approaches',
        action: 'Send reminder',
        description: 'Send reminders for upcoming deadlines',
        implementation: `1. Set up a new automation
2. Choose "When date property is within X days" trigger
3. Configure reminder message template
4. Set reminder frequency and conditions
5. Add conditional logic for different deadline types
6. Test with various due dates`
      },
      {
        trigger: 'Status changes',
        action: 'Update related items',
        description: 'Automatically update dependent tasks or items',
        implementation: `1. Create new automation
2. Select "When status changes" trigger
3. Add conditions for specific status changes
4. Configure related item updates
5. Set up proper relationships between items
6. Test with sample status changes`
      }
    ];

    // Generate embed configurations
    const embeds = [
      {
        type: 'Calendar Integration',
        purpose: 'Sync with external calendar services',
        setup: [
          'Enable calendar sync in settings',
          'Configure calendar permissions',
          'Set up two-way sync options',
          'Test calendar event creation'
        ]
      },
      {
        type: 'File Storage',
        purpose: 'Connect to cloud storage services',
        setup: [
          'Configure storage provider connection',
          'Set up file access permissions',
          'Enable automatic file organization',
          'Test file upload and retrieval'
        ]
      }
    ];

    // API integration details
    const apiIntegration = {
      endpoint: 'https://api.notion.com/v1/databases/{database_id}',
      method: 'PATCH',
      permissions: [
        'Read database content',
        'Update database properties',
        'Create new pages',
        'Manage automations'
      ],
      rateLimit: '3 requests per second per integration',
      documentation: 'https://developers.notion.com/reference/intro'
    };

    return new Response(
      JSON.stringify({
        structure,
        databases,
        widgets,
        automations,
        embeds,
        apiIntegration
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});