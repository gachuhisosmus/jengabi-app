// src/App.jsx - FIXED VERSION
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SupabaseProvider } from './contexts/SupabaseContext'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import MarketingIdeas from './pages/BusinessIntelligence/MarketingIdeas'
import ContentManager from './pages/ContentManager'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import BusinessQA from './pages/BusinessQA'
import CustomerAnalysis from './pages/CustomerAnalysis'
import ProtectedRoute from './components/ProtectedRoute'
import BusinessIntelligence from './pages/BusinessIntelligence'


function App() {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* 🚨 FIX: Root route should NOT be inside ProtectedRoute */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Protected routes with layout - require authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Advanced routes - require complete business profile */}
          <Route path="/marketing" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <MarketingIdeas />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/content" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <ContentManager />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/qa" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <BusinessQA />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/analysis" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <CustomerAnalysis />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/business-intelligence" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <BusinessIntelligence />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Fallback route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  )
}

export default App