import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: '',
    language: 'english'
  })
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store dummy token for authentication
    localStorage.setItem('userToken', 'dummy-token-' + Date.now())
    localStorage.setItem('userData', JSON.stringify({ 
      email: formData.email, 
      name: formData.name,
      userType: formData.userType,
      language: formData.language
    }))
    navigate('/dashboard')
    window.location.reload() // Reload to update header
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="card max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Create Your Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 98765 43210"
              required
            />

            <Select
              label="User Type"
              value={formData.userType}
              onChange={(e) => setFormData({...formData, userType: e.target.value})}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'freelancer', label: 'Freelancer' },
                { value: 'business', label: 'Small Business Owner' },
                { value: 'individual', label: 'Individual' }
              ]}
              placeholder="Select user type"
              required
            />
          </div>

          <Select
            label="Preferred Language"
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
            options={[
              { value: 'english', label: 'English' },
              { value: 'hindi', label: 'हिंदी (Hindi)' },
              { value: 'tamil', label: 'தமிழ் (Tamil)' },
              { value: 'telugu', label: 'తెలుగు (Telugu)' },
              { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
              { value: 'bengali', label: 'বাংলা (Bengali)' },
              { value: 'marathi', label: 'मराठी (Marathi)' },
              { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
              { value: 'malayalam', label: 'മലയാളം (Malayalam)' },
              { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' }
            ]}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" fullWidth>
            Create Account
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
