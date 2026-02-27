import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Simplify Government Paperwork with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Upload documents, get instant explanations in your language, fill forms correctly, 
          and never miss a compliance deadline.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link to="/upload" className="btn btn-secondary text-lg px-8 py-3">
            Upload Document
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">Document Analysis</h3>
          <p className="text-gray-600">
            Upload PDFs or images. Our AI extracts text and explains everything in simple language.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Form Assistance</h3>
          <p className="text-gray-600">
            Get step-by-step guidance for GST, PAN, licenses, and tax forms with auto-fill.
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-xl font-semibold mb-2">Deadline Tracking</h3>
          <p className="text-gray-600">
            Never miss a compliance deadline. Get reminders 30, 7, and 1 day before.
          </p>
        </div>
      </div>

      <div className="mt-16 card">
        <h2 className="text-3xl font-bold mb-6">Supported Services</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span>GST Registration & Returns</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span>PAN Card Services</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span>Business Licenses</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span>Income Tax Filing</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span>Aadhaar Linking</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span>Trade Licenses</span>
          </div>
        </div>
      </div>
    </div>
  )
}
