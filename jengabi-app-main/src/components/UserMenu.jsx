import React, { useState, useRef, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, ChevronDown, Settings } from 'lucide-react'

const UserMenu = () => {
  const { user, signOut } = useSupabase()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: isOpen ? '#F3F4F6' : 'transparent',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          color: '#374151',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.target.style.backgroundColor = '#F3F4F6'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.target.style.backgroundColor = 'transparent'
          }
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {user.email?.charAt(0).toUpperCase()}
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '2px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {user.email}
          </span>
          <span style={{ 
            fontSize: '12px', 
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Account
            <ChevronDown size={12} style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease-in-out'
            }} />
          </span>
        </div>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          minWidth: '220px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* User Info */}
          <div style={{ 
            padding: '16px',
            borderBottom: '1px solid #F3F4F6',
            backgroundColor: '#F8FAFC'
          }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1F2937',
              marginBottom: '2px'
            }}>
              {user.email}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6B7280'
            }}>
              Welcome back!
            </div>
          </div>
          
          {/* Menu Items */}
          <div style={{ padding: '8px 0' }}>
            <button
              onClick={handleProfileClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#374151',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F3F4F6'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              <Settings size={16} />
              Profile Settings
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#DC2626',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FEF2F2'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu