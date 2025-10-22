import React, { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

const Auth = () => {
  const { signIn, signUp, resendConfirmationEmail, user, userProfile, profileCompleted } = useSupabase()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && userProfile !== null) {
      console.log('🔄 Auth redirect check:', { 
        hasProfile: !!userProfile, 
        profileCompleted 
      })
      
      if (!profileCompleted) {
        console.log('📝 Redirecting to profile (incomplete)')
        navigate('/profile', { replace: true })
      } else {
        console.log('🏠 Redirecting to dashboard (complete)')
        navigate('/', { replace: true })
      }
    }
  }, [user, userProfile, profileCompleted, navigate])

  // Reset state when component mounts or mode changes
  useEffect(() => {
    setSignupSuccess(false)
    setConfirmationSent(false)
    setSuccessMessage('')
    setErrors({})
    setLoading(false)
  }, [isLogin])

  // Check for success message from redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    setSignupSuccess(false)
    setSuccessMessage('')

    console.log('🎯 Starting authentication...')

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('⏰ Auth request timed out after 10 seconds')
        setLoading(false)
        setErrors({ general: 'Request timed out. Please check your connection and try again.' })
      }
    }, 10000)

    try {
      if (isLogin) {
        console.log('🔐 Calling signIn function...')
        const { error } = await signIn(formData.email, formData.password)
        
        if (error) {
          console.error('❌ SignIn returned error:', error)
          throw error
        }
        
        console.log('✅ SignIn completed successfully')
        
      } else {
        console.log('👤 Calling signUp function...')
        const { data, error } = await signUp(formData.email, formData.password)
        
        if (error) {
          console.error('❌ SignUp returned error:', error)
          throw error
        }
        
        console.log('✅ SignUp completed successfully')
        if (data?.user) {
          setSignupSuccess(true)
          setConfirmationSent(true)
        }
      }
    } catch (error) {
      console.error('💥 Auth process failed:', error)
      let errorMessage = 'Authentication failed. Please try again.'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email address before signing in. Check your inbox.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many attempts. Please wait a few minutes and try again.'
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.'
      }
      
      setErrors({ general: errorMessage })
    } finally {
      console.log('🏁 Auth process finished, clearing timeout and loading state')
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setLoading(true)
    try {
      const { error } = await resendConfirmationEmail(formData.email)
      if (error) throw error
      setConfirmationSent(true)
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (signupSuccess) {
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
          maxWidth: '450px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#DCFCE7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle size={32} color="#16A34A" />
          </div>
          
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E40AF', margin: '0 0 16px 0' }}>
            Check Your Email
          </h1>
          
          <p style={{ color: '#6B7280', fontSize: '16px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
            We've sent a confirmation link to <strong>{formData.email}</strong>. 
            Please click the link in the email to verify your account and continue.
          </p>

          {confirmationSent && (
            <div style={{
              backgroundColor: '#DCFCE7',
              border: '1px solid #BBF7D0',
              color: '#166534',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              Confirmation email sent! Check your inbox.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleResendConfirmation}
              disabled={loading || confirmationSent}
              style={{
                width: '100%',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (loading || confirmationSent) ? 'not-allowed' : 'pointer',
                opacity: (loading || confirmationSent) ? 0.7 : 1
              }}
            >
              {loading ? 'Sending...' : 'Resend Confirmation Email'}
            </button>
            
            <button
              onClick={() => {
                setSignupSuccess(false)
                setIsLogin(true)
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#3B82F6',
                border: '1px solid #3B82F6',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

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
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E40AF', margin: '0 0 8px 0' }}>
            Welcome to JBI
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {successMessage && (
          <div style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #BBF7D0',
            color: '#166534',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {errors.general}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ width: '100%' }}>
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Email *
            </label>
            <div style={{ 
              position: 'relative',
              width: '100%'
            }}>
              <Mail size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6B7280' 
              }} />
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: `1px solid ${errors.email ? '#DC2626' : '#D1D5DB'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: errors.email ? '#FEF2F2' : 'white',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: '#DC2626', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px', width: '100%' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '8px' 
            }}>
              Password *
            </label>
            <div style={{ 
              position: 'relative',
              width: '100%'
            }}>
              <Lock size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6B7280' 
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 40px',
                  border: `1px solid ${errors.password ? '#DC2626' : '#D1D5DB'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: errors.password ? '#FEF2F2' : 'white',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#DC2626', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '24px', width: '100%' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Confirm Password *
              </label>
              <div style={{ 
                position: 'relative',
                width: '100%'
              }}>
                <Lock size={16} style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#6B7280' 
                }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    border: `1px solid ${errors.confirmPassword ? '#DC2626' : '#D1D5DB'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: errors.confirmPassword ? '#FEF2F2' : 'white',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ color: '#DC2626', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              marginBottom: '16px'
            }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          paddingTop: '24px', 
          borderTop: '1px solid #E5E7EB' 
        }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setErrors({})
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
              })
              setLoading(false)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#3B82F6',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '8px'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth