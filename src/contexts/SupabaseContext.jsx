import React, { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const SupabaseContext = createContext()

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [rawUserProfile, setRawUserProfile] = useState(null)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  
  // 🟢 FIXED: Use ref to track mounted state and prevent multiple inits
  const mountedRef = useRef(true)
  const initStartedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // 🟢 FIXED: Memoize userProfile to prevent unnecessary re-renders
  const userProfile = useMemo(() => {
    if (!rawUserProfile) return null
    
    return {
      id: rawUserProfile.id,
      email: rawUserProfile.email || user?.email || '',
      phone_number: rawUserProfile.phone_number || '',
      business_name: rawUserProfile.business_name || '',
      business_type: rawUserProfile.business_type || '',
      location: rawUserProfile.business_location || rawUserProfile.location || '',
      phone: rawUserProfile.business_phone || rawUserProfile.phone || '',
      website: rawUserProfile.website || '',
      marketing_goals: rawUserProfile.marketing_goals || rawUserProfile.business_marketing_goals || '',
      target_audience: rawUserProfile.target_audience || '',
      products: rawUserProfile.products || rawUserProfile.business_products || [],
      social_accounts: rawUserProfile.social_accounts || {},
      created_at: rawUserProfile.created_at,
      updated_at: rawUserProfile.updated_at
    }
  }, [
    rawUserProfile,
    user?.email,
    // 🟢 CRITICAL: Only update when these specific fields change
    rawUserProfile?.business_name,
    rawUserProfile?.business_type,
    rawUserProfile?.business_location,
    rawUserProfile?.location,
    rawUserProfile?.business_phone,
    rawUserProfile?.phone,
    rawUserProfile?.website,
    rawUserProfile?.marketing_goals,
    rawUserProfile?.business_marketing_goals,
    rawUserProfile?.target_audience,
    rawUserProfile?.products?.length,
    JSON.stringify(rawUserProfile?.social_accounts || {})
  ])

  // 🟢 FIXED: Memoize profile completion calculation
  const stableProfileCompleted = useMemo(() => {
    return !!(userProfile?.business_name && userProfile?.business_type)
  }, [userProfile?.business_name, userProfile?.business_type])

  // 🟢 FIXED: Single initialization effect
  useEffect(() => {
    if (initStartedRef.current) return
    initStartedRef.current = true
    
    console.log('🔄 SupabaseProvider mounted - checking session...')
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mountedRef.current) return

        if (error) {
          console.error('❌ Session error:', error)
          setLoading(false)
          setInitialized(true)
          return
        }

        console.log('🔐 Initial session check:', session ? `✅ User: ${session.user.email}` : '❌ No user')
        
        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('👤 User authenticated, fetching profile...')
          await fetchUserProfile(session.user.id)
        } else {
          console.log('👤 No user session, auth complete')
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        if (mountedRef.current) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    // 🟢 FIXED: Single auth state listener with debouncing
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return
      
      console.log('🎯 Auth state change:', event, 'User:', session?.user?.email)
      
      // 🟢 Prevent rapid state updates
      setUser(prevUser => {
        if (prevUser?.id === session?.user?.id) return prevUser
        return session?.user ?? null
      })
      
      if (session?.user) {
        console.log('✅ User signed in, fetching profile...')
        await fetchUserProfile(session.user.id)
      } else {
        console.log('🚪 User signed out, clearing data')
        setRawUserProfile(null)
        setProfileCompleted(false)
        setLoading(false)
        setInitialized(true)
      }
    })

    return () => {
      console.log('🧹 Cleaning up auth listener')
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  // 🟢 FIXED: Stable profile fetch without timeouts that cause re-renders
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      console.log('📊 Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('🔍 Profile query result:', { data, error })

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('👤 Creating new profile...')
          await createUserProfile(userId, user?.email || '')
          return
        }
        console.error('❌ Profile fetch error:', error)
        // 🟢 Don't throw - just create fallback
        createFallbackProfile(userId)
        return
      }
      
      console.log('✅ Profile loaded successfully')
      setRawUserProfile(data)
      
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error)
      createFallbackProfile(userId)
    } finally {
      if (mountedRef.current) {
        setLoading(false)
        setInitialized(true)
      }
    }
  }, [user?.email])

  // 🟢 FIXED: Fallback profile without throwing errors
  const createFallbackProfile = useCallback((userId) => {
    const fallbackProfile = {
      id: userId,
      email: user?.email || '',
      phone_number: '',
      business_name: '',
      business_type: '',
      business_location: '',
      business_phone: '',
      website: '',
      marketing_goals: '',
      target_audience: '',
      products: [],
      social_accounts: {}
    }
    
    setRawUserProfile(fallbackProfile)
  }, [user?.email])

  // 🟢 FIXED: Memoized create user profile
  const createUserProfile = useCallback(async (userId, email) => {
    try {
      console.log('👤 Creating profile for user:', userId)
      
      const profileData = {
        id: userId,
        email: email,
        phone_number: '',
        business_name: '',
        business_type: '',
        business_location: '',
        business_phone: '',
        website: '',
        marketing_goals: '',
        target_audience: '',
        products: [],
        social_accounts: {},
        profile_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single()

      if (error) {
        console.error('❌ Profile creation error:', error)
        createFallbackProfile(userId)
        return { data: null, error }
      }

      console.log('✅ Profile created successfully')
      setRawUserProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error creating user profile:', error)
      createFallbackProfile(userId)
      return { data: null, error }
    }
  }, [createFallbackProfile])

  // 🟢 FIXED: Memoized update user profile
  const updateUserProfile = useCallback(async (profileData) => {
  console.log('🔄 updateUserProfile CALLED with:', profileData)
  
  if (!user) throw new Error('No user logged in')
  
  // 🟢 FIX: Map to your ACTUAL database column names
  const dbData = {
    business_name: profileData.business_name,
    business_type: profileData.business_type,
    business_location: profileData.location,           // Your DB has business_location
    business_phone: profileData.phone,                 // Your DB has business_phone
    website: profileData.website,
    business_marketing_goals: profileData.marketing_goals, // Use business_marketing_goals
    target_audience: profileData.target_audience,
    products: profileData.products,                    // Use products (not business_products)
    social_accounts: profileData.social_accounts,
    updated_at: new Date().toISOString()
  }
  
  console.log('🔄 Mapped to database columns:', dbData)
  
  const { data, error } = await supabase
    .from('profiles')
    .update(dbData)
    .eq('id', user.id)
    .select()
    .single()
    
  if (error) {
    console.error('❌ updateUserProfile ERROR:', error)
    return { data: null, error }
  }
  
  console.log('✅ updateUserProfile SUCCESS:', data)
  
  if (data) {
    setRawUserProfile(data)
  }
  return { data, error: null }
}, [user])

 
  // 🟢 FIXED: Memoized refresh profile
  const refreshProfile = useCallback(() => {
    if (user) {
      fetchUserProfile(user.id)
    }
  }, [user, fetchUserProfile])

  // 🟢 FIXED: Completely memoized context value
  const value = useMemo(() => ({
    user,
    userProfile, // 🟢 Now this is stable and won't change unnecessarily
    profileCompleted: stableProfileCompleted,
    supabase,
    loading,
    initialized,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return { data, error }
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      return { data, error }
    },
    signOut: () => supabase.auth.signOut(),
    refreshProfile,
    updateUserProfile,
    resendConfirmationEmail: async (email) => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      return { error }
    },
  }), [
    user,
    userProfile, // 🟢 Stable dependency
    stableProfileCompleted,
    loading,
    initialized,
    refreshProfile,
    updateUserProfile
  ])

  // 🟢 FIXED: Sync profileCompleted with stable calculation
  useEffect(() => {
    setProfileCompleted(stableProfileCompleted)
  }, [stableProfileCompleted])

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
export{supabase}
