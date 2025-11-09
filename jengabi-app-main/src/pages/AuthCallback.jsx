import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { CheckCircle, XCircle } from 'lucide-react'

const AuthCallback = () => {
  const { supabase } = useSupabase()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // This will automatically handle the OAuth callback and set the session
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('Email verification failed. Please try signing in again.')
          return
        }

        if (data.session?.user) {
          setStatus('success')
          setMessage('Email verified successfully! Redirecting to sign in...')
          
          // Wait a moment then redirect to sign in
          setTimeout(() => {
            navigate('/auth', { 
              state: { 
                message: 'Email verified successfully! Please sign in to continue.',
                verified: true 
              } 
            })
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Invalid or expired verification link. Please request a new one.')
        }
      } catch (error) {
        console.error('Auth callback exception:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    handleAuthCallback()
  }, [supabase, navigate])

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F0F9FF',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: '#EFF6FF',
        borderRadius: '12px', 
        border: '1px solid #BFDBFE',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid #F3F4F6',
              borderTop: '3px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <h2 style={{ color: '#1E40AF', marginBottom: '8px', fontSize: '20px' }}>Verifying Email</h2>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Please wait while we verify your email address...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle size={48} color="#10B981" style={{ marginBottom: '16px' }} />
            <h2 style={{ color: '#1E40AF', marginBottom: '8px', fontSize: '20px' }}>Email Verified!</h2>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
            <h2 style={{ color: '#1E40AF', marginBottom: '8px', fontSize: '20px' }}>Verification Failed</h2>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>{message}</p>
            <button
              onClick={() => navigate('/auth')}
              style={{
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Back to Sign In
            </button>
          </>
        )}
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

export default AuthCallback