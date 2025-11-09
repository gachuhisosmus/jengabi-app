import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Lightbulb, 
  FileText, 
  BarChart3, 
  User,
  Menu,
  X,
  Zap,
  Search,
  Bell,
  Brain // 🆕 ADDED THIS IMPORT
} from 'lucide-react'
import UserMenu from './UserMenu'
import { useSupabase } from '../contexts/SupabaseContext' // Add this import

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { signOut } = useSupabase() // Add this to get signOut function

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    let logoutTimer

    const handleAutoLogout = async () => {
      console.log('🔄 Auto-logging out due to inactivity')
      try {
        await signOut()
      } catch (error) {
        console.error('Auto-logout error:', error)
      }
    }

    const resetTimer = () => {
      // Clear existing timer
      if (logoutTimer) {
        clearTimeout(logoutTimer)
      }
      
      // Set new timer for 30 minutes
      logoutTimer = setTimeout(handleAutoLogout, 30 * 60 * 1000) // 30 minutes
    }

    // Events that reset the timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer)
    })

    // Start the initial timer
    resetTimer()

    // Cleanup function
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer)
      }
      // Remove event listeners
      events.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
    }
  }, [signOut]) // Add signOut as dependency

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, description: 'Business overview' },
    { name: 'Business Intelligence', href: '/business-intelligence', icon: Brain, description: 'AI insights & strategy' }, // 🆕 ADDED THIS LINE
    { name: 'Marketing Ideas', href: '/marketing', icon: Lightbulb, description: 'AI content generation' },
    { name: 'Content Manager', href: '/content', icon: FileText, description: 'Plan & schedule posts' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Performance insights' },
    { name: 'Profile', href: '/profile', icon: User, description: 'Business settings' },
  ]

  // Professional color scheme
  const colors = {
    primary: '#3B82F6',
    primaryDark: '#1D4ED8',
    background: '#F8FAFC',
    card: '#59cacaff',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981'
  }

  const styles = {
    sidebar: {
      backgroundColor: colors.border,
      borderRight: `1px solid ${colors.border}`,
      boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
    },
    logo: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    navItem: {
      base: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        marginBottom: '4px'
      },
      active: {
        backgroundColor: `${colors.primary}10`,
        color: colors.primary,
        borderLeft: `3px solid ${colors.primary}`
      },
      inactive: {
        color: colors.textLight,
        backgroundColor: 'transparent'
      }
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: colors.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
          display: 'flex'
        }}>
          {/* Mobile Sidebar */}
          <div style={{
            position: 'relative',
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '320px',
            width: '100%',
            backgroundColor: colors.background
          }}>
            {/* Mobile Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={18} color="white" />
                </div>
                <div>
                  <h1 style={{ ...styles.logo, fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    JengaBI(JBI)
                  </h1>
                  <p style={{ fontSize: '12px', color: colors.textLight, margin: 0 }}>
                    Creator Platform
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: colors.textLight
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav style={{ padding: '16px 16px 60px 16px', paddingTop: '24px', overflowY: 'auto', height: 'calc(100vh - 300px)', maxHeight: 'calc(100vh - 300px)' }}>
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    style={{
                      ...styles.navItem.base,
                      ...(isActive ? styles.navItem.active : styles.navItem.inactive)
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} style={{ marginRight: '12px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '12px', color: isActive ? colors.primary : colors.textLight }}>
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: colors.primary,
                        borderRadius: '50%'
                      }} />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* Click outside to close */}
          <div 
            style={{ flex: 1 }}
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Desktop Sidebar */}
<aside style={{
  ...styles.sidebar,
  display: 'none',
  width: '280px',
  flexDirection: 'column',
  height: '100vh', // Ensure full viewport height
  '@media (min-width: 1024px)': {
    display: 'flex'
  }
}}>
  {/* Logo Section */}
  <div style={{ 
    padding: '24px 20px', 
    borderBottom: `1px solid ${colors.border}`,
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    flexShrink: 0 // Prevent logo from shrinking
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
      }}>
        <Zap size={22} color="white" />
      </div>
      <div>
        <h1 style={{ ...styles.logo, fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          JengaBI
        </h1>
        <p style={{ fontSize: '12px', color: colors.textLight, margin: '2px 0 0 0' }}>
          Creator Platform
        </p>
      </div>
    </div>
  </div>

  {/* Navigation - Remove flex: 1 and add auto height */}
  <nav style={{ 
    padding: '20px 16px',
    overflowY: 'auto', // Allow scrolling if needed
    height: 'calc(100vh - 200px)', // 
    maxHeight: 'calc(100vh - 200px)',
    flex: '1 1 auto' // This allows it to take available space but not force full height
  }}>
    {navigation.map((item) => {
      const Icon = item.icon
      const isActive = location.pathname === item.href
      return (
        <Link
          key={item.name}
          to={item.href}
          style={{
            ...styles.navItem.base,
            ...(isActive ? styles.navItem.active : styles.navItem.inactive),
            borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = '#F8FAFC'
              e.currentTarget.style.color = colors.text
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = colors.textLight
            }
          }}
        >
          <Icon size={20} style={{ marginRight: '12px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              {item.name}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: isActive ? colors.primary : colors.textLight,
              opacity: isActive ? 1 : 0.7
            }}>
              {item.description}
            </div>
          </div>
        </Link>
      )
    })}
  </nav>
</aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: colors.card,
          borderBottom: `1px solid ${colors.border}`,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Left Section - App Name, Menu Button & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* App Name and Menu Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Menu size={20} />
              </button>

              {/* App Name - Visible on all screen sizes */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={16} color="white" />
                </div>
                <div>
                  <h1 style={{ 
                    ...styles.logo, 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    margin: 0,
                    lineHeight: '1.2'
                  }}>
                    JengaBI(JBI)
                  </h1>
                  <p style={{ 
                    fontSize: '12px', 
                    color: colors.textLight, 
                    margin: 0,
                    lineHeight: '1.2'
                  }}>
                    Creator Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{
              position: 'relative',
              display: 'none',
              alignItems: 'center',
              '@media (min-width: 768px)': {
                display: 'flex'
              }
            }}>
              <Search size={18} style={{ 
                position: 'absolute', 
                left: '12px', 
                color: colors.textLight 
              }} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  padding: '10px 12px 10px 40px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  width: '280px',
                  backgroundColor: colors.background,
                  outline: 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Right Section - Notifications & User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notifications */}
            <button style={{
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: colors.text,
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            >
              <Bell size={20} />
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '6px',
                height: '6px',
                backgroundColor: colors.success,
                borderRadius: '50%'
              }} />
            </button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </header>

        {/* Page Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          padding: '0'
        }}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout