import React, { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { 
  User,
  Building,
  MapPin,
  Phone,
  Globe,
  Target,
  Package,
  Plus,
  Edit3,
  Trash2,
  Save,
  Upload,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  CheckCircle,
  X
} from 'lucide-react'

const Profile = () => {
  const { user } = useSupabase()
  const [activeTab, setActiveTab] = useState('business')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Mock user profile data - will come from database
  const [profile, setProfile] = useState({
    businessName: '',
    businessType: '',
    location: '',
    phone: '',
    website: '',
    marketingGoals: '',
    targetAudience: '',
    products: [],
    socialAccounts: {}
  })

  // Load mock data
  useEffect(() => {
    const mockProfile = {
      businessName: 'African Elegance Boutique',
      businessType: 'Fashion & Retail',
      location: 'Nairobi, Kenya',
      phone: '+254 712 345 678',
      website: 'https://africanelegance.co.ke',
      marketingGoals: 'Increase online sales and brand awareness among young African professionals',
      targetAudience: 'Age 25-40, urban professionals, fashion-conscious, middle to high income',
      products: [
        'African Print Dresses',
        'Handmade Beaded Jewelry',
        'Traditional Accessories',
        'Modern African Wear'
      ],
      socialAccounts: {
        instagram: '@africanelegance',
        facebook: 'African Elegance Boutique',
        twitter: '@africanelegance'
      }
    }
    setProfile(mockProfile)
  }, [])

  // Professional color scheme
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
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease-in-out'
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
        gap: '6px',
        transition: 'all 0.2s ease-in-out'
      }
    }
  }

  const businessTypes = [
    'Fashion & Retail',
    'Restaurant & Food',
    'Beauty & Salon',
    'Technology Services',
    'Education & Training',
    'Health & Wellness',
    'Art & Crafts',
    'Other'
  ]

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' }
  ]

  const handleSaveProfile = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setIsEditing(false)
      // Here you would save to Supabase
    }, 1500)
  }

  const handleAddProduct = () => {
    const newProduct = prompt('Enter new product name:')
    if (newProduct && newProduct.trim()) {
      setProfile(prev => ({
        ...prev,
        products: [...prev.products, newProduct.trim()]
      }))
    }
  }

  const handleRemoveProduct = (index) => {
    setProfile(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }))
  }

  const handleSocialUpdate = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      socialAccounts: {
        ...prev.socialAccounts,
        [platform]: value
      }
    }))
  }

  const tabs = [
    { id: 'business', name: 'Business Info', icon: Building },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'social', name: 'Social Media', icon: Instagram },
    { id: 'goals', name: 'Goals & Audience', icon: Target }
  ]

  const BusinessInfoTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
            Business Name *
          </label>
          <input
            type="text"
            value={profile.businessName}
            onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isEditing ? 'white' : '#F9FAFB'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
            Business Type *
          </label>
          <select
            value={profile.businessType}
            onChange={(e) => setProfile(prev => ({ ...prev, businessType: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${colors.border}`,
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
            <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Location
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isEditing ? 'white' : '#F9FAFB'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
            <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isEditing ? 'white' : '#F9FAFB'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
          <Globe size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Website
        </label>
        <input
          type="url"
          value={profile.website}
          onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
          disabled={!isEditing}
          placeholder="https://your-business.com"
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: isEditing ? 'white' : '#F9FAFB'
          }}
        />
      </div>
    </div>
  )

  const ProductsTab = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: 0 }}>
          Your Products & Services
        </h3>
        {isEditing && (
          <button
            onClick={handleAddProduct}
            style={styles.button.secondary}
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {profile.products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#F8FAFC', 
          borderRadius: '8px',
          border: `2px dashed ${colors.border}`
        }}>
          <Package size={48} color={colors.textLight} style={{ marginBottom: '16px' }} />
          <p style={{ color: colors.textLight, marginBottom: '16px' }}>
            No products added yet. Add your products to get better AI recommendations.
          </p>
          {isEditing && (
            <button
              onClick={handleAddProduct}
              style={styles.button.primary}
            >
              <Plus size={16} />
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {profile.products.map((product, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={20} color={colors.textLight} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>
                  {product}
                </span>
              </div>
              
              {isEditing && (
                <button
                  onClick={() => handleRemoveProduct(index)}
                  style={{
                    padding: '6px',
                    border: 'none',
                    backgroundColor: '#FEF2F2',
                    color: '#EF4444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const SocialMediaTab = () => (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: '0 0 20px 0' }}>
        Connect Your Social Media Accounts
      </h3>
      <p style={{ color: colors.textLight, fontSize: '14px', marginBottom: '24px' }}>
        Connect your accounts to get platform-specific content recommendations and analytics.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {socialPlatforms.map(platform => {
          const Icon = platform.icon
          const value = profile.socialAccounts[platform.id] || ''
          return (
            <div key={platform.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`
            }}>
              <div style={{
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: `${platform.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color={platform.color} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
                  {platform.name}
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleSocialUpdate(platform.id, e.target.value)}
                  disabled={!isEditing}
                  placeholder={`Your ${platform.name} username or page`}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: isEditing ? 'white' : 'transparent'
                  }}
                />
              </div>
              
              {value && (
                <CheckCircle size={20} color={colors.success} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const GoalsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
          Marketing Goals
        </label>
        <textarea
          rows={4}
          value={profile.marketingGoals}
          onChange={(e) => setProfile(prev => ({ ...prev, marketingGoals: e.target.value }))}
          disabled={!isEditing}
          placeholder="Describe your main marketing objectives... (e.g., Increase brand awareness, drive online sales, grow social media following)"
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            backgroundColor: isEditing ? 'white' : '#F9FAFB',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
          Target Audience
        </label>
        <textarea
          rows={4}
          value={profile.targetAudience}
          onChange={(e) => setProfile(prev => ({ ...prev, targetAudience: e.target.value }))}
          disabled={!isEditing}
          placeholder="Describe your ideal customers... (e.g., Age range, interests, location, income level, etc.)"
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            backgroundColor: isEditing ? 'white' : '#F9FAFB',
            fontFamily: 'inherit'
          }}
        />
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business': return <BusinessInfoTab />
      case 'products': return <ProductsTab />
      case 'social': return <SocialMediaTab />
      case 'goals': return <GoalsTab />
      default: return <BusinessInfoTab />
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.text, margin: '0 0 8px 0' }}>
              Business Profile
            </h1>
            <p style={{ fontSize: '16px', color: colors.textLight, margin: 0 }}>
              Manage your business information and preferences
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
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
                  disabled={saving}
                  style={{
                    ...styles.button.primary,
                    opacity: saving ? 0.7 : 1
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
                      Save Changes
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
              {/* User Summary */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: colors.primary,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {profile.businessName.charAt(0)}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: '0 0 4px 0' }}>
                  {profile.businessName || 'Your Business'}
                </h3>
                <p style={{ fontSize: '14px', color: colors.textLight, margin: 0 }}>
                  {profile.businessType || 'Business Type'}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tabs.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        border: 'none',
                        backgroundColor: isActive ? `${colors.primary}10` : 'transparent',
                        color: isActive ? colors.primary : colors.text,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        textAlign: 'left',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <Icon size={18} />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
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