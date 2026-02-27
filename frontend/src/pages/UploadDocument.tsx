import { useState } from 'react'

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    
    // Simulate upload and processing
    setTimeout(() => {
      setResult({
        documentType: 'GST Registration Form',
        summary: 'This is a GST registration application form for new businesses. It requires basic business information, owner details, and bank account information.',
        keyInformation: [
          'Business Name and Address',
          'PAN Number',
          'Bank Account Details',
          'Business Activity Type'
        ],
        requiredActions: [
          'Fill all mandatory fields marked with *',
          'Attach PAN card copy',
          'Attach address proof',
          'Submit within 30 days of business commencement'
        ]
      })
      setUploading(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Document</h1>

      <div className="card">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">Upload Government Document</h3>
          <p className="text-gray-600 mb-4">
            Supported formats: PDF, JPG, PNG (Max 10MB)
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
            Choose File
          </label>
          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
        </div>

        {file && !result && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn btn-primary w-full mt-6"
          >
            {uploading ? 'Processing...' : 'Upload and Analyze'}
          </button>
        )}
      </div>

      {result && (
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Document Type</h3>
            <p className="text-gray-700">{result.documentType}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Summary</h3>
            <p className="text-gray-700">{result.summary}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Key Information Required</h3>
            <ul className="list-disc list-inside space-y-1">
              {result.keyInformation.map((info: string, i: number) => (
                <li key={i} className="text-gray-700">{info}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Required Actions</h3>
            <ul className="list-disc list-inside space-y-1">
              {result.requiredActions.map((action: string, i: number) => (
                <li key={i} className="text-gray-700">{action}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              setFile(null)
              setResult(null)
            }}
            className="btn btn-secondary w-full mt-6"
          >
            Upload Another Document
          </button>
        </div>
      )}
    </div>
  )
}
