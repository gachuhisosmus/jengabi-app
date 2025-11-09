// src/pages/BusinessIntelligence/index.jsx
import React, { useState } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Brain, MessageCircle, Target, HelpCircle, TrendingUp, Users, BarChart3 } from 'lucide-react';
import MarketingIdeas from './MarketingIdeas';
import BusinessAnswers from './BusinessAnswers';
import CustomerInsights from './CustomerInsights';
import StrategyPlans from './StrategyPlans';
import BusinessHealthScore from '../../components/BusinessHealthScore';

const BusinessIntelligence = () => {
  const { user } = useSupabase();
  const [activeModule, setActiveModule] = useState('marketing-ideas'); // Set default to existing module

  const modules = [
    {
      id: 'marketing-ideas',
      title: 'Marketing Ideas',
      description: 'AI content ideas for your platforms',
      icon: Brain,
      color: '#3B82F6',
      component: MarketingIdeas
    },
    {
      id: 'business-answers',
      title: 'Business Answers',
      description: 'Get answers to business questions',
      icon: HelpCircle, 
      color: '#10B981',
      component: BusinessAnswers
    },
    {
      id: 'customer-insights',
      title: 'Customer Insights',
      description: 'Analyze messages & feedback',
      icon: MessageCircle,
      color: '#8B5CF6',
      component: CustomerInsights
    },
    {
      id: 'strategy-plans',
      title: 'Strategy Plans',
      description: 'Marketing & growth strategies',
      icon: Target,
      color: '#F59E0B',
      component: StrategyPlans
    }
  ];

  const renderActiveModule = () => {
    const module = modules.find(m => m.id === activeModule);
    if (!module) {
      // Fallback to first module if activeModule doesn't exist
      const ModuleComponent = modules[0].component;
      return <ModuleComponent />;
    }
    
    const ModuleComponent = module.component;
    return <ModuleComponent />;
  };

  return (
    <div style={styles.container}>
      {/* Header with Business Health Score */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Business Intelligence Hub</h1>
          <p style={styles.subtitle}>AI-powered insights for your business growth</p>
        </div>
        <BusinessHealthScore />
      </div>

      {/* Module Navigation */}
      <div style={styles.moduleGrid}>
        {modules.map((module) => (
          <div
            key={module.id}
            style={{
              ...styles.moduleCard,
              borderColor: activeModule === module.id ? module.color : '#E5E7EB'
            }}
            onClick={() => setActiveModule(module.id)}
          >
            <div style={{ ...styles.iconContainer, backgroundColor: `${module.color}20` }}>
              <module.icon size={24} color={module.color} />
            </div>
            <div style={styles.moduleInfo}>
              <h3 style={styles.moduleTitle}>{module.title}</h3>
              <p style={styles.moduleDescription}>{module.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Module Content */}
      <div style={styles.moduleContent}>
        {renderActiveModule()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    padding: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  iconContainer: {
    padding: '12px',
    borderRadius: '8px',
    flexShrink: 0
  },
  moduleInfo: {
    flex: 1
  },
  moduleTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 8px 0'
  },
  moduleDescription: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
    lineHeight: '1.4'
  },
  moduleContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    minHeight: '400px',
    padding: '20px'
  }
};

export default BusinessIntelligence;