// src/pages/BusinessIntelligence/BusinessAnswers.jsx
import React, { useState } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Send, Brain, Clock, Zap, TrendingUp, AlertTriangle, ShoppingCart } from 'lucide-react';

const BusinessAnswers = () => {
  const { user } = useSupabase();
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const API_BASE = 'https://jengabi.onrender.com';

      console.log('🔄 Sending request to Business Answers API...');
      
      if (!user || !user.id) {
        setError('Please log in to use Business Answers');
        setLoading(false);
        return;
      }

      console.log('👤 Using user ID:', user.id);
      
      const response = await fetch(`${API_BASE}/api/bot/web-business-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          user_id: user.id
        }),
      });

      console.log('📨 Response received:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Response data:', data);
      
      // 🟢 FIXED: Handle different response formats
      let answerText = '';
      
      if (data.answer) {
        // Format 1: Direct answer
        answerText = data.answer;
      } else if (data.data && data.data.answer) {
        // Format 2: Nested data.answer
        answerText = data.data.answer;
      } else if (data.success && data.data && data.data.answer) {
        // Format 3: success wrapper + data.answer
        answerText = data.data.answer;
      } else if (data.message) {
        // Format 4: Error message as response
        answerText = data.message;
      } else {
        // Format 5: Fallback
        answerText = JSON.stringify(data);
      }
      
      // Add the answer to the answers list
      setAnswers(prev => [{
        id: Date.now(),
        question: question.trim(),
        answer: answerText,
        type: 'business_advice',
        timestamp: new Date()
      }, ...prev]);
      
      setQuestion('');
      console.log('✅ Answer added successfully');
      
    } catch (err) {
      setError(`Network error: ${err.message}. Please check if the bot server is running.`);
      console.error('❌ Business Answers API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalesSubmit = async (salesQuestion) => {
    setLoading(true);
    setError('');
    
    try {
      const API_BASE = 'https://jengabi.onrender.com';
      
      console.log('🔄 Sending sales request...');
      
      if (!user || !user.id) {
        setError('Please log in to use Sales Advice');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/bot/sales-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: salesQuestion,
          user_id: user.id
        }),
      });

      console.log('📨 Sales response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Sales service error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Sales response data:', data);
      
      if (data.success) {
        setAnswers(prev => [{
          id: Date.now(),
          question: salesQuestion,
          answer: data.answer,
          type: 'sales_advice',
          actions: data.actions || [],
          timestamp: new Date()
        }, ...prev]);
        
        setQuestion('');
      } else {
        setError(data.error || 'Failed to get sales advice');
      }
    } catch (err) {
      setError(`Sales advice temporarily unavailable: ${err.message}`);
      console.error('❌ Sales Advice API error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Brain size={24} color="#10B981" />
          <h2 style={styles.title}>Business Intelligence</h2>
        </div>
        <p style={styles.subtitle}>AI-powered insights for your African business</p>
      </div>

      {/* 🆕 TAB NAVIGATION */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('general')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'general' ? styles.activeTab : {})
          }}
        >
          <Brain size={16} />
          General Business Advice
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'sales' ? styles.activeTab : {})
          }}
        >
          <TrendingUp size={16} />
          Sales Emergency Help
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>❌ {error}</div>
        </div>
      )}

      {/* 🆕 DYNAMIC QUESTION INPUT */}
      <form onSubmit={activeTab === 'sales' ? 
          (e) => { e.preventDefault(); handleSalesSubmit(question); } : 
          handleSubmit} 
        style={styles.inputContainer}
      >
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              activeTab === 'sales' 
                ? "Ask for urgent sales help... (e.g., Sales are down, need emergency revenue)"
                : "Ask me anything about your business... (e.g., How to increase sales? Best pricing strategy?)"
            }
            style={{
              ...styles.input,
              borderColor: error ? '#EF4444' : '#D1D5DB'
            }}
            disabled={loading}
          />
          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              backgroundColor: loading ? '#9CA3AF' : (activeTab === 'sales' ? '#DC2626' : '#3B82F6'),
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <Clock size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>

      {/* 🆕 SALES TEMPLATES - ONLY IN SALES TAB */}
      {activeTab === 'sales' && (
        <div style={styles.salesTemplatesContainer}>
          <h4 style={styles.salesTemplatesTitle}>🚀 Quick Sales Templates:</h4>
          <div style={styles.salesTemplatesGrid}>
            <button
              onClick={() => {
                const template = "Sales are down significantly this week. I need immediate strategies to boost revenue starting today.";
                setQuestion(template);
                handleSalesSubmit(template);
              }}
              style={styles.salesTemplateButton}
            >
              <AlertTriangle size={20} color="#EF4444" />
              <span style={{color: '#EF4444'}}>🚨 Revenue Emergency</span>
            </button>
            
            <button
              onClick={() => {
                const template = "I have products that aren't selling. Need urgent clearance strategies with specific pricing and promotions.";
                setQuestion(template);
                handleSalesSubmit(template);
              }}
              style={styles.salesTemplateButton}
            >
              <ShoppingCart size={20} color="#F59E0B" />
              <span style={{color: '#F59E0B'}}>📦 Clear Inventory</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={styles.loadingContainer}>
          <Clock size={20} color="#3B82F6" />
          <span style={styles.loadingText}>
            {activeTab === 'sales' ? 'AI is creating your sales action plan...' : 'AI is analyzing your question...'}
          </span>
        </div>
      )}

      {/* 🆕 ENHANCED ANSWERS LIST */}
      <div style={styles.answersContainer}>
        {answers.map((item) => (
          <div key={item.id} style={
            item.type === 'sales_advice' 
              ? { ...styles.answerCard, ...styles.salesAnswerCard }
              : styles.answerCard
          }>
            {/* 🆕 SALES HEADER */}
            {item.type === 'sales_advice' && (
              <div style={styles.salesHeader}>
                <TrendingUp size={18} color="#DC2626" />
                <span style={styles.salesHeaderText}>🚀 SALES ACTION PLAN</span>
              </div>
            )}
            
            {/* 🆕 ACTIONS LIST FOR SALES ADVICE */}
            {item.type === 'sales_advice' && item.actions && item.actions.length > 0 && (
              <div style={styles.actionsContainer}>
                <strong style={styles.actionsTitle}>Immediate Actions:</strong>
                {item.actions.map((action, index) => (
                  <div key={index} style={styles.actionItem}>
                    <div style={styles.actionBullet}>•</div>
                    <span style={styles.actionText}>{action}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* EXISTING QUESTION SECTION */}
            <div style={styles.questionSection}>
              <Zap size={16} color="#3B82F6" />
              <strong style={styles.questionText}>{item.question}</strong>
            </div>
            
            {/* EXISTING ANSWER SECTION */}
            <div style={styles.answerSection}>
              <p style={styles.answerText}>{item.answer}</p>
              <div style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {answers.length === 0 && !loading && (
          <div style={styles.emptyState}>
            <Brain size={48} color="#D1D5DB" />
            <h3 style={styles.emptyTitle}>
              {activeTab === 'sales' ? 'No sales questions yet' : 'No questions yet'}
            </h3>
            <p style={styles.emptyText}>
              {activeTab === 'sales' 
                ? 'Ask for urgent sales help or use the templates above to get immediate action plans.'
                : 'Ask your first business question to get AI-powered insights tailored to your African business context.'
              }
            </p>
            <div style={styles.exampleQuestions}>
              <strong>Try asking:</strong>
              <ul style={styles.exampleList}>
                {activeTab === 'sales' ? (
                  <>
                    <li>"Sales are down 50% this month - emergency help!"</li>
                    <li>"How to clear slow-moving inventory fast?"</li>
                    <li>"Best pricing strategy to beat competitors?"</li>
                  </>
                ) : (
                  <>
                    <li>"How can I increase customer engagement on Instagram?"</li>
                    <li>"What's the best pricing strategy for my fashion boutique?"</li>
                    <li>"How do I handle customer complaints effectively?"</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    minHeight: '400px'
  },
  header: {
    marginBottom: '24px'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: 0
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  // 🆕 TAB STYLES
  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: '16px'
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    color: 'white',
    borderColor: '#3B82F6'
  },
  // 🆕 SALES TEMPLATES STYLES
  salesTemplatesContainer: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#FEF2F2',
    borderRadius: '8px',
    border: '1px solid #FECACA'
  },
  salesTemplatesTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#DC2626',
    margin: '0 0 12px 0'
  },
  salesTemplatesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px'
  },
  salesTemplateButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%'
  },
  // 🆕 SALES ANSWER STYLES
  salesAnswerCard: {
    borderLeft: '4px solid #DC2626',
    backgroundColor: '#FEF2F2'
  },
  salesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#FECACA',
    borderRadius: '6px 6px 0 0',
    margin: '-16px -16px 12px -16px'
  },
  salesHeaderText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#DC2626'
  },
  actionsContainer: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #FECACA',
    marginBottom: '12px'
  },
  actionsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: '8px',
    display: 'block'
  },
  actionItem: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px'
  },
  actionBullet: {
    color: '#DC2626',
    fontWeight: 'bold'
  },
  actionText: {
    fontSize: '13px',
    color: '#374151',
    flex: 1
  },
  // EXISTING STYLES - KEEP AS IS
  errorContainer: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px'
  },
  errorText: {
    color: '#DC2626',
    fontSize: '14px',
    fontWeight: '500'
  },
  inputContainer: {
    marginBottom: '24px'
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  submitButton: {
    padding: '12px 16px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#EFF6FF',
    border: '1px solid #DBEAFE',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  loadingText: {
    color: '#3B82F6',
    fontSize: '14px'
  },
  answersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  answerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #E5E7EB'
  },
  questionSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  questionText: {
    color: '#1F2937',
    fontSize: '16px'
  },
  answerSection: {
    paddingLeft: '24px'
  },
  answerText: {
    color: '#4B5563',
    lineHeight: '1.6',
    margin: '0 0 8px 0',
    whiteSpace: 'pre-wrap'
  },
  timestamp: {
    fontSize: '12px',
    color: '#9CA3AF'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6B7280'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '16px 0 8px 0'
  },
  emptyText: {
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  exampleQuestions: {
    textAlign: 'left',
    maxWidth: '400px',
    margin: '0 auto'
  },
  exampleList: {
    marginTop: '8px',
    paddingLeft: '20px'
  }
};

export default BusinessAnswers;