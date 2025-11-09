import { supabase } from '../contexts/SupabaseContext'

export const analyticsService = {
  // Get overview metrics
  async getOverviewMetrics(userId, timeRange = '7d') {
    try {
      const totalFollowers = await this.calculateTotalFollowers(userId)
      const engagementRate = await this.calculateEngagementRate(userId, timeRange)
      const reach = await this.calculateReach(userId, timeRange)
      const impressions = await this.calculateImpressions(userId, timeRange)

      return {
        totalFollowers,
        engagementRate,
        reach,
        impressions
      }
    } catch (error) {
      console.error('Error getting overview metrics:', error)
      return {
        totalFollowers: 0,
        engagementRate: 0,
        reach: 0,
        impressions: 0
      }
    }
  },

  // Calculate total followers across all platforms
  async calculateTotalFollowers(userId) {
    const { data, error } = await supabase
      .from('social_platforms')
      .select('followers')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error calculating followers:', error)
      return 0
    }
    
    return data.reduce((sum, platform) => sum + (platform.followers || 0), 0)
  },

  // Calculate average engagement rate
  async calculateEngagementRate(userId, timeRange) {
    const { data, error } = await supabase
      .from('content_tasks')
      .select('engagement_rate')
      .eq('user_id', userId)
      .gte('created_at', this.getDateRange(timeRange))
      .not('engagement_rate', 'is', null)

    if (error || !data.length) return 0

    const totalEngagement = data.reduce((sum, item) => sum + (item.engagement_rate || 0), 0)
    return Number((totalEngagement / data.length).toFixed(1))
  },

  // Calculate total reach
  async calculateReach(userId, timeRange) {
    const { data, error } = await supabase
      .from('content_tasks')
      .select('reach')
      .eq('user_id', userId)
      .gte('created_at', this.getDateRange(timeRange))

    if (error) return 0

    return data.reduce((sum, item) => sum + (item.reach || 0), 0)
  },

  // Calculate total impressions
  async calculateImpressions(userId, timeRange) {
    const { data, error } = await supabase
      .from('content_tasks')
      .select('impressions')
      .eq('user_id', userId)
      .gte('created_at', this.getDateRange(timeRange))

    if (error) return 0

    return data.reduce((sum, item) => sum + (item.impressions || 0), 0)
  },

  // Get platform performance
  async getPlatformPerformance(userId) {
    const { data, error } = await supabase
      .from('social_platforms')
      .select('platform, followers, engagement_rate, growth_rate')
      .eq('user_id', userId)

    if (error) {
      console.error('Error getting platform performance:', error)
      return []
    }

    return data.map(platform => ({
      platform: platform.platform,
      followers: platform.followers || 0,
      engagement: platform.engagement_rate || 0,
      growth: platform.growth_rate || 0
    }))
  },

  // Get growth data (simplified - you'll enhance this later)
  async getGrowthData(userId, timeRange) {
    // For now, return mock data structure - we'll implement real time-series later
    const baseFollowers = await this.calculateTotalFollowers(userId)
    return this.generateMockGrowthData(baseFollowers, timeRange)
  },

  // Get content performance
  async getContentPerformance(userId, timeRange) {
    const { data, error } = await supabase
      .from('content_tasks')
      .select('type, engagement_rate, reach')
      .eq('user_id', userId)
      .gte('created_at', this.getDateRange(timeRange))

    if (error) return []

    return this.aggregateContentPerformance(data)
  },

  // Helper methods
  getDateRange(timeRange) {
    const ranges = {
      '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
    return ranges[timeRange] || ranges['7d']
  },

  aggregateContentPerformance(contentData) {
    const performanceByType = {}
    
    contentData.forEach(item => {
      if (!performanceByType[item.type]) {
        performanceByType[item.type] = {
          count: 0,
          totalEngagement: 0,
          totalReach: 0
        }
      }
      
      performanceByType[item.type].count++
      performanceByType[item.type].totalEngagement += item.engagement_rate || 0
      performanceByType[item.type].totalReach += item.reach || 0
    })

    return Object.entries(performanceByType).map(([type, data]) => ({
      type,
      count: data.count,
      engagement: Number((data.totalEngagement / data.count).toFixed(1)),
      reach: data.totalReach
    }))
  },

  generateMockGrowthData(baseFollowers, timeRange) {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const data = []
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        followers: Math.max(100, baseFollowers - (days - i) * 10),
        engagement: 2 + Math.random() * 6
      })
    }
    
    return data
  }
}