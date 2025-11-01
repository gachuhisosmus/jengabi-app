import React, { useState, useEffect, useRef } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { useNavigate } from 'react-router-dom'
import { 
  Building, MapPin, Phone, Globe, Target, Package, Plus, 
  Edit3, Trash2, Save, Instagram, Facebook, Twitter, 
  Youtube, CheckCircle, X, ArrowRight, CheckCircle2 
} from 'lucide-react'

const businessTypes = [
  'Fashion & Clothing',
  'Restaurant & Food',
  'Beauty & Salon',
  'Technology & Services',
  'Retail & Shop',
  'Health & Wellness',
  'Education & Training',
  'Creative & Arts',
  'Other'
]

const socialPlatforms = [
  { key: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C' },
  { key: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { key: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { key: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' }
]

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    padding: '32px 24px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E5E7EB'
  },
  button: {
    primary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    secondary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'transparent',
      color: '#6B7280',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  }
}

const Profile = () => {
  const { userProfile, updateUserProfile, profileCompleted, refreshProfile } = useSupabase()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('business')
  const [isEditing, setIsEditing] = useState(true)
  const [saving, setSaving] = useState(false)

  // 🟢 UNCONTROLLED INPUTS: Use refs instead of state for form fields
  const businessNameRef = useRef('')
  const businessTypeRef = useRef('')
  const locationRef = useRef('')
  const phoneRef = useRef('')
  const websiteRef = useRef('')
  const marketingGoalsRef = useRef('')
  const targetAudienceRef = useRef('')
  const productsRef = useRef([])
  const socialAccountsRef = useRef({})

  // 🟢 We still need some state for UI updates, but not for form values
  const [_, setForceUpdate] = useState(0)
  const initialLoadRef = useRef(false)
  const renderCountRef = useRef(0)
  
  renderCountRef.current += 1
  console.log(`🎯 PROFILE RENDERED ${renderCountRef.current} times`)

  // 🟢 ONE-TIME initial load from Supabase
  useEffect(() => {
    if (userProfile && !initialLoadRef.current) {
      console.log('🔄 ONE-TIME INITIAL LOAD FROM SUPABASE')
      
      // Update refs directly (no state update = no re-render)
      businessNameRef.current = userProfile.business_name || ''
      businessTypeRef.current = userProfile.business_type || ''
      locationRef.current = userProfile.location || ''
      phoneRef.current = userProfile.phone || ''
      websiteRef.current = userProfile.website || ''
      marketingGoalsRef.current = userProfile.marketing_goals || ''
      targetAudienceRef.current = userProfile.target_audience || ''
      productsRef.current = userProfile.products || []
      socialAccountsRef.current = userProfile.social_accounts || {}
      
      initialLoadRef.current = true
      // Force one re-render to show the loaded data
      setForceUpdate(prev => prev + 1)
    }
  }, [userProfile])

  // 🟢 SIMPLE completion status based on refs
  const completionStatus = {
    business: !!(businessNameRef.current && businessTypeRef.current),
    contact: !!(locationRef.current || phoneRef.current || websiteRef.current),
    products: !!(productsRef.current && productsRef.current.length > 0),
    social: !!(socialAccountsRef.current && Object.keys(socialAccountsRef.current).length > 0),
    goals: !!(marketingGoalsRef.current && targetAudienceRef.current)
  }

  // 🟢 SIMPLE save function - collects data from refs
  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      console.log('💾 SAVING PROFILE TO SUPABASE')
      
      const profileData = {
        business_name: businessNameRef.current,
        business_type: businessTypeRef.current,
        location: locationRef.current,
        phone: phoneRef.current,
        website: websiteRef.current,
        marketing_goals: marketingGoalsRef.current,
        target_audience: targetAudienceRef.current,
        products: productsRef.current,
        social_accounts: socialAccountsRef.current
      }
      
      const { error } = await updateUserProfile(profileData)
      if (error) throw error
      
      setIsEditing(false)

      // Force refresh of profile data
      console.log('🔄 Refreshing profile data after save...')
      refreshProfile() // This should trigger a re-fetch

      if (profileData.business_name && profileData.business_type) {
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
          }, 1000)
      }
    
      
      if (businessNameRef.current && businessTypeRef.current) {
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 1000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // 🟢 Force update for UI (without causing cursor issues)
  const forceUIUpdate = () => {
    setForceUpdate(prev => prev + 1)
  }

  const handleSkipToDashboard = () => navigate('/dashboard')
  const handleTabChange = (tab) => setActiveTab(tab)
  
  const handleAddProduct = () => {
    productsRef.current = [...productsRef.current, '']
    forceUIUpdate()
  }
  
  const handleRemoveProduct = (index) => {
    productsRef.current = productsRef.current.filter((_, i) => i !== index)
    forceUIUpdate()
  }
  
  const handleSocialAccountChange = (platform, username) => {
    socialAccountsRef.current = { ...socialAccountsRef.current, [platform]: username }
    forceUIUpdate()
  }

  const BusinessInfoTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 🟢 UNCONTROLLED TEST FIELD */}
      <div>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
          UNCONTROLLED TEST FIELD (No Re-renders)
        </label>
        <input
          type="text"
          defaultValue={businessNameRef.current}
          onChange={(e) => {
            console.log('🎯 UNCONTROLLED onChange:', e.target.value)
            businessNameRef.current = e.target.value
            // No state update = no re-render = cursor stays put
          }}
          placeholder="Type here - cursor should stay active..."
          style={{
            width: '100%',
            padding: '12px',
            border: `2px solid #10B981`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {!profileCompleted && (
        <div style={{
          backgroundColor: '#F0F9FF',
          border: `1px solid #3B82F6`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={20} color="#3B82F6" />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF', margin: '0 0 4px 0' }}>
                Complete Your Business Profile
              </h4>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                Fill in your business details to unlock personalized AI recommendations
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Business Name - UNCONTROLLED */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
            Business Name *
          </label>
          {completionStatus.business && <CheckCircle2 size={16} color="#10B981" />}
        </div>
        <input
          type="text"
          defaultValue={businessNameRef.current}
          onChange={(e) => businessNameRef.current = e.target.value}
          disabled={!isEditing}
          placeholder="e.g., African Elegance Boutique"
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid #D1D5DB`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: isEditing ? 'white' : '#F9FAFB'
          }}
        />
      </div>

      {/* Business Type - UNCONTROLLED */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
            Business Type *
          </label>
          {completionStatus.business && <CheckCircle2 size={16} color="#10B981" />}
        </div>
        <select
          defaultValue={businessTypeRef.current}
          onChange={(e) => businessTypeRef.current = e.target.value}
          disabled={!isEditing}
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid #D1D5DB`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: isEditing ? 'white' : '#F9FAFB'
          }}
        >
          <option value="">Select business type</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Location - UNCONTROLLED */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
            Location
          </label>
          {completionStatus.contact && <CheckCircle2 size={16} color="#10B981" />}
        </div>
        <div style={{ position: 'relative' }}>
          <MapPin size={16} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#6B7280' 
          }} />
          <input
            type="text"
            defaultValue={locationRef.current}
            onChange={(e) => locationRef.current = e.target.value}
            disabled={!isEditing}
            placeholder="e.g., Nairobi, Kenya"
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: `1px solid #D1D5DB`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isEditing ? 'white' : '#F9FAFB'
            }}
          />
        </div>
      </div>

      {/* Phone - UNCONTROLLED */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
            Phone Number
          </label>
          {completionStatus.contact && <CheckCircle2 size={16} color="#10B981" />}
        </div>
        <div style={{ position: 'relative' }}>
          <Phone size={16} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#6B7280' 
          }} />
          <input
            type="tel"
            defaultValue={phoneRef.current}
            onChange={(e) => phoneRef.current = e.target.value}
            disabled={!isEditing}
            placeholder="e.g., +254 712 345 678"
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: `1px solid #D1D5DB`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isEditing ? 'white' : '#F9FAFB'
            }}
          />
        </div>
      </div>

      {/* Website - UNCONTROLLED */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
            Website
          </label>
          {completionStatus.contact && <CheckCircle2 size={16} color="#10B981" />}
        </div>
        <div style={{ position: 'relative' }}>
          <Globe size={16} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#6B7280' 
          }} />
          <input
            type="url"
            defaultValue={websiteRef.current}
            onChange={(e) => websiteRef.current = e.target.value}
            disabled={!isEditing}
            placeholder="e.g., https://mybusiness.com"
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: `1px solid #D1D5DB`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isEditing ? 'white' : '#F9FAFB'
            }}
          />
        </div>
      </div>
    </div>
  )

  const ProductsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
          Products & Services
        </label>
        {completionStatus.products && <CheckCircle2 size={16} color="#10B981" />}
      </div>
      
      {productsRef.current.map((product, index) => (
        <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            defaultValue={product}
            onChange={(e) => {
              productsRef.current[index] = e.target.value
            }}
            disabled={!isEditing}
            placeholder="e.g., Handmade Jewelry, Catering Services"
            style={{
              flex: 1,
              padding: '12px',
              border: `1px solid #D1D5DB`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isEditing ? 'white' : '#F9FAFB'
            }}
          />
          {isEditing && (
            <button
              onClick={() => handleRemoveProduct(index)}
              style={{
                padding: '12px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                color: '#DC2626',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
      
      {isEditing && (
        <button
          onClick={handleAddProduct}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px dashed #D1D5DB',
            borderRadius: '8px',
            padding: '12px',
            color: '#6B7280',
            cursor: 'pointer',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Plus size={16} />
          Add Product/Service
        </button>
      )}
    </div>
  )

  const SocialMediaTab = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
        Social Media Accounts
      </label>
      {completionStatus.social && <CheckCircle2 size={16} color="#10B981" />}
    </div>
    
    {socialPlatforms.map((platform) => {
      const Icon = platform.icon
      return (
        <div key={platform.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px',
            backgroundColor: platform.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Icon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
              {platform.name}
            </div>
            <input
              type="text"
              defaultValue={socialAccountsRef.current[platform.key] || ''}
              onChange={(e) => {
                // 🟢 DIRECT UPDATE - No re-renders!
                socialAccountsRef.current[platform.key] = e.target.value
                // No forceUpdate call = no re-render = cursor stays active
              }}
              onBlur={() => {
                // 🟢 Optional: Update completion status only when user leaves field
                const hasSocialAccounts = Object.keys(socialAccountsRef.current).some(
                  key => socialAccountsRef.current[key]?.trim()
                )
                if (hasSocialAccounts !== completionStatus.social) {
                  forceUIUpdate() // Only re-render if completion status actually changed
                }
              }}
              disabled={!isEditing}
              placeholder={`Your ${platform.name} username`}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid #D1D5DB`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: isEditing ? 'white' : '#F9FAFB',
                marginTop: '4px'
              }}
            />
          </div>
        </div>
      )
    })}
  </div>
)

  const GoalsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
          Marketing Goals
        </label>
        {completionStatus.goals && <CheckCircle2 size={16} color="#10B981" />}
      </div>
      <textarea
        defaultValue={marketingGoalsRef.current}
        onChange={(e) => marketingGoalsRef.current = e.target.value}
        disabled={!isEditing}
        placeholder="What are your main marketing objectives? (e.g., Increase brand awareness, drive sales, grow social media following)"
        rows={4}
        style={{
          width: '100%',
          padding: '12px',
          border: `1px solid #D1D5DB`,
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: isEditing ? 'white' : '#F9FAFB',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
          Target Audience
        </label>
        {completionStatus.goals && <CheckCircle2 size={16} color="#10B981" />}
      </div>
      <textarea
        defaultValue={targetAudienceRef.current}
        onChange={(e) => targetAudienceRef.current = e.target.value}
        disabled={!isEditing}
        placeholder="Describe your ideal customers (e.g., Young professionals aged 25-35, fashion-conscious women, local businesses)"
        rows={4}
        style={{
          width: '100%',
          padding: '12px',
          border: `1px solid #D1D5DB`,
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: isEditing ? 'white' : '#F9FAFB',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business':
        return <BusinessInfoTab />
      case 'products':
        return <ProductsTab />
      case 'social':
        return <SocialMediaTab />
      case 'goals':
        return <GoalsTab />
      default:
        return <BusinessInfoTab />
    }
  }

  const CompletionProgress = () => {
    const totalSteps = 5
    const completedSteps = Object.values(completionStatus).filter(Boolean).length
    const progress = (completedSteps / totalSteps) * 100

    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>Profile Progress</span>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>{completedSteps}/{totalSteps}</span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#E5E7EB',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#10B981',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    )
  }

  const TabButton = ({ tab, label, icon: Icon }) => (
    <button
      onClick={() => handleTabChange(tab)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '16px',
        backgroundColor: activeTab === tab ? '#F3F4F6' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
    >
      <Icon size={20} color={activeTab === tab ? '#3B82F6' : '#6B7280'} />
      <span style={{ 
        fontSize: '14px', 
        fontWeight: '500', 
        color: activeTab === tab ? '#1F2937' : '#6B7280' 
      }}>
        {label}
      </span>
      {completionStatus[tab] && <CheckCircle2 size={16} color="#10B981" style={{ marginLeft: 'auto' }} />}
    </button>
  )

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0' }}>
              {profileCompleted ? 'Business Profile' : 'Complete Your Profile'}
            </h1>
            <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
              {profileCompleted ? 'Manage your business information' : 'Set up your business to get started'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {!profileCompleted && (
              <button
                onClick={handleSkipToDashboard}
                style={styles.button.secondary}
              >
                Skip for Now
                <ArrowRight size={16} />
              </button>
            )}
            
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  style={styles.button.secondary}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !businessNameRef.current || !businessTypeRef.current}
                  style={{
                    ...styles.button.primary,
                    opacity: (saving || !businessNameRef.current || !businessTypeRef.current) ? 0.5 : 1
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {profileCompleted ? 'Save Changes' : 'Complete Profile'}
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.button.primary}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
          {/* Sidebar */}
          <div style={styles.card}>
            <div style={{ padding: '24px' }}>
              <CompletionProgress />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <TabButton tab="business" label="Business Info" icon={Building} />
                <TabButton tab="products" label="Products" icon={Package} />
                <TabButton tab="social" label="Social Media" icon={Instagram} />
                <TabButton tab="goals" label="Goals & Audience" icon={Target} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={styles.card}>
            <div style={{ padding: '32px' }}>
              {renderTabContent()}
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

export default Profile