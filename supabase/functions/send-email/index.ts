import { createClient } from "npm:@supabase/supabase-js@2.40.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface EmailPayload {
  to: string[];
  subject: string;
  content: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { to, subject, content, scheduledDate, scheduledTime }: EmailPayload = await req.json();

    if (!to || !Array.isArray(to) || to.length === 0) {
      throw new Error('Recipients are required');
    }

    if (!subject || !content) {
      throw new Error('Subject and content are required');
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = to.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      throw new Error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
    }

    // If scheduledDate and scheduledTime are provided, save to scheduled_emails table
    if (scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      const now = new Date();

      if (scheduledDateTime > now) {
        const { error: dbError } = await supabase
          .from('scheduled_emails')
          .insert([
            {
              recipients: to,
              subject,
              content,
              scheduled_date: scheduledDateTime.toISOString(),
              status: 'pending'
            }
          ]);

        if (dbError) throw dbError;

        return new Response(
          JSON.stringify({ 
            message: 'Email scheduled successfully',
            scheduledFor: scheduledDateTime.toISOString()
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
    }

    // Send emails immediately using Supabase's built-in email service
    const emailPromises = to.map(async (recipient) => {
      const { error: emailError } = await supabase.auth.admin.sendEmail(recipient, {
        subject,
        template: 'custom',
        variables: {
          content,
        }
      });

      if (emailError) throw emailError;

      return recipient;
    });

    const sentTo = await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ 
        message: 'Emails sent successfully',
        sentTo
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);

    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred while sending the email'
      }),
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