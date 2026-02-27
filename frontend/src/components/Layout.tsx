import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Sahayak AI
            </Link>
            <div className="flex gap-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-primary">
                Dashboard
              </Link>
              <Link to="/upload" className="text-gray-700 hover:text-primary">
                Upload
              </Link>
              <Link to="/compliance" className="text-gray-700 hover:text-primary">
                Compliance
              </Link>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
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
