// src/pages/BusinessIntelligence/BusinessAnswers.jsx
import React, { useState } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Send, Brain, Clock, Zap } from 'lucide-react';

const BusinessAnswers = () => {
  const { user } = useSupabase();
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    // TODO: Integrate with your QSTN bot command
    setTimeout(() => {
      setAnswers(prev => [{
        id: Date.now(),
        question,
        answer: "This is where your QSTN bot AI will provide intelligent answers based on African business context...",
        timestamp: new Date()
      }, ...prev]);
      setQuestion('');
      setLoading(false);
    }, 1000);
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

      {/* Question Input */}
      <form onSubmit={handleSubmit} style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything about your business... (e.g., How to increase sales? Best pricing strategy?)"
            style={styles.input}
            disabled={loading}
          />
          <button 
            type="submit" 
            style={styles.submitButton}
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
        
        {answers.length === 0 && (
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
  inputContainer: {
    marginBottom: '32px'
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
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
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
    margin: '0 0 8px 0'
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