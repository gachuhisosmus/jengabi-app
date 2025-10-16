import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Calendar, 
  FileText,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react'

const ContentManager = () => {
  const [contentTasks, setContentTasks] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedView, setSelectedView] = useState('list')

  // Simple mock data
  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'Product Launch Announcement',
        type: 'post',
        platform: 'instagram',
        due_date: '2024-01-20',
        description: 'Exciting news! Launching our new African print collection.',
        status: 'scheduled',
      },
      {
        id: 2,
        title: 'Behind the Scenes Story',
        type: 'story',
        platform: 'instagram',
        due_date: '2024-01-18',
        description: 'Sneak peek of our artisans at work.',
        status: 'draft',
      }
    ]
    setContentTasks(mockTasks)
  }, [])

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      padding: '24px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    button: {
      primary: {
        backgroundColor: '#3B82F6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      secondary: {
        backgroundColor: 'white',
        color: '#374151',
        border: '1px solid #D1D5DB',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }
    }
  }

  const handleDeleteTask = (taskId) => {
    setContentTasks(contentTasks.filter(task => task.id !== taskId))
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0' }}>
              Content Manager
            </h1>
            <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
              Plan, create, and manage your content across all platforms
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={styles.button.primary}
          >
            <Plus size={16} />
            New Content
          </button>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setSelectedView('calendar')}
            style={{
              ...styles.button.secondary,
              backgroundColor: selectedView === 'calendar' ? '#3B82F6' : 'white',
              color: selectedView === 'calendar' ? 'white' : '#374151',
            }}
          >
            <Calendar size={16} />
            Calendar View
          </button>
          <button
            onClick={() => setSelectedView('list')}
            style={{
              ...styles.button.secondary,
              backgroundColor: selectedView === 'list' ? '#3B82F6' : 'white',
              color: selectedView === 'list' ? 'white' : '#374151',
            }}
          >
            <FileText size={16} />
            List View
          </button>
        </div>

        {/* Content */}
        <div style={styles.card}>
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 20px 0' }}>
              {selectedView === 'calendar' ? 'Calendar View' : 'List View'}
            </h2>
            
            {selectedView === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contentTasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                        Due: {task.due_date} • Platform: {task.platform} • Status: {task.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={styles.button.secondary}>
                        <Edit3 size={12} />
                        Edit
                      </button>
                      <button 
                        style={{
                          ...styles.button.secondary,
                          backgroundColor: '#FEF2F2',
                          borderColor: '#FECACA',
                          color: '#DC2626'
                        }}
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedView === 'calendar' && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Calendar View
                </h3>
                <p style={{ margin: 0 }}>
                  Calendar functionality coming soon. Currently in list view.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Simple Create Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              ...styles.card,
              width: '90%',
              maxWidth: '500px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                  Create New Content
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Content Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter content title..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={styles.button.secondary}
                  >
                    Cancel
                  </button>
                  <button
                    style={styles.button.primary}
                  >
                    <Save size={16} />
                    Create Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentManager