import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Reset code sent to your email!' })
        setStep('reset')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send reset code' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' })
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reset password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-center text-gray-600 mb-8">
          {step === 'email' 
            ? 'Enter your email to receive a reset code' 
            : 'Enter the code sent to your email'}
        </p>

        {message && (
          <Alert variant={message.type} className="mb-6">
            {message.text}
          </Alert>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Send Reset Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <Input
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Reset Password
            </Button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-blue-600 hover:underline"
            >
              Didn't receive code? Send again
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
