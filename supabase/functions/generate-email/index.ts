import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface EmailPrompt {
  type: 'business' | 'marketing' | 'storytelling' | 'personal' | 'newsletter';
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

function generateBusinessEmail(prompt: EmailPrompt): { subject: string; content: string } {
  const subject = `Important: ${prompt.topic} - Professional Update and Next Steps`;
  
  const greetingOptions = {
    formal: "Dear valued colleague",
    professional: "Hello",
    casual: "Hi there",
  };

  const greeting = greetingOptions[prompt.tone === 'formal' ? 'formal' : prompt.tone === 'casual' ? 'casual' : 'professional'];
  
  const content = `${greeting},

I trust this email finds you well. I am writing to provide a comprehensive update regarding ${prompt.topic}.

As we continue to evolve and adapt in our dynamic business environment, it's crucial that we address several key aspects of this matter:

1. Current Situation
   - We've carefully analyzed the current landscape
   - Our team has identified significant opportunities
   - Key stakeholders have provided valuable input

2. Strategic Implications
   - This initiative aligns perfectly with our long-term objectives
   - We've observed substantial potential for growth and innovation
   - The timing is optimal for implementation

3. Proposed Action Steps
   - Immediate implementation of core components
   - Systematic rollout across all departments
   - Regular monitoring and adjustment of strategies

4. Expected Outcomes
   - Enhanced operational efficiency
   - Improved stakeholder satisfaction
   - Measurable impact on key performance indicators

${prompt.callToAction ? `\nNext Steps: ${prompt.callToAction}\n` : ''}

I would greatly appreciate your thoughts on this matter. Please don't hesitate to reach out if you need any clarification or have suggestions to share.

Looking forward to our continued collaboration.

Best regards,
[Your Name]
[Your Position]
[Contact Information]

P.S. I've attached detailed documentation for your reference. Please review at your earliest convenience.`;

  return { subject, content };
}

function generateMarketingEmail(prompt: EmailPrompt): { subject: string; content: string } {
  const subject = `🌟 Exclusive: Transform Your ${prompt.topic} Experience Today!`;
  
  const content = `Dear ${prompt.audience},

Are you ready to revolutionize your approach to ${prompt.topic}?

🚀 Introducing a Game-Changing Opportunity

Imagine having the power to:
✨ Transform your results overnight
✨ Achieve unprecedented success
✨ Stand out from the competition

Here's What Makes This Special:

1. Unmatched Value
   • Premium features designed for your success
   • Exclusive bonuses worth over $1,000
   • Limited-time special pricing

2. Real Results
   • 95% satisfaction rate
   • Proven track record of success
   • Testimonials from industry leaders

3. Expert Support
   • 24/7 dedicated assistance
   • Personalized strategy sessions
   • Regular updates and improvements

But Don't Just Take Our Word For It...

"This completely transformed our business..." - Sarah Johnson, CEO
"The results exceeded our expectations..." - Michael Chen, Director
"A game-changer for our team..." - Emily Rodriguez, Manager

🎁 Special Bonus Offer:
Act now and receive:
• Exclusive strategy guide ($297 value)
• Private consultation session ($500 value)
• Priority support access ($200 value)

${prompt.callToAction ? `\n${prompt.callToAction}\n` : '\nClick Here to Get Started Now! →\n'}

⏰ Limited Time Offer:
This exclusive opportunity is only available for the next 48 hours!

P.S. Don't miss out on this transformative opportunity. Your success story begins here!

Best regards,
[Your Name]
[Company Name]

---
To unsubscribe, click here
[Company Address]`;

  return { subject, content };
}

function generateStoryEmail(prompt: EmailPrompt): { subject: string; content: string } {
  const subject = `A Powerful Story: How ${prompt.topic} Changed Everything`;
  
  const content = `Dear ${prompt.audience},

I want to share a story that I believe will resonate deeply with you...

${prompt.story?.core || `It was a typical Tuesday morning when everything changed. The sun had barely risen over the horizon, casting long shadows across ${prompt.topic}. Little did I know, this day would transform my entire perspective.`}

The Journey Begins...

Picture this:
• The anticipation building in the air
• A moment of truth approaching
• The unexpected twist that changed everything

${prompt.story?.emotion || "The air was thick with possibility. Every step forward felt like walking through history in the making. Hearts racing, minds focused, we knew this was more than just another day."}

The Turning Point:

What happened next was extraordinary. In that pivotal moment:
1. Reality shifted
2. Perspectives transformed
3. New possibilities emerged

The Revelation:

${prompt.story?.lesson || `Sometimes, the most profound lessons come from the most unexpected places. This experience taught us that ${prompt.topic} isn't just about the destination – it's about the journey, the growth, and the transformation along the way.`}

Key Takeaways:

1. Trust the Process
   - Every challenge has its purpose
   - Growth comes from embracing uncertainty
   - Success leaves clues

2. Embrace Change
   - Adaptation leads to innovation
   - Comfort zones limit potential
   - Progress requires courage

3. Create Impact
   - Small actions create ripples
   - Authenticity resonates
   - Legacy matters

Looking Forward:

This story isn't just about the past – it's about the future we're creating together. Every day brings new opportunities to write our own chapters, to make our own impact.

What's Your Story?

I'd love to hear how this resonates with you. What chapter are you writing in your journey?

With gratitude and anticipation,
[Your Name]

P.S. Sometimes the best stories are the ones we create together. Let's write the next chapter.`;

  return { subject, content };
}

function generatePersonalEmail(prompt: EmailPrompt): { subject: string; content: string } {
  const subject = `Personal Update: A Journey Through ${prompt.topic}`;
  
  const content = `Dear friend,

I hope this message finds you well. I've been thinking about you and wanted to share something personal that's been on my mind regarding ${prompt.topic}.

The Past Few Months...

It's amazing how life has a way of surprising us, teaching us, and helping us grow. Here's what's been happening:

• The Unexpected Journey
  - Discovering new perspectives
  - Embracing change
  - Finding strength in vulnerability

• Valuable Lessons
  - The importance of authenticity
  - The power of connection
  - The beauty of growth

• Looking Forward
  - Exciting new possibilities
  - Fresh perspectives
  - Stronger relationships

What This Means...

This experience has taught me so much about:
1. The value of true friendship
2. The importance of staying connected
3. The power of sharing our stories

I'd love to hear your thoughts and catch up soon. Perhaps we could:
• Schedule a video call
• Meet for coffee
• Plan a weekend get-together

Your friendship means the world to me, and I'm grateful for the opportunity to share this with you.

Looking forward to hearing from you!

With warmth and appreciation,
[Your Name]

P.S. Let's not let too much time pass before we connect again.`;

  return { subject, content };
}

function generateNewsletterEmail(prompt: EmailPrompt): { subject: string; content: string } {
  const subject = `📰 ${prompt.topic} - Your Monthly Insider Update`;
  
  const content = `Dear Valued Subscriber,

Welcome to your exclusive monthly update on ${prompt.topic}. We've curated the most important insights, trends, and opportunities just for you.

🌟 This Month's Highlights

1. Breaking News
   • Industry-shaking developments
   • Expert analysis and insights
   • Future predictions and trends

2. Deep Dive: Industry Trends
   • Market analysis and predictions
   • Emerging opportunities
   • Expert interviews and insights

3. Success Stories
   • Case studies from industry leaders
   • Breakthrough achievements
   • Lessons learned and best practices

4. Professional Development
   • Upcoming workshops and webinars
   • Skill-building opportunities
   • Networking events

5. Resources & Tools
   • New technology releases
   • Productivity enhancers
   • Must-read articles and books

🎯 Action Items for Success
• Implement key learnings
• Connect with industry peers
• Stay ahead of trends

📊 Market Insights
• Current market analysis
• Future predictions
• Investment opportunities

💡 Pro Tips
1. Maximize your potential
2. Stay ahead of competition
3. Optimize your strategy

📅 Upcoming Events
• Virtual conferences
• Networking sessions
• Training workshops

🔍 Featured Resources
• Downloadable guides
• Video tutorials
• Expert interviews

Thank you for being part of our community. Your growth and success are our priority.

Best regards,
[Your Name]
[Publication Name]

---
Curated with ❤️ for our valued subscribers
To update your preferences or unsubscribe, click here`;

  return { subject, content };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const prompt: EmailPrompt = await req.json();

    if (!prompt || !prompt.topic || typeof prompt.topic !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid prompt provided" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let emailContent;
    switch (prompt.type) {
      case 'business':
        emailContent = generateBusinessEmail(prompt);
        break;
      case 'marketing':
        emailContent = generateMarketingEmail(prompt);
        break;
      case 'storytelling':
        emailContent = generateStoryEmail(prompt);
        break;
      case 'personal':
        emailContent = generatePersonalEmail(prompt);
        break;
      case 'newsletter':
        emailContent = generateNewsletterEmail(prompt);
        break;
      default:
        emailContent = generateBusinessEmail(prompt);
    }

    return new Response(
      JSON.stringify(emailContent),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating email:", error);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error while generating email",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});