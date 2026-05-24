import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import ClientDashboard from './components/ClientDashboard'
import { login as apiLogin, getMe } from './services/api'

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('partapex_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Verify token is still valid
        getMe()
          .then(data => {
            setUser({ ...parsed, ...data.user })
            setPage(data.user.role === 'admin' ? 'admin' : 'client')
          })
          .catch(() => {
            localStorage.removeItem('partapex_user')
          })
      } catch {
        localStorage.removeItem('partapex_user')
      }
    }
  }, [])

  // Sync logout across all tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'partapex_user' && !e.newValue) {
        setUser(null)
        setPage('home')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogin = async (email, password) => {
    try {
      const data = await apiLogin(email, password)
      const userData = { token: data.token, ...data.user }
      localStorage.setItem('partapex_user', JSON.stringify(userData))
      setUser(userData)
      setPage(data.user.role === 'admin' ? 'admin' : 'client')
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('partapex_user')
    setUser(null)
    setPage('home')
  }

  if (page === 'login') {
    return <Login onLogin={handleLogin} onBack={() => setPage('home')} />
  }

  if (page === 'admin' && user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />
  }

  if (page === 'client' && user?.role === 'client') {
    return <ClientDashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen">
      <Navbar onLogin={() => setPage('login')} />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
