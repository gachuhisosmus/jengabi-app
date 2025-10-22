import React, { useState } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { HelpCircle, Sparkles, Copy, CheckCircle } from 'lucide-react'
import botService from '../services/botService'

const BusinessQA = () => {
  const { userProfile } = useSupabase()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const askQuestion = async () => {
    if (!question.trim()) return
    
    setIsGenerating(true)
    try {
      const businessContext = {
        business_name: userProfile?.business_name,
        business_type: userProfile?.business_type,
        business_location: userProfile?.business_location,
        business_products: userProfile?.business_products
      }

      const response = await botService.getBusinessAdvice(question, businessContext)
      setAnswer(response.answer || response.advice || "I'm still learning to answer complex business questions. Try asking about marketing, pricing, or customer service.")
    } catch (error) {
      console.error('Q&A Error:', error)
      setAnswer("Sorry, I'm having trouble answering right now. Please try again later.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyAnswer = async () => {
    await navigator.clipboard.writeText(answer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0' }}>
            Business Q&A
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
            Get AI-powered business advice tailored for your African business
          </p>
        </div>

        {/* Question Input */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #E5E7EB',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <HelpCircle size={20} color="#3B82F6" />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
              Ask Your Business Question
            </h2>
          </div>
          
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., How should I price my new products? What's the best way to handle customer complaints? How can I attract more customers?"
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              marginBottom: '16px'
            }}
          />
          
          <button
            onClick={askQuestion}
            disabled={!question.trim() || isGenerating}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: question.trim() && !isGenerating ? 'pointer' : 'not-allowed',
              opacity: question.trim() && !isGenerating ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isGenerating ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Get Advice
              </>
            )}
          </button>
        </div>

        {/* Answer Display */}
        {answer && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            border: '1px solid #E5E7EB',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: '#10B98120'
                }}>
                  <HelpCircle size={20} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                  Business Advice
                </h3>
              </div>
              
              <button
                onClick={copyAnswer}
                style={{
                  padding: '8px 12px',
                  backgroundColor: copied ? '#10B981' : 'white',
                  border: `1px solid ${copied ? '#10B981' : '#D1D5DB'}`,
                  borderRadius: '6px',
                  color: copied ? 'white' : '#374151',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              whiteSpace: 'pre-line',
              lineHeight: '1.6',
              color: '#374151'
            }}>
              {answer}
            </div>
          </div>
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

export default BusinessQA