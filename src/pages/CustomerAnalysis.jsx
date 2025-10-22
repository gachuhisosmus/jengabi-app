import React from 'react'

const CustomerAnalysis = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0' }}>
            Customer Analysis
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
            Analyze customer messages and feedback (Coming Soon)
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #E5E7EB',
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' }}>
            Customer Analysis Feature
          </h3>
          <p style={{ color: '#6B7280', margin: 0 }}>
            This feature is currently in development. You'll soon be able to analyze customer messages 
            and get insights just like the WhatsApp bot's 4WD command.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CustomerAnalysis