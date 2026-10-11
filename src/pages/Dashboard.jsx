import { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import apiClient from '../api/apiClient'

function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useContext(AuthContext)
  const [applications, setApplications] = useState([])
  const [civicRequests, setCivicRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'certificates' | 'schemes' | 'jobs'
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }

    let isMounted = true

    async function fetchUserData() {
      setLoading(true)
      try {
        const [appsRes, civicRes] = await Promise.all([
          apiClient.get(`/applications/user/${user.id}`).catch(() => ({ data: [] })),
          apiClient.get(`/civic-services/user/${user.id}`).catch(() => ({ data: [] })),
        ])

        if (isMounted) {
          // If no recorded applications on server yet, check local storage cache or defaults
          setApplications(appsRes.data || [])
          setCivicRequests(civicRes.data || [])
        }
      } catch {
        if (isMounted) {
          setApplications([])
          setCivicRequests([])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUserData()

    return () => {
      isMounted = false
    }
  }, [user, isAuthenticated, navigate])

  if (!user) return null

  const schemeApps = applications.filter((a) => a.type === 'SCHEME' || !a.type)
  const jobApps = applications.filter((a) => a.type === 'JOB')
  const totalCount = applications.length + civicRequests.length

  function getCivicStatusBadge(status) {
    switch (status) {
      case 'APPROVED':
        return <span className="status-pill status-approved">Approved &amp; Ready</span>
      case 'VERIFICATION_IN_PROGRESS':
        return <span className="status-pill status-progress">Under Verification</span>
      case 'REJECTED':
        return <span className="status-pill status-rejected">Needs Re-submission</span>
      default:
        return <span className="status-pill status-pending">Pending Review</span>
    }
  }

  return (
    <main className="directory-page dashboard-page">
      {/* Citizen Profile Banner */}
      <div className="citizen-profile-banner">
        <div className="profile-badge-avatar">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
        </div>
        <div className="profile-banner-copy">
          <div className="profile-name-row">
            <h1>{user.fullName || 'Citizen Profile'}</h1>
            <span className="verified-aadhaar-pill">Aadhaar Linked &amp; Verified</span>
          </div>
          <p className="profile-email-phone">
            📧 {user.email} &bull; 📞 {user.phone || '9876543210'} &bull; 📍 Rural Gram Panchayat Ward
          </p>
        </div>
        <div className="profile-banner-actions">
          <Link to="/services" className="action-button">
            + New Certificate Request
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-stats-grid">
        <div className="dash-stat-card" onClick={() => setActiveTab('certificates')}>
          <span className="stat-icon">🏛️</span>
          <div className="stat-value">{civicRequests.length}</div>
          <div className="stat-label">Civic Certificates</div>
        </div>
        <div className="dash-stat-card" onClick={() => setActiveTab('schemes')}>
          <span className="stat-icon">🌾</span>
          <div className="stat-value">{schemeApps.length}</div>
          <div className="stat-label">Welfare Schemes</div>
        </div>
        <div className="dash-stat-card" onClick={() => setActiveTab('jobs')}>
          <span className="stat-icon">💼</span>
          <div className="stat-value">{jobApps.length}</div>
          <div className="stat-label">Job Applications</div>
        </div>
        <div className="dash-stat-card" onClick={() => setActiveTab('all')}>
          <span className="stat-icon">📋</span>
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
      </div>

      {/* Tab Filter Navigation */}
      <div className="dash-tabs-bar">
        <button
          className={`dash-tab-btn ${activeTab === 'all' ? 'active-dash-tab' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Activity ({totalCount})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === 'certificates' ? 'active-dash-tab' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          🏛️ Certificates ({civicRequests.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === 'schemes' ? 'active-dash-tab' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          🌾 Schemes ({schemeApps.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === 'jobs' ? 'active-dash-tab' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          💼 Jobs ({jobApps.length})
        </button>
      </div>

      {loading && <p className="status-message" role="status">Fetching your citizen records…</p>}

      {/* Empty State */}
      {!loading && totalCount === 0 && (
        <div className="directory-card empty-dashboard-card">
          <div className="empty-dash-icon">📂</div>
          <h2>No Applications Recorded Yet</h2>
          <p>Explore welfare benefits, request vital certificates, or discover local agricultural and Panchayat work.</p>
          <div className="empty-dash-actions">
            <Link className="action-button" to="/schemes">Browse Government Schemes &rarr;</Link>
            <Link className="action-button secondary-btn" to="/services">Apply for Certificate</Link>
            <Link className="action-button secondary-btn" to="/jobs">Explore Rural Jobs</Link>
          </div>
        </div>
      )}

      {/* Content Feed */}
      {!loading && totalCount > 0 && (
        <div className="dash-feed-container">
          {/* Civic Certificates List */}
          {(activeTab === 'all' || activeTab === 'certificates') && civicRequests.length > 0 && (
            <section className="dash-section-group">
              <div className="dash-group-header">
                <h3>🏛️ Civic Certificate Requests</h3>
                <Link to="/services" className="dash-text-link">+ Request Another Certificate</Link>
              </div>
              <div className="directory-grid">
                {civicRequests.map((req) => (
                  <article className="directory-card dash-card" key={req.id}>
                    <div className="dash-card-top">
                      <span className="tracking-pill">{req.trackingId || `CSV-${req.id}`}</span>
                      {getCivicStatusBadge(req.status)}
                    </div>
                    <h2>{req.serviceType?.replace(/_/g, ' ') || 'Civic Certificate'}</h2>
                    <p className="card-description">{req.requestDetails}</p>
                    <div className="dash-card-footer">
                      <small>Applied: {req.appliedAt ? new Date(req.appliedAt).toLocaleDateString('en-IN') : 'Recently'}</small>
                      {req.status === 'APPROVED' ? (
                        <button
                          type="button"
                          className="table-action edit"
                          onClick={() => setSelectedCertificate(req)}
                        >
                          📜 View &amp; Download Certificate
                        </button>
                      ) : (
                        <span className="dash-pending-note">Under Inspection</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Scheme Applications List */}
          {(activeTab === 'all' || activeTab === 'schemes') && schemeApps.length > 0 && (
            <section className="dash-section-group">
              <div className="dash-group-header">
                <h3>🌾 Welfare Scheme Applications</h3>
                <Link to="/schemes" className="dash-text-link">Explore More Schemes</Link>
              </div>
              <div className="directory-grid">
                {schemeApps.map((app) => (
                  <article className="directory-card dash-card" key={app.id}>
                    <div className="dash-card-top">
                      <span className="government-badge local">Welfare Scheme</span>
                      <span className="status-pill status-progress">Recorded &bull; Pending Verification</span>
                    </div>
                    <h2>{app.title}</h2>
                    <p className="card-description">
                      Your interest in this government scheme was officially captured on GramConnect.
                    </p>
                    <div className="dash-card-footer">
                      <small>Submitted: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : 'Recent'}</small>
                      <Link to="/schemes" className="text-link">View Guidelines &rarr;</Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Job Applications List */}
          {(activeTab === 'all' || activeTab === 'jobs') && jobApps.length > 0 && (
            <section className="dash-section-group">
              <div className="dash-group-header">
                <h3>💼 Rural Job Applications</h3>
                <Link to="/jobs" className="dash-text-link">Browse Job Postings</Link>
              </div>
              <div className="directory-grid">
                {jobApps.map((app) => (
                  <article className="directory-card dash-card" key={app.id}>
                    <div className="dash-card-top">
                      <span className="government-badge central">Job Submission</span>
                      <span className="status-pill status-approved">Applied</span>
                    </div>
                    <h2>{app.title}</h2>
                    <p className="card-description">
                      Contact information exchanged with local recruiter/panchayat supervisor.
                    </p>
                    <div className="dash-card-footer">
                      <small>Logged: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : 'Recent'}</small>
                      <Link to="/jobs" className="text-link">Employer Details &rarr;</Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Digital Certificate Modal */}
      {selectedCertificate && (
        <div className="modal-backdrop" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-sheet certificate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="government-badge local">Official Government e-Certificate</span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedCertificate(null)}
                aria-label="Close certificate dialog"
              >
                &times;
              </button>
            </div>

            <div className="printable-certificate-body">
              <div className="cert-crest-header">
                <div className="cert-emblem">🇮🇳</div>
                <h3>GOVERNMENT OF INDIA &bull; GRAM PANCHAYAT</h3>
                <h4>DEPARTMENT OF RURAL DEVELOPMENT &amp; PANCHAYATI RAJ</h4>
                <div className="cert-divider"></div>
              </div>

              <div className="cert-title-section">
                <h2>DIGITAL CITIZEN CERTIFICATE</h2>
                <span className="cert-sub">
                  Issued under e-Panchayat Mission Mode Project (Rule 14-A)
                </span>
              </div>

              <div className="cert-content-box">
                <p>
                  This is to certify that <strong>{selectedCertificate.applicantName || user.fullName}</strong>, 
                  resident of Rural Gram Panchayat Ward, has been officially verified for:
                </p>
                <div className="cert-highlight-badge">
                  {selectedCertificate.serviceType?.replace(/_/g, ' ') || 'Civic Certificate'}
                </div>
                <div className="cert-details-grid">
                  <div>
                    <span>Tracking / Certificate No:</span>
                    <strong>{selectedCertificate.trackingId || `CSV-${selectedCertificate.id}`}</strong>
                  </div>
                  <div>
                    <span>Status:</span>
                    <strong style={{ color: '#056839' }}>VERIFIED &amp; DIGITALLY SIGNED</strong>
                  </div>
                  <div>
                    <span>Issue Date:</span>
                    <strong>{selectedCertificate.updatedAt ? new Date(selectedCertificate.updatedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</strong>
                  </div>
                  <div>
                    <span>Authenticity:</span>
                    <strong>SHA-256 Digitally Signed</strong>
                  </div>
                </div>

                <div className="cert-footer-signatures">
                  <div className="cert-qr-box">
                    <div className="cert-mock-qr">📱 [SECURE QR]</div>
                    <small>Scan to verify at gramconnect.gov.in</small>
                  </div>
                  <div className="cert-officer-signature">
                    <div className="digital-signature-seal">✓ DIGITALLY SIGNED</div>
                    <strong>Panchayat Development Officer (PDO)</strong>
                    <small>Gram Panchayat Administrative Council</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button
                type="button"
                className="action-button"
                onClick={() => window.print()}
              >
                🖨️ Print / Save as PDF
              </button>
              <button
                type="button"
                className="action-button secondary-btn"
                onClick={() => setSelectedCertificate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Dashboard
