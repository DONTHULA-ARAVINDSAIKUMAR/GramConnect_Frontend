import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AiWidget from './components/AiWidget'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Login from './pages/Login'
import Register from './pages/Register'
import Schemes from './pages/Schemes'
import CivicServices from './pages/CivicServices'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell page-transition">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/services" element={<CivicServices />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
          <AiWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

