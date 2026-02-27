import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if admin user
    const isAdmin = email === 'admin@ezbillify.com'
    
    // Store dummy token for authentication
    localStorage.setItem('userToken', 'dummy-token-' + Date.now())
    localStorage.setItem('userData', JSON.stringify({ 
      email, 
      name: isAdmin ? 'Admin' : 'User',
      isAdmin 
    }))
    
    // Redirect based on user type
    if (isAdmin) {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
    
    window.location.reload() // Reload to update header
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

          <Button type="submit" fullWidth>
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
