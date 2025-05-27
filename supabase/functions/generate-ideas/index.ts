import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

interface ContentRequest {
  prompt: string;
  selectedIdea?: string;
  voice?: string;
}

const getHumorousContent = (idea: string, prompt: string): PlatformContent => ({
  twitter: {
    content: `🐕 Breaking Pup News: Local dog discovers ${prompt} is actually just an excuse for more belly rubs!\n\nSources say tail wagging increased by 1000%! No complaints filed... except for the cat 😸\n\nWho else's furry friend is living their best life? 🦮`,
    hashtags: ['#DogLife', '#PawsomeMoments', '#HappyPups', '#DogsOfTwitter'],
  },
  facebook: {
    content: `🐾 ATTENTION: This is not a drill! ${prompt} just broke the cuteness meter!\n\n🦴 Side effects include:\n• Uncontrollable "awwwws"\n• Excessive treat giving\n• Spontaneous belly rub sessions\n• Chronic happiness\n\nWarning: May cause extreme joy and random happy dances with your fur baby! 🐕`,
    imagePrompt: 'Happy dog playing with toys and smiling',
  },
  instagram: {
    content: `🌟 When your ${prompt} game is so strong, even the mailman stops to play!\n\n🎯 Pro tip: If your dog isn't giving you the "best human ever" look, you're doing it wrong!\n\nSwipe for more pawsome moments! 🐾✨`,
    hashtags: ['#DogsOfInstagram', '#PuppyLove', '#DogLife', '#HappyDogs', '#PawfectDay'],
    imagePrompt: 'Playful dog with a big smile and wagging tail',
  },
  linkedin: {
    content: `🐕 Scientific Discovery: ${prompt} proven to be the leading cause of happiness!\n\nBreaking Research:\n• Tail wags per minute: Infinite\n• Smile factor: Over 9000\n• Joy levels: Through the woof!\n\nP.S. No tennis balls were harmed in this study! 🎾`,
    hashtags: ['#DogLovers', '#PawsitiveMoments', '#HappyLife'],
    callToAction: "Double tap if your dog is your best coworker! 🐾",
  }
});

const getProfessionalContent = (idea: string, prompt: string): PlatformContent => ({
  twitter: {
    content: `🐕 ${idea}\n\nKey insight: ${prompt}\n\nShare your experiences below! 🐾`,
    hashtags: ['#DogCare', '#PetLife', '#DogLovers'],
  },
  facebook: {
    content: `🐾 ${idea}\n\n${prompt} brings joy to our lives. Here's why:\n\n• Unconditional love\n• Endless happiness\n• Pure companionship\n\nWhat's your favorite moment with your furry friend? 💝`,
    imagePrompt: 'Professional photo of a happy dog outdoors',
  },
  instagram: {
    content: `✨ ${idea}\n\n${prompt} makes every day better! 🐕\n\nSwipe ➡️ to see more joy!\n\nDouble tap if your dog makes you smile! 🐾`,
    hashtags: ['#DogLife', '#PetLove', '#DogCare', '#PawfectMoments'],
    imagePrompt: 'Heartwarming moment between dog and owner',
  },
  linkedin: {
    content: `🎯 ${idea}\n\nLet me share how ${prompt} brings happiness to our lives.\n\nKey Benefits:\n• Daily joy\n• Stress relief\n• Unconditional love\n\nWhat's your experience with furry friends? Share below! 💭`,
    hashtags: ['#DogLovers', '#PetLife', '#JoyfulMoments'],
    callToAction: 'Share your favorite pet moment in the comments!',
  }
});

const getCasualContent = (idea: string, prompt: string): PlatformContent => ({
  twitter: {
    content: `Hey dog lovers! 👋 Check this out:\n\n${prompt} just made my day! Here's why... 🐕\n\nAnyone else's pup doing this? Share your stories! 🐾`,
    hashtags: ['#DogLife', '#PuppyLove', '#PawsomeMoments'],
  },
  facebook: {
    content: `Hey friends! 🐾\n\nJust had to share this adorable moment with ${prompt}...\n\nReal talk:\n• Pure joy\n• So much love\n• Endless cuteness\n\nWho else has stories to share? 🐕`,
    imagePrompt: 'Candid moment of dog happiness',
  },
  instagram: {
    content: `✌️ Living our best life with ${prompt}\n\nNo filters needed - just pure happiness!\n\nTap through for more cuteness 👉\n\nDrop a ❤️ if your dog makes you smile!`,
    hashtags: ['#DogLife', '#PuppyLove', '#HappyDogs', '#PawfectMoments'],
    imagePrompt: 'Natural, joyful moment with a dog',
  },
  linkedin: {
    content: `Hey pet lovers! 👋\n\nCan we talk about ${prompt} for a moment?\n\nHere's what makes it special:\n• Pure happiness\n• Endless love\n• Daily adventures\n\nWhat's your favorite pet story? Let's share! 💬`,
    hashtags: ['#DogLovers', '#PetLife', '#JoyfulMoments'],
    callToAction: "Share your favorite pet memory - let's spread some joy!",
  }
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, selectedIdea, voice = 'professional' }: ContentRequest = await req.json();

    // Initial ideas generation
    if (!selectedIdea) {
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        throw new Error('Invalid prompt provided - prompt must be a non-empty string');
      }

      // Generate initial content ideas based on voice
      const ideas = voice === 'humorous' ? [
        `Why ${prompt} deserve an Oscar for "Best Drama Queen" during bath time 🛁`,
        `Breaking News: ${prompt} discovers belly rubs are the secret to world peace! 🌍`,
        `The secret life of ${prompt}: When humans aren't looking 👀`,
        `If ${prompt} wrote a self-help book: "How to Train Your Human" 📚`,
        `Confessions of a ${prompt}: "I only pretend to not know where the treats are!" 🦴`
      ] : voice === 'casual' ? [
        `Just another day with ${prompt} - pure joy! 🐾`,
        `The best thing about ${prompt}? Everything! ❤️`,
        `Life lessons from ${prompt} - keeping it real`,
        `Weekend adventures with ${prompt}`,
        `${prompt} being their adorable self again!`
      ] : [
        `The joy of sharing life with ${prompt}`,
        `Creating precious moments with ${prompt}`,
        `Understanding the unique personality of ${prompt}`,
        `Daily adventures: Life with ${prompt}`,
        `Building lasting bonds with ${prompt}`
      ];

      return new Response(
        JSON.stringify({ ideas }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate platform-specific content based on voice
    let platformContent: PlatformContent;
    switch (voice) {
      case 'humorous':
        platformContent = getHumorousContent(selectedIdea, prompt);
        break;
      case 'casual':
        platformContent = getCasualContent(selectedIdea, prompt);
        break;
      default:
        platformContent = getProfessionalContent(selectedIdea, prompt);
    }

    return new Response(
      JSON.stringify({ platformContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});