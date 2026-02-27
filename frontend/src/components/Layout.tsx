import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken')
    setIsLoggedIn(!!token)
    
    // Check if user is admin
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      setIsAdmin(user.email === 'admin@ezbillify.com' || user.isAdmin)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    setIsLoggedIn(false)
    setIsAdmin(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Sahayak AI
            </Link>
            <div className="flex gap-6 items-center">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/upload" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Upload
                  </Link>
                  <Link to="/compliance" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Compliance
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ml-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
