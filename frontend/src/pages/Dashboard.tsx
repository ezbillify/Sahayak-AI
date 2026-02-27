import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod'

export default function Dashboard() {
  const [deadlines, setDeadlines] = useState([])
  const [recentDocuments, setRecentDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.error('No userId found')
        setLoading(false)
        return
      }

      // Fetch user's compliance items
      const complianceRes = await fetch(`${API_URL}/compliance/user?userId=${userId}`)
      const complianceData = await complianceRes.json()
      
      if (complianceData.compliance) {
        // Filter only pending items and sort by due date
        const pendingDeadlines = complianceData.compliance
          .filter(item => item.status === 'pending')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5) // Show only top 5
        setDeadlines(pendingDeadlines)
      }

      // Fetch user's documents
      const docsRes = await fetch(`${API_URL}/documents/user?userId=${userId}`)
      const docsData = await docsRes.json()
      
      if (docsData.documents) {
        // Sort by upload date and take most recent 5
        const recent = docsData.documents
          .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
          .slice(0, 5)
        setRecentDocuments(recent)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-blue-50 border-l-4 border-primary">
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Deadlines</h3>
              <p className="text-3xl font-bold text-primary mt-2">{deadlines.length}</p>
            </div>
            <div className="card bg-green-50 border-l-4 border-success">
              <h3 className="text-lg font-semibold text-gray-700">Documents Processed</h3>
              <p className="text-3xl font-bold text-success mt-2">{recentDocuments.length}</p>
            </div>
            <div className="card bg-yellow-50 border-l-4 border-warning">
              <h3 className="text-lg font-semibold text-gray-700">Pending Actions</h3>
              <p className="text-3xl font-bold text-warning mt-2">{deadlines.filter(d => {
                const daysLeft = Math.ceil((new Date(d.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                return daysLeft <= 7
              }).length}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
              {deadlines.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
              ) : (
                <div className="space-y-3">
                  {deadlines.map(deadline => {
                    const daysLeft = Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={deadline.complianceId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{deadline.title}</p>
                          <p className="text-sm text-gray-600">{deadline.type} • Due: {new Date(deadline.dueDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                          deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {daysLeft} days
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              <Link to="/compliance" className="btn btn-primary w-full mt-4">
                View All Compliance
              </Link>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Recent Documents</h2>
              {recentDocuments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map(doc => (
                    <div key={doc.documentId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{doc.fileName || 'Document'}</p>
                        <p className="text-sm text-gray-600">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {doc.status || 'processed'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/upload" className="btn btn-primary w-full mt-4">
                Upload New Document
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
