import { useState, useContext } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function WarliLogo() {
  return (
    <div className="warli-logo-wrapper">
      <svg className="warli-logo" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="23" fill="#056839" />
        <circle cx="24" cy="24" r="21.5" fill="none" stroke="#e5b64f" strokeWidth="1" strokeDasharray="3 2" />
        <g fill="none" stroke="#FAF9F6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
          <path d="M10 23c3-4 6-4 9 0 3-5 7-5 10 0 3-4 6-4 9 0M11 24l5 2 3-2m0 0 5 2 3-2m0 0 5 2 5-2" />
          <path d="m16 27 3 7 3-7m4 0 3 7 3-7" />
          <path d="M19 35h-3m10 0h-3m10 0h-3" />
        </g>
        <g fill="#FAF9F6">
          <circle cx="14" cy="18" r="2.5" />
          <circle cx="24" cy="15" r="2.5" />
          <circle cx="34" cy="18" r="2.5" />
        </g>
      </svg>
    </div>
  )
}

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function handleSignOut() {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  function closeMobile() {
    setMobileMenuOpen(false)
  }

  return (
    <header className="site-header" data-route={pathname}>
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="GramConnect home" onClick={closeMobile}>
          <WarliLogo />
          <div className="brand-copy">
            <strong>GramConnect</strong>
            <small>Unified Citizen Services &amp; Welfare Portal</small>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="site-nav desktop-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-nav' : '')}>
            Home
          </NavLink>
          <NavLink to="/schemes" className={({ isActive }) => (isActive ? 'active-nav' : '')}>
            Schemes
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'active-nav' : '')}>
            Jobs
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'active-nav' : '')}>
            Certificates &amp; Services
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-nav' : '')}>
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active-admin' : ''}`}
            >
              ⚙️ Admin Portal
            </NavLink>
          )}

          <div className="nav-auth-group">
            {isAuthenticated ? (
              <div className="user-profile-badge">
                <span className="user-name-pill" title={user.email}>
                  👤 {user.fullName ? user.fullName.split(' ')[0] : 'Citizen'}
                </span>
                <button
                  className="login-link signout-link"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <NavLink className="login-link" to="/login">
                Citizen Login &rarr;
              </NavLink>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? 'bar-top' : ''}`}></span>
          <span className={`hamburger-bar ${mobileMenuOpen ? 'bar-mid' : ''}`}></span>
          <span className={`hamburger-bar ${mobileMenuOpen ? 'bar-bot' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMobile}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="drawer-title">GramConnect Menu</span>
              <button
                type="button"
                className="drawer-close"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>

            <nav className="mobile-nav-links">
              <NavLink to="/" end onClick={closeMobile}>
                🏡 Home
              </NavLink>
              <NavLink to="/schemes" onClick={closeMobile}>
                🌾 Government Schemes
              </NavLink>
              <NavLink to="/jobs" onClick={closeMobile}>
                💼 Rural Job Postings
              </NavLink>
              <NavLink to="/services" onClick={closeMobile}>
                🏛️ Certificates &amp; Civic Services
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/dashboard" onClick={closeMobile}>
                  📋 Citizen Dashboard
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin" onClick={closeMobile} className="mobile-admin-link">
                  ⚙️ Admin Management Portal
                </NavLink>
              )}
            </nav>

            <div className="mobile-drawer-footer">
              {isAuthenticated ? (
                <div className="mobile-user-box">
                  <p>Signed in as <strong>{user.fullName || user.email}</strong></p>
                  <button
                    className="action-button secondary-btn full-width"
                    type="button"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <NavLink
                  className="action-button full-width"
                  to="/login"
                  onClick={closeMobile}
                >
                  Citizen Login / Register &rarr;
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
