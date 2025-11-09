// src/components/BusinessHealthScore.jsx
import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const BusinessHealthScore = ({ score = 78 }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Your business is thriving';
    if (score >= 60) return 'Good! Some areas need attention';
    return 'Needs improvement - focus on key areas';
  };

  return (
    <div style={styles.container}>
      <div style={styles.scoreCircle}>
        <div style={{
          ...styles.scoreFill,
          background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #E5E7EB 0deg)`
        }}>
          <div style={styles.scoreInner}>
            <span style={styles.scoreNumber}>{score}</span>
            <span style={styles.scoreLabel}>/100</span>
          </div>
        </div>
      </div>
      <div style={styles.scoreInfo}>
        <h3 style={styles.scoreTitle}>Business Health</h3>
        <p style={styles.scoreMessage}>{getScoreMessage(score)}</p>
        <div style={styles.improvementTips}>
          <div style={styles.tip}>
            <CheckCircle size={16} color="#10B981" />
            <span>Content quality: Excellent</span>
          </div>
          <div style={styles.tip}>
            <AlertCircle size={16} color="#F59E0B" />
            <span>Engagement: Needs improvement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    minWidth: '350px'
  },
  scoreCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#E5E7EB',
    position: 'relative'
  },
  scoreFill: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative'
  },
  scoreInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70px',
    height: '70px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1F2937'
  },
  scoreLabel: {
    fontSize: '12px',
    color: '#6B7280'
  },
  scoreInfo: {
    flex: 1
  },
  scoreTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 4px 0'
  },
  scoreMessage: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 12px 0'
  },
  improvementTips: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  tip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#6B7280'
  }
};

export default BusinessHealthScore;