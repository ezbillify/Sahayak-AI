import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod'
      console.log('Login API URL:', apiUrl)
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('Login response status:', response.status)
      const data = await response.json()
      console.log('Login response data:', data)

      if (data.success) {
        // Store tokens and user data
        localStorage.setItem('userToken', data.tokens.accessToken)
        localStorage.setItem('idToken', data.tokens.idToken)
        localStorage.setItem('refreshToken', data.tokens.refreshToken)
        localStorage.setItem('userData', JSON.stringify(data.user))
        localStorage.setItem('userId', data.user.userId) // Store userId separately for easy access
        
        // Redirect based on user type
        if (data.user.isAdmin) {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
        
        window.location.reload() // Reload to update header
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Login to Sahayak AI</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Login
          </Button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
