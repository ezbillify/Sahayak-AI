import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Calendar from '../components/Calendar'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import TextArea from '../components/TextArea'

const API_URL = import.meta.env.VITE_API_URL || 'https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod'

export default function Compliance() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [deadlines, setDeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  })

  useEffect(() => {
    fetchCompliance()
  }, [])

  const fetchCompliance = async () => {
    try {
      // Try to get userId from localStorage
      let userId = localStorage.getItem('userId')
      
      // Fallback: if userId not found, try to get it from userData
      if (!userId) {
        const userData = localStorage.getItem('userData')
        if (userData) {
          const user = JSON.parse(userData)
          userId = user.userId || user.sub
          // Store it for future use
          if (userId) {
            localStorage.setItem('userId', userId)
          }
        }
      }
      
      if (!userId) {
        console.error('No userId found')
        setLoading(false)
        return
      }

      const res = await fetch(`${API_URL}/compliance/user?userId=${userId}`)
      const data = await res.json()
      
      if (data.compliance) {
        setDeadlines(data.compliance)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching compliance:', error)
      setLoading(false)
    }
  }

  const handleAddCompliance = async () => {
    try {
      // Try to get userId from localStorage
      let userId = localStorage.getItem('userId')
      
      // Fallback: if userId not found, try to get it from userData
      if (!userId) {
        const userData = localStorage.getItem('userData')
        if (userData) {
          const user = JSON.parse(userData)
          userId = user.userId || user.sub
          // Store it for future use
          if (userId) {
            localStorage.setItem('userId', userId)
          }
        }
      }
      
      if (!userId) {
        alert('Please login first')
        return
      }

      if (!formData.title || !formData.type || !formData.dueDate) {
        alert('Please fill all required fields')
        return
      }

      const res = await fetch(`${API_URL}/compliance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        alert('Compliance added successfully!')
        setShowAddModal(false)
        setFormData({
          title: '',
          type: '',
          description: '',
          dueDate: '',
          priority: 'medium'
        })
        fetchCompliance() // Refresh list
      } else {
        alert(data.error || 'Failed to add compliance')
      }
    } catch (error) {
      console.error('Error adding compliance:', error)
      alert('Failed to add compliance')
    }
  }

  const handleMarkComplete = async (complianceId: string) => {
    try {
      const res = await fetch(`${API_URL}/compliance/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complianceId,
          status: 'completed'
        })
      })

      if (res.ok) {
        alert('Compliance marked as complete!')
        fetchCompliance() // Refresh list
      } else {
        alert('Failed to update compliance')
      }
    } catch (error) {
      console.error('Error updating compliance:', error)
      alert('Failed to update compliance')
    }
  }

  const calendarEvents = deadlines
    .filter((d: any) => d.status === 'pending')
    .map((d: any) => ({
      id: d.complianceId,
      date: new Date(d.dueDate),
      title: d.title,
      type: d.type,
      priority: d.priority
    }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Compliance Tracking</h1>
        <div className="flex gap-3">
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              Calendar
            </button>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            + Add Compliance
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading compliance items...</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid gap-4">
          {deadlines.filter((d: any) => d.status === 'pending').length === 0 ? (
            <p className="text-gray-500 text-center py-12">No compliance items yet. Add one to get started!</p>
          ) : (
            deadlines
              .filter((d: any) => d.status === 'pending')
              .map((deadline: any) => {
                const daysLeft = Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <Card key={deadline.complianceId} variant="bordered">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{deadline.title}</h3>
                          <Badge variant={
                            deadline.type === 'GST' ? 'primary' :
                            deadline.type === 'PAN' ? 'info' :
                            deadline.type === 'License' ? 'success' : 'gray'
                          }>
                            {deadline.type}
                          </Badge>
                          <Badge variant={
                            deadline.priority === 'high' ? 'danger' :
                            deadline.priority === 'medium' ? 'warning' : 'success'
                          }>
                            {deadline.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{deadline.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 Due: {new Date(deadline.dueDate).toLocaleDateString()}</span>
                          <span>⏰ {daysLeft} days left</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => handleMarkComplete(deadline.complianceId)}>
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })
          )}
        </div>
      ) : (
        <Calendar events={calendarEvents} />
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Compliance Item"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCompliance}>
              Add Compliance
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Title" 
            placeholder="e.g., GST Return Filing" 
            required 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          
          <Select
            label="Type"
            options={[
              { value: 'GST', label: 'GST' },
              { value: 'PAN', label: 'PAN' },
              { value: 'License', label: 'License' },
              { value: 'Tax', label: 'Tax' },
              { value: 'Other', label: 'Other' }
            ]}
            placeholder="Select type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />

          <TextArea
            label="Description"
            placeholder="Add details about this compliance requirement"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input 
            label="Due Date" 
            type="date" 
            required 
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <Select
            label="Priority"
            options={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
            placeholder="Select priority"
            required
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  )
}
