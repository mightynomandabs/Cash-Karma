import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type Drop = Database['public']['Tables']['drops']['Row']

export interface DropMatch {
  drop1: Drop
  drop2: Drop
  amount: number
  matchedAt: string
}

export class DropMatchingService {
  private static instance: DropMatchingService

  private constructor() {}

  static getInstance(): DropMatchingService {
    if (!DropMatchingService.instance) {
      DropMatchingService.instance = new DropMatchingService()
    }
    return DropMatchingService.instance
  }

  async getPendingDrops(): Promise<Drop[]> {
    const { data: drops, error } = await supabase
      .from('drops')
      .select('*')
      .eq('status', 'pending')
      .is('matched_id', null)
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Error fetching pending drops: ${error.message}`)
    return drops || []
  }

  async getMatchedDrops(): Promise<DropMatch[]> {
    const { data: drops, error } = await supabase
      .from('drops')
      .select('*')
      .eq('status', 'matched')
      .not('matched_id', 'is', null)
      .order('updated_at', { ascending: false })

    if (error) throw new Error(`Error fetching matched drops: ${error.message}`)

    // Group drops into pairs
    const matches: DropMatch[] = []
    const processedDrops = new Set<string>()

    for (const drop of drops || []) {
      if (processedDrops.has(drop.id)) continue

      const matchedDrop = drops?.find(d => d.id === drop.matched_id)
      if (matchedDrop && !processedDrops.has(matchedDrop.id)) {
        matches.push({
          drop1: drop,
          drop2: matchedDrop,
          amount: drop.amount,
          matchedAt: drop.updated_at
        })
        processedDrops.add(drop.id)
        processedDrops.add(matchedDrop.id)
      }
    }

    return matches
  }

  async getDropStatus(dropId: string): Promise<{
    status: string
    matchedDrop?: Drop
    estimatedMatchTime?: string
  }> {
    const { data: drop, error } = await supabase
      .from('drops')
      .select('*')
      .eq('id', dropId)
      .single()

    if (error) throw new Error(`Error fetching drop: ${error.message}`)

    if (!drop) throw new Error('Drop not found')

    let matchedDrop: Drop | undefined
    if (drop.matched_id) {
      const { data: matched } = await supabase
        .from('drops')
        .select('*')
        .eq('id', drop.matched_id)
        .single()
      matchedDrop = matched || undefined
    }

    // Calculate estimated match time for pending drops
    let estimatedMatchTime: string | undefined
    if (drop.status === 'pending') {
      const { data: similarDrops } = await supabase
        .from('drops')
        .select('created_at')
        .eq('amount', drop.amount)
        .eq('status', 'pending')
        .neq('sender_id', drop.sender_id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (similarDrops && similarDrops.length > 0) {
        // Estimate based on recent activity
        const avgTimeBetweenDrops = this.calculateAverageTimeBetweenDrops(similarDrops)
        const estimatedMinutes = Math.max(5, Math.min(30, avgTimeBetweenDrops))
        estimatedMatchTime = new Date(Date.now() + estimatedMinutes * 60 * 1000).toISOString()
      }
    }

    return {
      status: drop.status,
      matchedDrop,
      estimatedMatchTime
    }
  }

  private calculateAverageTimeBetweenDrops(drops: any[]): number {
    if (drops.length < 2) return 15 // Default 15 minutes

    let totalTime = 0
    for (let i = 0; i < drops.length - 1; i++) {
      const time1 = new Date(drops[i].created_at).getTime()
      const time2 = new Date(drops[i + 1].created_at).getTime()
      totalTime += Math.abs(time2 - time1)
    }

    return Math.round(totalTime / (drops.length - 1) / (1000 * 60)) // Convert to minutes
  }

  async getDropStatistics(): Promise<{
    totalDrops: number
    pendingDrops: number
    matchedDrops: number
    completedDrops: number
    averageMatchTime: number
  }> {
    const { data: drops, error } = await supabase
      .from('drops')
      .select('status, created_at, updated_at')

    if (error) throw new Error(`Error fetching drop statistics: ${error.message}`)

    const stats = {
      totalDrops: 0,
      pendingDrops: 0,
      matchedDrops: 0,
      completedDrops: 0,
      averageMatchTime: 0
    }

    const matchTimes: number[] = []

    for (const drop of drops || []) {
      stats.totalDrops++
      
      switch (drop.status) {
        case 'pending':
          stats.pendingDrops++
          break
        case 'matched':
          stats.matchedDrops++
          break
        case 'completed':
          stats.completedDrops++
          // Calculate match time for completed drops
          if (drop.created_at && drop.updated_at) {
            const createdTime = new Date(drop.created_at).getTime()
            const updatedTime = new Date(drop.updated_at).getTime()
            const matchTime = (updatedTime - createdTime) / (1000 * 60) // Convert to minutes
            matchTimes.push(matchTime)
          }
          break
      }
    }

    if (matchTimes.length > 0) {
      stats.averageMatchTime = Math.round(
        matchTimes.reduce((sum, time) => sum + time, 0) / matchTimes.length
      )
    }

    return stats
  }

  async getUserDrops(userId: string): Promise<{
    sent: Drop[]
    received: Drop[]
    pending: Drop[]
    matched: Drop[]
  }> {
    const { data: drops, error } = await supabase
      .from('drops')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Error fetching user drops: ${error.message}`)

    const userDrops = {
      sent: [] as Drop[],
      received: [] as Drop[],
      pending: [] as Drop[],
      matched: [] as Drop[]
    }

    for (const drop of drops || []) {
      if (drop.sender_id === userId) {
        userDrops.sent.push(drop)
        if (drop.status === 'pending') {
          userDrops.pending.push(drop)
        } else if (drop.status === 'matched') {
          userDrops.matched.push(drop)
        }
      } else if (drop.receiver_id === userId) {
        userDrops.received.push(drop)
      }
    }

    return userDrops
  }

  async cancelDrop(dropId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Check if drop belongs to user and is still pending
    const { data: drop, error: fetchError } = await supabase
      .from('drops')
      .select('*')
      .eq('id', dropId)
      .eq('sender_id', user.id)
      .eq('status', 'pending')
      .single()

    if (fetchError || !drop) {
      throw new Error('Drop not found or cannot be cancelled')
    }

    // Update drop status to cancelled
    const { error: updateError } = await supabase
      .from('drops')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', dropId)

    if (updateError) {
      throw new Error(`Error cancelling drop: ${updateError.message}`)
    }
  }

  async getAmountBrackets(): Promise<{
    amount: number
    pendingCount: number
    estimatedWaitTime: number
  }[]> {
    const { data: drops, error } = await supabase
      .from('drops')
      .select('amount, created_at')
      .eq('status', 'pending')
      .order('amount', { ascending: true })

    if (error) throw new Error(`Error fetching amount brackets: ${error.message}`)

    const brackets = new Map<number, { count: number; recentDrops: any[] }>()

    for (const drop of drops || []) {
      if (!brackets.has(drop.amount)) {
        brackets.set(drop.amount, { count: 0, recentDrops: [] })
      }
      
      const bracket = brackets.get(drop.amount)!
      bracket.count++
      
      // Keep track of recent drops for time estimation
      const dropTime = new Date(drop.created_at).getTime()
      const oneHourAgo = Date.now() - (60 * 60 * 1000)
      
      if (dropTime > oneHourAgo) {
        bracket.recentDrops.push(drop)
      }
    }

    return Array.from(brackets.entries()).map(([amount, data]) => ({
      amount,
      pendingCount: data.count,
      estimatedWaitTime: this.calculateEstimatedWaitTime(data.recentDrops.length, data.count)
    }))
  }

  private calculateEstimatedWaitTime(recentDrops: number, totalPending: number): number {
    // Simple estimation based on recent activity and pending count
    if (recentDrops === 0) return 30 // Default 30 minutes if no recent activity
    
    const dropsPerHour = recentDrops
    const estimatedHours = totalPending / dropsPerHour
    
    return Math.max(5, Math.min(60, Math.round(estimatedHours * 60))) // Return minutes, between 5-60
  }
}

export const dropMatchingService = DropMatchingService.getInstance() 