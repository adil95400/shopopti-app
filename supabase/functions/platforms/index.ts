// Follow Deno best practices for Edge Functions
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { userId, platforms, types } = await req.json()
    
    if (!userId) {
      throw new Error('User ID is required')
    }
    
    // Get user's platform connections
    const { data: connections, error: connectionsError } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
    
    if (connectionsError) {
      throw connectionsError
    }
    
    // Filter platforms if specified
    let platformsToSync = connections
    if (platforms && platforms.length > 0) {
      platformsToSync = connections.filter(conn => platforms.includes(conn.platform_id))
    }
    
    if (platformsToSync.length === 0) {
      throw new Error('No active platforms to synchronize')
    }
    
    // Get sync settings
    const { data: settings, error: settingsError } = await supabase
      .from('sync_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError
    }
    
    // Determine what to sync
    const syncTypes = types || []
    if (syncTypes.length === 0) {
      // Use settings or default to all types
      if (settings) {
        if (settings.sync_inventory) syncTypes.push('inventory')
        if (settings.sync_prices) syncTypes.push('prices')
        if (settings.sync_orders) syncTypes.push('orders')
        if (settings.sync_products) syncTypes.push('products')
      } else {
        syncTypes.push('inventory', 'prices', 'orders', 'products')
      }
    }
    
    // Create sync history record
    const { data: syncRecord, error: syncRecordError } = await supabase
      .from('sync_history')
      .insert({
        user_id: userId,
        type: syncTypes.length === 4 ? 'full' : syncTypes.join(','),
        status: 'in_progress',
        platforms: platformsToSync.map(p => ({
          id: p.platform_id,
          name: p.name,
          status: 'in_progress'
        })),
        items_processed: 0,
        items_succeeded: 0,
        items_failed: 0,
        duration: 0,
        initiated_by: 'api'
      })
      .select()
      .single()
    
    if (syncRecordError) {
      throw syncRecordError
    }
    
    // Start synchronization process
    // In a real implementation, this would be a background job
    // For now, we'll simulate the synchronization
    
    const startTime = Date.now()
    
    // Simulate synchronization for each platform
    const platformResults = []
    let totalProcessed = 0
    let totalSucceeded = 0
    let totalFailed = 0
    
    for (const platform of platformsToSync) {
      try {
        // Simulate platform-specific synchronization
        // In a real implementation, you would make actual API calls to each platform
        
        // Simulate some random success/failure
        const success = Math.random() > 0.2
        const itemsProcessed = Math.floor(Math.random() * 100) + 10
        const itemsSucceeded = success ? itemsProcessed : Math.floor(itemsProcessed * 0.7)
        const itemsFailed = itemsProcessed - itemsSucceeded
        
        totalProcessed += itemsProcessed
        totalSucceeded += itemsSucceeded
        totalFailed += itemsFailed
        
        platformResults.push({
          id: platform.platform_id,
          name: platform.name,
          status: success ? 'success' : 'error',
          details: success ? undefined : 'API error or rate limit exceeded'
        })
        
        // Update platform's last sync time
        await supabase
          .from('platform_connections')
          .update({
            last_sync: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', platform.id)
      } catch (error) {
        console.error(`Error syncing platform ${platform.platform_id}:`, error)
        
        platformResults.push({
          id: platform.platform_id,
          name: platform.name,
          status: 'error',
          details: error.message
        })
        
        totalFailed += 10 // Assume some failures
      }
    }
    
    const endTime = Date.now()
    const duration = Math.floor((endTime - startTime) / 1000)
    
    // Determine overall status
    let overallStatus = 'success'
    if (totalSucceeded === 0) {
      overallStatus = 'error'
    } else if (totalFailed > 0) {
      overallStatus = 'partial'
    }
    
    // Update sync history record
    await supabase
      .from('sync_history')
      .update({
        status: overallStatus,
        platforms: platformResults,
        items_processed: totalProcessed,
        items_succeeded: totalSucceeded,
        items_failed: totalFailed,
        duration,
        updated_at: new Date().toISOString()
      })
      .eq('id', syncRecord.id)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Synchronization ${overallStatus === 'success' ? 'completed successfully' : overallStatus === 'partial' ? 'partially completed' : 'failed'}`,
        details: {
          syncId: syncRecord.id,
          status: overallStatus,
          itemsProcessed: totalProcessed,
          itemsSucceeded: totalSucceeded,
          itemsFailed: totalFailed,
          duration,
          platforms: platformResults
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})