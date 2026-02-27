import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadDocument from './pages/UploadDocument'
import Compliance from './pages/Compliance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<UploadDocument />} />
          <Route path="compliance" element={<Compliance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
