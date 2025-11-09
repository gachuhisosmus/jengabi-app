import React, { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { 
  Plus, 
  Calendar, 
  FileText, 
  Instagram, 
  Facebook, 
  Twitter,
  Youtube,
  Clock,
  Zap,
  Image,
  Video,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react'

const ContentManager = () => {
  const { user, supabase } = useSupabase()
  const [contentTasks, setContentTasks] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedView, setSelectedView] = useState('calendar') // 'calendar' or 'list'
  const [editingTask, setEditingTask] = useState(null)

  const [newTask, setNewTask] = useState({
    title: '',
    type: 'post',
    platform: 'instagram',
    due_date: '',
    description: '',
    status: 'draft'
  })

  // Professional color scheme
  const colors = {
    primary: '#3B82F6',
    primaryDark: '#1D4ED8',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '24px'
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    button: {
      primary: {
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease-in-out'
      },
      secondary: {
        backgroundColor: colors.card,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease-in-out'
      }
    }
  }

  const contentTypes = [
    { id: 'post', name: 'Post', icon: FileText, color: colors.primary },
    { id: 'story', name: 'Story', icon: Image, color: '#8B5CF6' },
    { id: 'reel', name: 'Reel/Video', icon: Video, color: '#EC4899' },
    { id: 'carousel', name: 'Carousel', icon: Image, color: '#10B981' }
  ]

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'tiktok', name: 'TikTok', icon: Clock, color: '#000000' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' }
  ]

  const statusOptions = [
    { id: 'draft', name: 'Draft', color: colors.warning },
    { id: 'scheduled', name: 'Scheduled', color: colors.primary },
    { id: 'published', name: 'Published', color: colors.success }
  ]

  // Load mock data
  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'Product Launch Announcement',
        type: 'post',
        platform: 'instagram',
        due_date: '2024-01-20',
        description: 'Exciting news! Launching our new African print collection. Limited stock available! #AfricanFashion #NewCollection',
        status: 'scheduled',
        created_at: '2024-01-15'
      },
      {
        id: 2,
        title: 'Behind the Scenes Story',
        type: 'story',
        platform: 'instagram',
        due_date: '2024-01-18',
        description: 'Sneak peek of our artisans at work. Handcrafting beautiful pieces with love and dedication. #BehindTheScenes #ArtisanMade',
        status: 'draft',
        created_at: '2024-01-16'
      },
      {
        id: 3,
        title: 'Customer Testimonial Video',
        type: 'reel',
        platform: 'facebook',
        due_date: '2024-01-22',
        description: 'Hear what our customers are saying about our products! Real stories, real satisfaction. #CustomerLove #Testimonial',
        status: 'draft',
        created_at: '2024-01-14'
      }
    ]
    setContentTasks(mockTasks)
  }, [])

  const handleCreateTask = () => {
    const task = {
      id: Date.now(), // Temporary ID
      ...newTask,
      created_at: new Date().toISOString().split('T')[0]
    }
    setContentTasks([...contentTasks, task])
    setShowCreateModal(false)
    setNewTask({
      title: '',
      type: 'post',
      platform: 'instagram',
      due_date: '',
      description: '',
      status: 'draft'
    })
  }

  const handleUpdateTask = () => {
    const updatedTasks = contentTasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    )
    setContentTasks(updatedTasks)
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId) => {
    setContentTasks(contentTasks.filter(task => task.id !== taskId))
  }

  const generateAIContent = () => {
    // This would integrate with your AI bot
    const aiContent = `🎉 New content idea generated!\n\nShowcase your products in action with real customer stories. Perfect for engaging your African audience and building trust with potential customers.\n\n#AfricanBusiness #CustomerSpotlight #AuthenticContent`
    if (editingTask) {
      setEditingTask({ ...editingTask, description: aiContent })
    } else {
      setNewTask({ ...newTask, description: aiContent })
    }
  }

  const getStatusColor = (status) => {
    const statusMap = {
      draft: colors.warning,
      scheduled: colors.primary,
      published: colors.success
    }
    return statusMap[status] || colors.textLight
  }

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find(p => p.id === platformId)
    return platform ? platform.icon : FileText
  }

  const getTypeIcon = (typeId) => {
    const type = contentTypes.find(t => t.id === typeId)
    return type ? type.icon : FileText
  }

  // Calendar view components
  const CalendarView = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    // Simple calendar generation for current month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    const calendarDays = []
    
    // Add empty days for first week
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i)
    }

    const getTasksForDay = (day) => {
      if (!day) return []
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return contentTasks.filter(task => task.due_date === dateStr)
    }

    return (
      <div style={styles.card}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: 0 }}>
              Content Calendar - {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={styles.button.secondary}>
                ← Prev
              </button>
              <button style={styles.button.secondary}>
                Today
              </button>
              <button style={styles.button.secondary}>
                Next →
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: colors.border }}>
            {days.map(day => (
              <div key={day} style={{
                backgroundColor: colors.card,
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: colors.text,
                fontSize: '14px'
              }}>
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDay(day)
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: colors.card,
                    minHeight: '120px',
                    padding: '8px',
                    border: `1px solid ${colors.border}`,
                    position: 'relative'
                  }}
                >
                  {day && (
                    <>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: '4px'
                      }}>
                        {day}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {dayTasks.slice(0, 2).map(task => {
                          const PlatformIcon = getPlatformIcon(task.platform)
                          return (
                            <div
                              key={task.id}
                              style={{
                                fontSize: '10px',
                                padding: '2px 4px',
                                backgroundColor: `${getStatusColor(task.status)}20`,
                                color: getStatusColor(task.status),
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                cursor: 'pointer'
                              }}
                              onClick={() => setEditingTask(task)}
                            >
                              <PlatformIcon size={8} />
                              {task.title.slice(0, 12)}...
                            </div>
                          )
                        })}
                        {dayTasks.length > 2 && (
                          <div style={{
                            fontSize: '10px',
                            color: colors.textLight,
                            textAlign: 'center'
                          }}>
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const ListView = () => (
    <div style={styles.card}>
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.text, margin: '0 0 20px 0' }}>
          All Content Tasks
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {contentTasks.map(task => {
            const PlatformIcon = getPlatformIcon(task.platform)
            const TypeIcon = getTypeIcon(task.type)
            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: colors.background,
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F1F5F9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background
                }}
                onClick={() => setEditingTask(task)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlatformIcon size={20} color={colors.textLight} />
                    <TypeIcon size={16} color={colors.textLight} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textLight }}>
                      Due: {new Date(task.due_date).toLocaleDateString()} • 
                      Status: <span style={{ color: getStatusColor(task.status) }}>{task.status}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      ...styles.button.secondary,
                      padding: '6px 8px',
                      fontSize: '12px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingTask(task)
                    }}
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>
                  <button
                    style={{
                      ...styles.button.secondary,
                      padding: '6px 8px',
                      fontSize: '12px',
                      backgroundColor: '#FEF2F2',
                      borderColor: '#FECACA',
                      color: '#DC2626'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTask(task.id)
                    }}
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const TaskModal = ({ task, onSave, onClose, isEditing }) => {
    const [formData, setFormData] = useState(task)

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '20px'
      }}>
        <div style={{
          ...styles.card,
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.text, margin: 0 }}>
                {isEditing ? 'Edit Content' : 'Create New Content'}
              </h2>
              <button
                onClick={onClose}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: colors.textLight
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
                  Content Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.border
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Type & Platform */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
                    Content Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  >
                    {contentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  >
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>{platform.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  >
                    {statusOptions.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>
                    Content Description
                  </label>
                  <button
                    type="button"
                    onClick={generateAIContent}
                    style={{
                      ...styles.button.secondary,
                      padding: '6px 12px',
                      fontSize: '12px'
                    }}
                  >
                    <Zap size={12} />
                    AI Generate
                  </button>
                </div>
                <textarea
                  rows="6"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.border
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={styles.button.secondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.button.primary}
                >
                  <Save size={16} />
                  {isEditing ? 'Update Content' : 'Create Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.text, margin: '0 0 8px 0' }}>
              Content Manager
            </h1>
            <p style={{ fontSize: '16px', color: colors.textLight, margin: 0 }}>
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
              backgroundColor: selectedView === 'calendar' ? colors.primary : colors.card,
              color: selectedView === 'calendar' ? 'white' : colors.text,
              borderColor: selectedView === 'calendar' ? colors.primary : colors.border
            }}
          >
            <Calendar size={16} />
            Calendar View
          </button>
          <button
            onClick={() => setSelectedView('list')}
            style={{
              ...styles.button.secondary,
              backgroundColor: selectedView === 'list' ? colors.primary : colors.card,
              color: selectedView === 'list' ? 'white' : colors.text,
              borderColor: selectedView === 'list' ? colors.primary : colors.border
            }}
          >
            <FileText size={16} />
            List View
          </button>
        </div>

        {/* Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={styles.card}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary, marginBottom: '4px' }}>
                {contentTasks.length}
              </div>
              <div style={{ fontSize: '14px', color: colors.textLight }}>Total Tasks</div>
            </div>
          </div>
          <div style={styles.card}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.warning, marginBottom: '4px' }}>
                {contentTasks.filter(t => t.status === 'draft').length}
              </div>
              <div style={{ fontSize: '14px', color: colors.textLight }}>Drafts</div>
            </div>
          </div>
          <div style={styles.card}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.success, marginBottom: '4px' }}>
                {contentTasks.filter(t => t.status === 'published').length}
              </div>
              <div style={{ fontSize: '14px', color: colors.textLight }}>Published</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {selectedView === 'calendar' ? <CalendarView /> : <ListView />}

        {/* Modals */}
        {showCreateModal && (
          <TaskModal
            task={newTask}
            onSave={handleCreateTask}
            onClose={() => setShowCreateModal(false)}
            isEditing={false}
          />
        )}

        {editingTask && (
          <TaskModal
            task={editingTask}
            onSave={handleUpdateTask}
            onClose={() => setEditingTask(null)}
            isEditing={true}
          />
        )}
      </div>
    </div>
  )
}

export default ContentManager