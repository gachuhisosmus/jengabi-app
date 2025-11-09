import React from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { user, userProfile, profileCompleted, loading, initialized } = useSupabase()
  const location = useLocation()

  console.log('🛡️ ProtectedRoute check:', {
    user: user?.email,
    hasProfile: !!userProfile,
    profileCompleted,
    currentPath: location.pathname
  })

  if (!initialized || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #F3F4F6',
            borderTop: '3px solid #3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <h3 style={{ color: '#1F2937', margin: '0 0 8px 0' }}>Loading JengaBI</h3>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            {initialized ? 'Checking permissions...' : 'Initializing...'}
          </p>
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

  if (!user) {
    console.log('🔐 No user, redirecting to /auth')
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (!profileCompleted && location.pathname !== '/profile') {
    console.log('📝 Profile incomplete, redirecting to /profile')
    return <Navigate to="/profile" replace />
  }

  console.log('✅ Access granted to:', location.pathname)
  return children
}

export default ProtectedRoute