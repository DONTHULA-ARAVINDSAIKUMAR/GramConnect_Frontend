import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { AuthContext } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleAuthenticate(loginEmail, loginPassword) {
    setError('')
    setSubmitting(true)

    try {
      const response = await apiClient.post('/users/login', {
        email: loginEmail,
        password: loginPassword,
      })
      const user = response.data
      login(user, 'gc-auth-token-verified')

      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (loginError) {
      // If backend mock fallback is needed when testing locally without live MySQL
      if (loginEmail === 'danphe91@gmail.com' && loginPassword === 'password123') {
        const citizenUser = {
          id: 1,
          email: 'danphe91@gmail.com',
          fullName: 'Danphe Citizen',
          phone: '9876543210',
          role: 'CITIZEN',
        }
        login(citizenUser, 'gc-demo-token-citizen')
        navigate('/dashboard', { replace: true })
        return
      }
      if (loginEmail === 'admin@gramconnect.in' && loginPassword === 'admin123') {
        const adminUser = {
          id: 2,
          email: 'admin@gramconnect.in',
          fullName: 'GramConnect Admin',
          phone: '9876543211',
          role: 'ADMIN',
        }
        login(adminUser, 'gc-demo-token-admin')
        navigate('/admin', { replace: true })
        return
      }

      if (loginError.response && loginError.response.status === 401) {
        setError('Invalid email or password. Use demo credentials or register a new citizen profile.')
      } else {
        setError(loginError.response?.data?.message || 'Could not connect to GramConnect server. Please verify the backend is running.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    handleAuthenticate(email, password)
  }

  function handleQuickLogin(role) {
    if (role === 'admin') {
      setEmail('admin@gramconnect.in')
      setPassword('admin123')
      handleAuthenticate('admin@gramconnect.in', 'admin123')
    } else {
      setEmail('danphe91@gmail.com')
      setPassword('password123')
      handleAuthenticate('danphe91@gmail.com', 'password123')
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <span className="eyebrow">Citizen access</span>
        <h1 id="login-title">Sign In to GramConnect</h1>
        <p className="login-intro">Access your centralized welfare tracker, job applications, and civic certificates.</p>

        {/* Quick Demo Login Pill Bar */}
        <div className="demo-login-box">
          <span className="demo-login-label">Quick 1-Click Demo Login:</span>
          <div className="demo-login-buttons">
            <button
              type="button"
              className="demo-btn citizen-demo-btn"
              onClick={() => handleQuickLogin('citizen')}
              disabled={submitting}
            >
              👤 Citizen Demo
            </button>
            <button
              type="button"
              className="demo-btn admin-demo-btn"
              onClick={() => handleQuickLogin('admin')}
              disabled={submitting}
            >
              ⚙️ Admin Demo
            </button>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-field">
            <div className="label-with-action">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="show-pwd-btn"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="action-button full-width" type="submit" disabled={submitting}>
            {submitting ? 'Authenticating…' : 'Sign in to Portal'} <span aria-hidden="true">&rarr;</span>
          </button>
        </form>

        <p className="login-back" style={{ marginTop: '1.25rem' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '700', color: '#056839' }}>Register free account &rarr;</Link>
        </p>
        <p className="login-back">
          <Link to="/">Return to home</Link>
        </p>
      </section>

      <aside className="login-note">
        <div className="note-card-inner">
          <div className="note-emblem">GC</div>
          <h2>Verified Citizen Desk</h2>
          <p>Your single secure account to track government welfare benefits, rural recruitment status, and block-level certificates.</p>

          <div className="login-credentials-guide">
            <strong>Default Demo Credentials:</strong>
            <div className="cred-row">
              <span>Citizen:</span>
              <code>danphe91@gmail.com / password123</code>
            </div>
            <div className="cred-row">
              <span>Admin:</span>
              <code>admin@gramconnect.in / admin123</code>
            </div>
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Login