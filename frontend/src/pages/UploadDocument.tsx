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
    setResult(null)
    
    try {
      const token = localStorage.getItem('userToken')
      const apiUrl = import.meta.env.VITE_API_URL || 'https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod'
      
      // Step 1: Get presigned URL for upload
      const uploadResponse = await fetch(`${apiUrl}/documents/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type
        })
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl, documentId } = await uploadResponse.json()

      // Step 2: Upload file to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      // Step 3: Wait a bit for processing, then get analysis
      setTimeout(async () => {
        try {
          const analysisResponse = await fetch(`${apiUrl}/documents/${documentId}/analyze`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json()
            setResult({
              documentType: analysisData.analysis?.documentType || 'Unknown Document',
              formNumber: analysisData.analysis?.formNumber,
              summary: analysisData.analysis?.summary || 'Document processed successfully',
              keyInformation: analysisData.analysis?.keyInformation || [],
              requiredActions: analysisData.analysis?.requiredActions || [],
              importantFields: analysisData.analysis?.importantFields || [],
              detectedForm: analysisData.detectedForm,
              detectionConfidence: analysisData.detectionConfidence
            })
          }
        } catch (error) {
          console.error('Error analyzing document:', error)
          setResult({
            documentType: 'Processing',
            summary: 'Document uploaded successfully. Analysis in progress...',
            keyInformation: [],
            requiredActions: []
          })
        } finally {
          setUploading(false)
        }
      }, 3000) // Wait 3 seconds for OCR processing

    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload document. Please try again.')
      setUploading(false)
    }
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
            {result.formNumber && (
              <p className="text-sm text-gray-600 mt-1">Form: {result.formNumber}</p>
            )}
            {result.detectedForm && (
              <div className="mt-2 p-3 bg-blue-50 rounded">
                <p className="text-sm font-medium text-blue-900">{result.detectedForm.name}</p>
                <p className="text-xs text-blue-700">
                  {result.detectedForm.category} • {result.detectedForm.authority}
                </p>
                {result.detectionConfidence && (
                  <p className="text-xs text-blue-600 mt-1">
                    Confidence: {result.detectionConfidence}%
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Summary</h3>
            <p className="text-gray-700">{result.summary}</p>
          </div>

          {result.keyInformation && result.keyInformation.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Key Information Required</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.keyInformation.map((info: string, i: number) => (
                  <li key={i} className="text-gray-700">{info}</li>
                ))}
              </ul>
            </div>
          )}

          {result.requiredActions && result.requiredActions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Required Actions</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.requiredActions.map((action: string, i: number) => (
                  <li key={i} className="text-gray-700">{action}</li>
                ))}
              </ul>
            </div>
          )}

          {result.importantFields && result.importantFields.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Important Fields to Fill</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.importantFields.map((field: string, i: number) => (
                  <li key={i} className="text-gray-700">{field}</li>
                ))}
              </ul>
            </div>
          )}

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
