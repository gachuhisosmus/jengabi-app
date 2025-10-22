import React, { useState, useEffect, useContext } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { analyticsService } from '../services/analyticsService'
import { 
  TrendingUp, 
  Users,  // ✅ ADD THIS - it's missing!
  Eye, 
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Filter,
  Download,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react'

const Analytics = () => {
  const { user, supabase } = useSupabase()
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('engagement')
  const [loading, setLoading] = useState(true)

  const colors = {
    primary: '#3B82F6',
    primaryDark: '#1D4ED8',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '24px'
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    button: {
      primary: {
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      },
      secondary: {
        backgroundColor: colors.card,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }
    }
  }

  // Remove the mock data state and use this instead:
  const [analyticsData, setAnalyticsData] = useState({
    overview: { totalFollowers: 0, engagementRate: 0, reach: 0, impressions: 0 },
    platformPerformance: [],
    growthData: [],
    contentPerformance: []
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange, user])

  const loadAnalyticsData = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const [overview, platformPerformance, growthData, contentPerformance] = await Promise.all([
        analyticsService.getOverviewMetrics(user.id, timeRange),
        analyticsService.getPlatformPerformance(user.id),
        analyticsService.getGrowthData(user.id, timeRange),
        analyticsService.getContentPerformance(user.id, timeRange)
      ])

      setAnalyticsData({
        overview,
        platformPerformance,
        growthData,
        contentPerformance
      })
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update your metricCards to use real data
  const metricCards = [
    {
      title: 'Total Followers',
      value: analyticsData.overview.totalFollowers.toLocaleString(),
      change: '+12.5%', // We'll calculate this from real growth data later
      trend: 'up',
      icon: Users,
      color: colors.primary
    },
    {
      title: 'Engagement Rate',
      value: `${analyticsData.overview.engagementRate}%`,
      change: '+0.8%',
      trend: 'up',
      icon: Heart,
      color: colors.success
    },
    {
      title: 'Reach',
      value: analyticsData.overview.reach.toLocaleString(),
      change: '+18.3%',
      trend: 'up',
      icon: Eye,
      color: colors.warning
    },
    {
      title: 'Impressions',
      value: analyticsData.overview.impressions.toLocaleString(),
      change: '+22.1%',
      trend: 'up',
      icon: Share2,
      color: colors.error
    }
  ]

  // Rest of your component remains exactly the same...

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: Instagram,
      facebook: Facebook,
      tiktok: Share2,
      twitter: Twitter,
      youtube: Youtube
    }
    return icons[platform] || Share2
  }

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: '#E4405F',
      facebook: '#1877F2',
      tiktok: '#000000',
      twitter: '#1DA1F2',
      youtube: '#FF0000'
    }
    return colors[platform] || colors.primary
  }

  const SimpleBarChart = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map(item => item.value))
    
    return (
      <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: `${height}px`, padding: '20px 0' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                height: `${(item.value / maxValue) * 80}%`,
                backgroundColor: item.color,
                borderRadius: '4px 4px 0 0',
                width: '100%',
                minHeight: '4px',
                transition: 'all 0.3s ease'
              }}
            />
            <div style={{ fontSize: '12px', color: colors.textLight, marginTop: '8px', textAlign: 'center' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginTop: '4px' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const SimpleLineChart = ({ data, height = 200 }) => {
    const values = data.map(item => item.value)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    
    return (
      <div style={{ position: 'relative', height: `${height}px`, padding: '20px 0' }}>
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              y1={height * ratio}
              x2="100%"
              y2={height * ratio}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Data line */}
          <polyline
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            points={data.map((item, index) => 
              `${(index / (data.length - 1)) * 100},${height - ((item.value - minValue) / (maxValue - minValue)) * height * 0.8}`
            ).join(' ')}
          />
          
          {/* Data points */}
          {data.map((item, index) => (
            <circle
              key={index}
              cx={`${(index / (data.length - 1)) * 100}%`}
              cy={height - ((item.value - minValue) / (maxValue - minValue)) * height * 0.8}
              r="4"
              fill={colors.primary}
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ fontSize: '12px', color: colors.textLight, textAlign: 'center' }}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `3px solid ${colors.border}`,
            borderTop: `3px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <h3 style={{ color: colors.text, margin: '0 0 8px 0' }}>Loading Analytics...</h3>
          <p style={{ color: colors.textLight, margin: 0 }}>Crunching the numbers for you</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.text, margin: '0 0 8px 0' }}>
              Analytics Dashboard
            </h1>
            <p style={{ fontSize: '16px', color: colors.textLight, margin: 0 }}>
              Track your performance and optimize your content strategy
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: colors.card
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button style={styles.button.secondary}>
              <Filter size={16} />
              Filter
            </button>
            <button style={styles.button.secondary}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {metricCards.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} style={styles.card}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: `${metric.color}20`
                    }}>
                      <Icon size={20} color={metric.color} />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: metric.trend === 'up' ? colors.success : colors.error,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {metric.trend === 'up' ? '↗' : '↘'} {metric.change}
                    </span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text, marginBottom: '4px' }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: '14px', color: colors.textLight }}>
                    {metric.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Growth Chart */}
          <div style={styles.card}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: 0 }}>
                  Audience Growth
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedMetric('followers')}
                    style={{
                      ...styles.button.secondary,
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: selectedMetric === 'followers' ? colors.primary : colors.card,
                      color: selectedMetric === 'followers' ? 'white' : colors.text
                    }}
                  >
                    Followers
                  </button>
                  <button
                    onClick={() => setSelectedMetric('engagement')}
                    style={{
                      ...styles.button.secondary,
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: selectedMetric === 'engagement' ? colors.primary : colors.card,
                      color: selectedMetric === 'engagement' ? 'white' : colors.text
                    }}
                  >
                    Engagement
                  </button>
                </div>
              </div>
              <SimpleLineChart
                data={analyticsData.growthData.map(item => ({
                  label: item.date.split(' ')[1],
                  value: selectedMetric === 'followers' ? item.followers : item.engagement
                }))}
                height={300}
              />
            </div>
          </div>

          {/* Platform Performance */}
          <div style={styles.card}>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: '0 0 20px 0' }}>
                Platform Performance
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analyticsData.platformPerformance.map((platform, index) => {
                  const PlatformIcon = getPlatformIcon(platform.platform)
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: colors.background,
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: `${getPlatformColor(platform.platform)}20`
                        }}>
                          <PlatformIcon size={16} color={getPlatformColor(platform.platform)} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, textTransform: 'capitalize' }}>
                            {platform.platform}
                          </div>
                          <div style={{ fontSize: '12px', color: colors.textLight }}>
                            {platform.followers.toLocaleString()} followers
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.success }}>
                          {platform.engagement}%
                        </div>
                        <div style={{ fontSize: '12px', color: colors.textLight }}>
                          +{platform.growth}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Content Performance */}
          <div style={styles.card}>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: '0 0 20px 0' }}>
                Content Performance
              </h2>
              <SimpleBarChart
                data={analyticsData.contentPerformance.map(item => ({
                  label: item.type,
                  value: item.engagement,
                  color: colors.primary
                }))}
                height={200}
              />
            </div>
          </div>

          {/* Engagement Metrics */}
          <div style={styles.card}>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: '0 0 20px 0' }}>
                Engagement Breakdown
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { metric: 'Likes', value: 12540, change: '+15%', icon: Heart },
                  { metric: 'Comments', value: 3240, change: '+8%', icon: MessageCircle },
                  { metric: 'Shares', value: 1560, change: '+22%', icon: Share2 },
                  { metric: 'Saves', value: 2890, change: '+31%', icon: Share2 }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: colors.background,
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={16} color={colors.primary} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>
                          {item.metric}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                          {item.value.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: colors.success }}>
                          {item.change}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div style={{ ...styles.card, marginTop: '24px' }}>
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: '0 0 16px 0' }}>
              AI Performance Recommendations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: `${colors.success}10`,
                borderRadius: '8px',
                border: `1px solid ${colors.success}30`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={16} color={colors.success} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>Top Performing</span>
                </div>
                <p style={{ fontSize: '14px', color: colors.text, margin: 0 }}>
                  Reels are driving 3x more engagement than other content types. Create more video content.
                </p>
              </div>
              
              <div style={{
                padding: '16px',
                backgroundColor: `${colors.primary}10`,
                borderRadius: '8px',
                border: `1px solid ${colors.primary}30`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Calendar size={16} color={colors.primary} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>Best Time to Post</span>
                </div>
                <p style={{ fontSize: '14px', color: colors.text, margin: 0 }}>
                  Post between 7-9 PM for maximum reach. Your audience is most active during these hours.
                </p>
              </div>
              
              <div style={{
                padding: '16px',
                backgroundColor: `${colors.warning}10`,
                borderRadius: '8px',
                border: `1px solid ${colors.warning}30`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Users size={16} color={colors.warning} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>Audience Insight</span>
                </div>
                <p style={{ fontSize: '14px', color: colors.text, margin: 0 }}>
                  68% of your audience is aged 18-34. Consider creating content that resonates with this demographic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default Analytics