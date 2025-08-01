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

    // Get pending drops that need matching
    const { data: pendingDrops, error: fetchError } = await supabase
      .from('drops')
      .select('*')
      .eq('status', 'pending')
      .is('matched_id', null)
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw new Error(`Error fetching pending drops: ${fetchError.message}`)
    }

    if (!pendingDrops || pendingDrops.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No pending drops to match',
          matched_count: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    let matchedCount = 0
    const processedDrops = new Set<string>()

    // Group drops by amount for efficient matching
    const dropsByAmount = new Map<number, any[]>()
    
    pendingDrops.forEach(drop => {
      if (!dropsByAmount.has(drop.amount)) {
        dropsByAmount.set(drop.amount, [])
      }
      dropsByAmount.get(drop.amount)!.push(drop)
    })

    // Match drops within same amount brackets
    for (const [amount, drops] of dropsByAmount) {
      if (drops.length < 2) continue

      // Shuffle drops for random pairing
      const shuffledDrops = [...drops].sort(() => Math.random() - 0.5)
      
      for (let i = 0; i < shuffledDrops.length - 1; i += 2) {
        const drop1 = shuffledDrops[i]
        const drop2 = shuffledDrops[i + 1]

        // Skip if already processed or same sender
        if (processedDrops.has(drop1.id) || processedDrops.has(drop2.id) || 
            drop1.sender_id === drop2.sender_id) {
          continue
        }

        // Update both drops as matched
        const { error: updateError1 } = await supabase
          .from('drops')
          .update({ 
            status: 'matched', 
            matched_id: drop2.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', drop1.id)

        const { error: updateError2 } = await supabase
          .from('drops')
          .update({ 
            status: 'matched', 
            matched_id: drop1.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', drop2.id)

        if (updateError1 || updateError2) {
          console.error('Error updating drops:', updateError1 || updateError2)
          continue
        }

        // Mark as processed
        processedDrops.add(drop1.id)
        processedDrops.add(drop2.id)
        matchedCount++

        // Log successful match
        console.log(`Matched drops: ${drop1.id} <-> ${drop2.id} (Amount: ${amount})`)
      }
    }

    // Update user statistics for matched drops
    if (matchedCount > 0) {
      await updateUserStatistics(supabase)
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully matched ${matchedCount} drop pairs`,
        matched_count: matchedCount,
        total_pending: pendingDrops.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in match-drops function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Failed to match drops' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function updateUserStatistics(supabase: any) {
  try {
    // Update user profiles with latest statistics
    const { error } = await supabase.rpc('update_user_statistics')
    if (error) {
      console.error('Error updating user statistics:', error)
    }
  } catch (error) {
    console.error('Error in updateUserStatistics:', error)
  }
} 