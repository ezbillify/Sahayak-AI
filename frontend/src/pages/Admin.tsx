import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Tabs from '../components/Tabs'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Modal from '../components/Modal'

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null) // null = loading
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddFormModal, setShowAddFormModal] = useState(false)
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Real data from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDocuments: 0,
    documentsToday: 0,
    avgAccuracy: 0,
    systemUptime: 0
  })

  const [users, setUsers] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [forms, setForms] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [trainingStatus, setTrainingStatus] = useState('')

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      setIsAdmin(user.email === 'admin@ezbillify.com' || user.isAdmin)
      
      // Fetch admin data if user is admin
      if (user.email === 'admin@ezbillify.com' || user.isAdmin) {
        fetchAdminData()
      }
    } else {
      setIsAdmin(false)
    }
  }, [])

  const fetchAdminData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('userToken')
        const apiUrl = import.meta.env.VITE_API_URL || 'https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod'

        // Fetch stats, users, and documents in parallel
        const [statsRes, usersRes, docsRes] = await Promise.all([
          fetch(`${apiUrl}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/admin/documents?status=${statusFilter}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setUsers(usersData.users || [])

          // Generate recent activity from users and documents
          const activities = []
          if (usersData.users && usersData.users.length > 0) {
            const recentUser = usersData.users[0]
            activities.push({
              type: 'user',
              title: 'New user registration',
              description: `${recentUser.email} joined`,
              time: new Date(recentUser.createdDate).toLocaleString()
            })
          }
          setRecentActivity(activities)
        }

        if (docsRes.ok) {
          const docsData = await docsRes.json()
          setDocuments(docsData.documents || [])
        }

        // Load forms from API
        const formsRes = await fetch(`${apiUrl}/admin/forms`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (formsRes.ok) {
          const formsData = await formsRes.json()
          setForms(formsData.forms || [])
        }
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setLoading(false)
      }
    }

  const [newForm, setNewForm] = useState({
    name: '',
    category: '',
    authority: '',
    keywords: '',
    fields: ''
  })

  // Show loading while checking admin status
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const handleAddForm = async () => {
      if (!newForm.name || !newForm.category || !newForm.authority) {
        alert('Please fill in all required fields')
        return
      }

      try {
        const token = localStorage.getItem('userToken')
        const apiUrl = import.meta.env.VITE_API_URL || 'https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod'

        const response = await fetch(`${apiUrl}/admin/forms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newForm)
        })

        const data = await response.json()

        if (data.success) {
          alert('Form added successfully!')
          setShowAddFormModal(false)
          setNewForm({ name: '', category: '', authority: '', keywords: '', fields: '' })
          fetchAdminData()
        } else {
          alert(data.error || 'Failed to add form')
        }
      } catch (error) {
        console.error('Error adding form:', error)
        alert('Network error. Please try again.')
      }
    }

  const handleTrainSystem = async () => {
      setTrainingStatus('Starting training...')
      try {
        const token = localStorage.getItem('userToken')
        const apiUrl = import.meta.env.VITE_API_URL || 'https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod'

        const response = await fetch(`${apiUrl}/admin/train`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          setTrainingStatus(`Training started! Session ID: ${data.sessionId}. Estimated time: ${data.estimatedTime}`)
          setTimeout(() => {
            setShowTrainingModal(false)
            setTrainingStatus('')
            alert('Training completed successfully!')
            fetchAdminData()
          }, 3000)
        } else {
          setTrainingStatus('Training failed')
          alert(data.error || 'Failed to start training')
        }
      } catch (error) {
        console.error('Error starting training:', error)
        setTrainingStatus('Network error')
        alert('Network error. Please try again.')
      }
    }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, documents, and system configuration</p>
      </div>

      <Tabs
        tabs={[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'users', label: 'Users' },
          { id: 'documents', label: 'Documents' },
          { id: 'forms', label: 'Form Database' },
          { id: 'training', label: 'AI Training' },
          { id: 'analytics', label: 'Analytics' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-sm text-green-600 mt-1">↑ {stats.activeUsers} active</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Documents</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
                    <p className="text-sm text-green-600 mt-1">↑ {stats.documentsToday} today</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Accuracy</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgAccuracy}%</p>
                    <p className="text-sm text-gray-600 mt-1">System uptime: {stats.systemUptime}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
                {documents.length > 0 && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Document processed</p>
                      <p className="text-sm text-gray-600">{documents[0].formType} - {documents[0].accuracy}% accuracy</p>
                    </div>
                    <span className="text-sm text-gray-500">Recently</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">User Management</h3>
              <Input 
                placeholder="Search users..." 
                className="w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Documents</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users
                      .filter(user => 
                        !searchTerm || 
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{user.name}</td>
                          <td className="px-4 py-3 text-sm">{user.email}</td>
                          <td className="px-4 py-3 text-sm capitalize">{user.userType}</td>
                          <td className="px-4 py-3 text-sm">{new Date(user.createdDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{user.documentsUploaded}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No users found</p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Document Management</h3>
              <div className="flex gap-3">
                <Select
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'processed', label: 'Processed' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'uploaded', label: 'Uploaded' }
                  ]}
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    fetchAdminData()
                  }}
                />
                <Input 
                  placeholder="Search documents..." 
                  className="w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading documents...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">File Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Form Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Upload Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documents
                      .filter(doc => 
                        !searchTerm || 
                        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doc.formType.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{doc.fileName}</td>
                          <td className="px-4 py-3 text-sm">{doc.userName}</td>
                          <td className="px-4 py-3 text-sm">{doc.formType}</td>
                          <td className="px-4 py-3 text-sm">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={doc.status === 'processed' ? 'success' : 'warning'}>
                              {doc.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {doc.accuracy ? `${doc.accuracy}%` : '-'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {documents.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No documents found</p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Forms Database Tab */}
        {activeTab === 'forms' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Form Database Management</h3>
              <Button onClick={() => setShowAddFormModal(true)}>
                Add New Form
              </Button>
            </div>
            <p className="text-gray-600 mb-4">
              Currently managing {forms.length} forms. Add new forms to improve detection accuracy.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Government Forms</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {forms.filter(f => f.category === 'identity' || f.category === 'tax' || f.category === 'business').length}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Bank Forms</h4>
                <p className="text-2xl font-bold text-green-600">
                  {forms.filter(f => f.category === 'banking').length}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Other Forms</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {forms.filter(f => f.category === 'transport' || f.category === 'other').length}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Form Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Authority</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Keywords</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {forms.slice(0, 10).map((form, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{form.name}</td>
                      <td className="px-4 py-3 text-sm capitalize">{form.category}</td>
                      <td className="px-4 py-3 text-sm">{form.authority}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {form.keywords.slice(0, 3).join(', ')}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* AI Training Tab */}
        {activeTab === 'training' && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">AI Model Training</h3>
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold mb-3">Current Model Performance</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Overall Accuracy</p>
                    <p className="text-2xl font-bold text-green-600">94.5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Training Samples</p>
                    <p className="text-2xl font-bold text-blue-600">5,634</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Trained</p>
                    <p className="text-2xl font-bold text-gray-900">1h ago</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-semibold mb-3">Training Actions</h4>
                <div className="space-y-3">
                  <Button onClick={() => setShowTrainingModal(true)} fullWidth>
                    Start New Training Session
                  </Button>
                  <Button variant="secondary" fullWidth>
                    Export Training Data
                  </Button>
                  <Button variant="secondary" fullWidth>
                    View Training History
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold mb-4">Usage Analytics</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart: Daily Active Users (Last 30 Days)</p>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold mb-4">Document Processing Analytics</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart: Documents Processed by Form Type</p>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold mb-4">Accuracy Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart: Model Accuracy Over Time</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      <Modal
        isOpen={showAddFormModal}
        onClose={() => setShowAddFormModal(false)}
        title="Add New Form to Database"
      >
        <div className="space-y-4">
          <Input
            label="Form Name"
            value={newForm.name}
            onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
            placeholder="e.g., Aadhaar Update Form"
          />
          <Select
            label="Category"
            value={newForm.category}
            onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
            options={[
              { value: 'identity', label: 'Identity' },
              { value: 'tax', label: 'Tax' },
              { value: 'business', label: 'Business' },
              { value: 'banking', label: 'Banking' },
              { value: 'transport', label: 'Transport' }
            ]}
            placeholder="Select category"
          />
          <Input
            label="Authority"
            value={newForm.authority}
            onChange={(e) => setNewForm({ ...newForm, authority: e.target.value })}
            placeholder="e.g., UIDAI"
          />
          <Input
            label="Keywords (comma-separated)"
            value={newForm.keywords}
            onChange={(e) => setNewForm({ ...newForm, keywords: e.target.value })}
            placeholder="e.g., aadhaar, uid, uidai, update"
          />
          <Input
            label="Expected Fields (comma-separated)"
            value={newForm.fields}
            onChange={(e) => setNewForm({ ...newForm, fields: e.target.value })}
            placeholder="e.g., Name, DOB, Address"
          />
          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddForm} fullWidth>Add Form</Button>
            <Button variant="secondary" onClick={() => setShowAddFormModal(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Training Modal */}
      <Modal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        title="Start Training Session"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This will start a new training session using all processed documents. 
            The system will analyze {documents.length} documents to improve accuracy.
          </p>
          {trainingStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">{trainingStatus}</p>
            </div>
          )}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Warning: Training will use AWS Bedrock resources and may incur additional costs.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleTrainSystem} fullWidth disabled={!!trainingStatus}>
              {trainingStatus ? 'Training...' : 'Start Training'}
            </Button>
            <Button variant="secondary" onClick={() => setShowTrainingModal(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
