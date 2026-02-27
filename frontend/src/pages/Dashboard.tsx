import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [deadlines, setDeadlines] = useState([
    { id: 1, title: 'GST Return Filing', type: 'GST', dueDate: '2024-03-20', priority: 'high' },
    { id: 2, title: 'PAN-Aadhaar Linking', type: 'PAN', dueDate: '2024-03-25', priority: 'medium' },
    { id: 3, title: 'Trade License Renewal', type: 'License', dueDate: '2024-04-10', priority: 'low' },
  ])

  const [recentDocuments, setRecentDocuments] = useState([
    { id: 1, name: 'GST Certificate.pdf', uploadDate: '2024-02-20', status: 'processed' },
    { id: 2, name: 'PAN Card.jpg', uploadDate: '2024-02-18', status: 'processed' },
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

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
          <p className="text-3xl font-bold text-warning mt-2">1</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {deadlines.map(deadline => (
              <div key={deadline.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{deadline.title}</p>
                  <p className="text-sm text-gray-600">{deadline.type} • Due: {deadline.dueDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                  deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
          <Link to="/compliance" className="btn btn-primary w-full mt-4">
            View All Compliance
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Documents</h2>
          <div className="space-y-3">
            {recentDocuments.map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-sm text-gray-600">Uploaded: {doc.uploadDate}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/upload" className="btn btn-primary w-full mt-4">
            Upload New Document
          </Link>
        </div>
      </div>
    </div>
  )
}
