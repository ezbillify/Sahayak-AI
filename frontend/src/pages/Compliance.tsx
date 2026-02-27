import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Calendar from '../components/Calendar'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import TextArea from '../components/TextArea'

export default function Compliance() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const [deadlines] = useState([
    {
      id: '1',
      title: 'GST Return Filing - GSTR-3B',
      type: 'GST' as const,
      description: 'Monthly GST return filing',
      dueDate: new Date('2024-03-20'),
      priority: 'high' as const,
      status: 'pending'
    },
    {
      id: '2',
      title: 'PAN-Aadhaar Linking',
      type: 'PAN' as const,
      description: 'Link PAN with Aadhaar',
      dueDate: new Date('2024-03-25'),
      priority: 'medium' as const,
      status: 'pending'
    },
    {
      id: '3',
      title: 'Trade License Renewal',
      type: 'License' as const,
      description: 'Renew trade license',
      dueDate: new Date('2024-04-10'),
      priority: 'low' as const,
      status: 'pending'
    }
  ])

  const calendarEvents = deadlines.map(d => ({
    id: d.id,
    date: d.dueDate,
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

      {viewMode === 'list' ? (
        <div className="grid gap-4">
          {deadlines.map((deadline) => (
            <Card key={deadline.id} variant="bordered">
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
                    <span>📅 Due: {deadline.dueDate.toLocaleDateString()}</span>
                    <span>⏰ {Math.ceil((deadline.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">View Details</Button>
                  <Button size="sm" variant="success">Mark Complete</Button>
                </div>
              </div>
            </Card>
          ))}
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
            <Button onClick={() => setShowAddModal(false)}>
              Add Compliance
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g., GST Return Filing" required />
          
          <Select
            label="Type"
            options={[
              { value: 'gst', label: 'GST' },
              { value: 'pan', label: 'PAN' },
              { value: 'license', label: 'License' },
              { value: 'tax', label: 'Tax' },
              { value: 'other', label: 'Other' }
            ]}
            placeholder="Select type"
            required
          />

          <TextArea
            label="Description"
            placeholder="Add details about this compliance requirement"
            rows={3}
          />

          <Input label="Due Date" type="date" required />

          <Select
            label="Priority"
            options={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
            placeholder="Select priority"
            required
          />
        </div>
      </Modal>
    </div>
  )
}
