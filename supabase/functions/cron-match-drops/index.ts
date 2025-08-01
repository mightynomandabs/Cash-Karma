import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the match_pending_drops function
    const { data: matchedCount, error: matchError } = await supabase.rpc('match_pending_drops')

    if (matchError) {
      throw new Error(`Error matching drops: ${matchError.message}`)
    }

    // Log the results
    console.log(`CRON job completed: ${matchedCount} drops matched`)

    return new Response(
      JSON.stringify({ 
        message: 'CRON job completed successfully',
        matched_count: matchedCount,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in CRON job:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'CRON job failed' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}) 