// src/pages/BusinessIntelligence/BusinessAnswers.jsx
import React, { useState } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Send, Brain, Clock, Zap } from 'lucide-react';

const BusinessAnswers = () => {
  const { user } = useSupabase();
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    const response = await fetch(`${API_BASE}/api/bot/business-answers`, {
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Brain size={24} color="#10B981" />
          <h2 style={styles.title}>Business Answers</h2>
        </div>
        <p style={styles.subtitle}>Ask any business question and get AI-powered answers</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>❌ {error}</div>
        </div>
      )}

      {/* Question Input */}
      <form onSubmit={handleSubmit} style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything about your business... (e.g., How to increase sales? Best pricing strategy?)"
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
              backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
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

      {/* Loading Indicator */}
      {loading && (
        <div style={styles.loadingContainer}>
          <Clock size={20} color="#3B82F6" />
          <span style={styles.loadingText}>AI is analyzing your question...</span>
        </div>
      )}

      {/* Answers List */}
      <div style={styles.answersContainer}>
        {answers.map((item) => (
          <div key={item.id} style={styles.answerCard}>
            <div style={styles.questionSection}>
              <Zap size={16} color="#3B82F6" />
              <strong style={styles.questionText}>{item.question}</strong>
            </div>
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
            <h3 style={styles.emptyTitle}>No questions yet</h3>
            <p style={styles.emptyText}>
              Ask your first business question to get AI-powered insights tailored to your African business context.
            </p>
            <div style={styles.exampleQuestions}>
              <strong>Try asking:</strong>
              <ul style={styles.exampleList}>
                <li>"How can I increase customer engagement on Instagram?"</li>
                <li>"What's the best pricing strategy for my fashion boutique?"</li>
                <li>"How do I handle customer complaints effectively?"</li>
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