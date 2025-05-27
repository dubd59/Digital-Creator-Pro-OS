import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface InvitePayload {
  projectId: number;
  projectTitle: string;
  emails: string[];
  invitedBy: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { projectId, projectTitle, emails, invitedBy }: InvitePayload = await req.json();

    // Send emails to each recipient
    const emailPromises = emails.map(async (email) => {
      const { error } = await supabase
        .from('project_invites')
        .insert([
          {
            project_id: projectId,
            email,
            invited_by: invitedBy,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      // Send the email using Supabase's built-in email service
      const { error: emailError } = await supabase.auth.admin.sendRawEmail({
        to: email,
        subject: `You've been invited to collaborate on ${projectTitle}`,
        html: `
          <h2>Project Invitation</h2>
          <p>You've been invited by ${invitedBy} to collaborate on ${projectTitle}.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${Deno.env.get('PUBLIC_SITE_URL')}/projects/${projectId}">
            Accept Invitation
          </a>
        `
      });

      if (emailError) throw emailError;
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ message: 'Invitations sent successfully' }),
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