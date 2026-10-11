import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import apiClient from '../api/apiClient'

// ──────────────────────────────────────────
// Reusable mini-form for Job or Scheme
// ──────────────────────────────────────────
function JobForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '', employer: '', location: '', description: '',
    wageOrSalary: '', contactInfo: '', applicationDeadline: '',
    applicationLink: '', governmentLevel: 'LOCAL',
    ...initial,
  })
  function field(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }
  return (
    <div className="admin-form">
      <div className="form-grid">
        <div className="form-field">
          <label>Job Title *</label>
          <input value={form.title} onChange={field('title')} required />
        </div>
        <div className="form-field">
          <label>Employer / Panchayat *</label>
          <input value={form.employer} onChange={field('employer')} required />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Location / Village</label>
          <input value={form.location} onChange={field('location')} />
        </div>
        <div className="form-field">
          <label>Wage / Salary</label>
          <input value={form.wageOrSalary} onChange={field('wageOrSalary')} placeholder="e.g. ₹600 / day" />
        </div>
      </div>

      <div className="form-field">
        <label>Job Description &amp; Qualifications</label>
        <textarea rows={3} value={form.description} onChange={field('description')} />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Contact Phone / Email</label>
          <input value={form.contactInfo} onChange={field('contactInfo')} />
        </div>
        <div className="form-field">
          <label>Application Deadline</label>
          <input type="date" value={form.applicationDeadline} onChange={field('applicationDeadline')} />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Application Portal Link</label>
          <input value={form.applicationLink} onChange={field('applicationLink')} placeholder="https://..." />
        </div>
        <div className="form-field">
          <label>Government Level</label>
          <select value={form.governmentLevel} onChange={field('governmentLevel')}>
            <option value="LOCAL">Local / Panchayat</option>
            <option value="STATE">State Level</option>
            <option value="CENTRAL">Central / National</option>
          </select>
        </div>
      </div>

      <div className="modal-actions-bar" style={{ marginTop: '1.5rem' }}>
        <button className="action-button" type="button" onClick={() => onSave(form)}>Save Job</button>
        <button className="action-button secondary-btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function SchemeForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '', description: '', eligibilityCriteria: '',
    requiredDocuments: '', applicationLink: '',
    ...initial,
  })
  function field(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }
  return (
    <div className="admin-form">
      <div className="form-field">
        <label>Scheme Name *</label>
        <input value={form.name} onChange={field('name')} required />
      </div>

      <div className="form-field">
        <label>Scheme Summary &amp; Benefits *</label>
        <textarea rows={3} value={form.description} onChange={field('description')} required />
      </div>

      <div className="form-field">
        <label>Eligibility Criteria</label>
        <textarea rows={2} value={form.eligibilityCriteria} onChange={field('eligibilityCriteria')} />
      </div>

      <div className="form-field">
        <label>Required Documents (comma separated)</label>
        <input value={form.requiredDocuments} onChange={field('requiredDocuments')} placeholder="Aadhaar Card, Bank Passbook, Land Records" />
      </div>

      <div className="form-field">
        <label>Official Application Portal Link</label>
        <input value={form.applicationLink} onChange={field('applicationLink')} placeholder="https://..." />
      </div>

      <div className="modal-actions-bar" style={{ marginTop: '1.5rem' }}>
        <button className="action-button" type="button" onClick={() => onSave(form)}>Save Scheme</button>
        <button className="action-button secondary-btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Main Admin Page
// ──────────────────────────────────────────
function Admin() {
  const navigate = useNavigate()
  const { user, isAdmin, isAuthenticated } = useContext(AuthContext)
  const [tab, setTab] = useState('jobs')  // 'jobs' | 'schemes' | 'civic' | 'users'
  const [jobs, setJobs] = useState([])
  const [schemes, setSchemes] = useState([])
  const [civicRequests, setCivicRequests] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState(null)   // null | 'new' | job object
  const [editingScheme, setEditingScheme] = useState(null)
  const [toast, setToast] = useState('')

  // Auth guard – only ADMIN role allowed
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    if (!isAdmin) {
      navigate('/', { replace: true })
      return
    }
    fetchAll()
  }, [isAuthenticated, isAdmin, navigate])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  async function fetchAll() {
    setLoading(true)
    try {
      const [j, s, u, c] = await Promise.all([
        apiClient.get('/jobs').catch(() => ({ data: [] })),
        apiClient.get('/schemes').catch(() => ({ data: [] })),
        apiClient.get('/users').catch(() => ({ data: [] })),
        apiClient.get('/civic-services').catch(() => ({ data: [] })),
      ])
      setJobs(j.data || [])
      setSchemes(s.data || [])
      setUsers(u.data || [])
      setCivicRequests(c.data || [])
    } catch {
      showToast('Data could not be refreshed. Ensure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // ── Jobs CRUD ──
  async function saveJob(form) {
    try {
      if (form.id) {
        await apiClient.put(`/jobs/${form.id}`, form)
        showToast('✓ Job posting updated.')
      } else {
        await apiClient.post('/jobs', form)
        showToast('✓ New job posting created.')
      }
      setEditingJob(null)
      fetchAll()
    } catch { showToast('Failed to save job.') }
  }

  async function deleteJob(id) {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return
    try {
      await apiClient.delete(`/jobs/${id}`)
      showToast('Job posting removed.')
      fetchAll()
    } catch { showToast('Failed to delete job.') }
  }

  // ── Schemes CRUD ──
  async function saveScheme(form) {
    try {
      if (form.id) {
        await apiClient.put(`/schemes/${form.id}`, form)
        showToast('✓ Welfare scheme updated.')
      } else {
        await apiClient.post('/schemes', form)
        showToast('✓ New scheme created.')
      }
      setEditingScheme(null)
      fetchAll()
    } catch { showToast('Failed to save scheme.') }
  }

  async function deleteScheme(id) {
    if (!window.confirm('Delete this scheme? This cannot be undone.')) return
    try {
      await apiClient.delete(`/schemes/${id}`)
      showToast('Scheme deleted.')
      fetchAll()
    } catch { showToast('Failed to delete scheme.') }
  }

  // ── Civic Services Status Update ──
  async function updateCivicStatus(id, newStatus) {
    try {
      await apiClient.patch(`/civic-services/${id}/status`, null, {
        params: { status: newStatus }
      })
      showToast(`✓ Certificate request updated to ${newStatus}`)
      fetchAll()
    } catch {
      showToast('Failed to update certificate status.')
    }
  }

  return (
    <main className="directory-page admin-page">
      {/* Toast */}
      {toast && (
        <div className="portal-floating-toast" role="status">
          {toast}
        </div>
      )}

      <div className="page-heading">
        <div className="admin-eyebrow-row">
          <span className="eyebrow">Administrative Control Center</span>
          <span className="admin-status-badge">Logged in as {user?.email}</span>
        </div>
        <h1>GramConnect Management</h1>
        <p>Oversee citizen certificate requests, add or update job postings, and configure welfare schemes.</p>
      </div>

      {/* Stat cards */}
      <div className="dashboard-stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="dash-stat-card" onClick={() => setTab('civic')}>
          <span className="stat-icon">🏛️</span>
          <div className="stat-value">{loading ? '…' : civicRequests.length}</div>
          <div className="stat-label">Certificate Requests</div>
        </div>
        <div className="dash-stat-card" onClick={() => setTab('jobs')}>
          <span className="stat-icon">💼</span>
          <div className="stat-value">{loading ? '…' : jobs.length}</div>
          <div className="stat-label">Active Job Notices</div>
        </div>
        <div className="dash-stat-card" onClick={() => setTab('schemes')}>
          <span className="stat-icon">📋</span>
          <div className="stat-value">{loading ? '…' : schemes.length}</div>
          <div className="stat-label">Government Schemes</div>
        </div>
        <div className="dash-stat-card" onClick={() => setTab('users')}>
          <span className="stat-icon">👥</span>
          <div className="stat-value">{loading ? '…' : users.length}</div>
          <div className="stat-label">Registered Citizens</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs-bar">
        <button
          className={`dash-tab-btn ${tab === 'civic' ? 'active-dash-tab' : ''}`}
          onClick={() => { setTab('civic'); setEditingJob(null); setEditingScheme(null) }}
        >
          🏛️ Certificate Requests ({civicRequests.length})
        </button>
        <button
          className={`dash-tab-btn ${tab === 'jobs' ? 'active-dash-tab' : ''}`}
          onClick={() => { setTab('jobs'); setEditingJob(null); setEditingScheme(null) }}
        >
          💼 Jobs ({jobs.length})
        </button>
        <button
          className={`dash-tab-btn ${tab === 'schemes' ? 'active-dash-tab' : ''}`}
          onClick={() => { setTab('schemes'); setEditingJob(null); setEditingScheme(null) }}
        >
          📋 Schemes ({schemes.length})
        </button>
        <button
          className={`dash-tab-btn ${tab === 'users' ? 'active-dash-tab' : ''}`}
          onClick={() => { setTab('users'); setEditingJob(null); setEditingScheme(null) }}
        >
          👥 Citizens ({users.length})
        </button>
      </div>

      {/* ── Civic Certificates Tab ── */}
      {tab === 'civic' && (
        <section className="admin-section-content">
          <div className="admin-header-row">
            <h2>Panchayat Certificate Requests ({civicRequests.length})</h2>
            <button className="action-button secondary-btn" onClick={fetchAll}>🔄 Refresh</button>
          </div>

          {loading ? <p className="status-message">Loading requests…</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Service Type</th>
                    <th>Applicant Name</th>
                    <th>Details</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {civicRequests.map((req) => (
                    <tr key={req.id}>
                      <td><strong>{req.trackingId || `CSV-${req.id}`}</strong></td>
                      <td><span className="service-tag">{req.serviceType?.replace(/_/g, ' ') || 'Certificate'}</span></td>
                      <td>{req.applicantName || 'Citizen'}</td>
                      <td style={{ maxWidth: '300px' }}>{req.requestDetails}</td>
                      <td>
                        <span className={`status-pill ${
                          req.status === 'APPROVED' ? 'status-approved' :
                          req.status === 'VERIFICATION_IN_PROGRESS' ? 'status-progress' :
                          req.status === 'REJECTED' ? 'status-rejected' : 'status-pending'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={req.status}
                          onChange={(e) => updateCivicStatus(req.id, e.target.value)}
                          className="status-dropdown-select"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="VERIFICATION_IN_PROGRESS">VERIFYING</option>
                          <option value="APPROVED">APPROVE</option>
                          <option value="REJECTED">REJECT</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {civicRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        No certificate requests currently pending.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Jobs Tab ── */}
      {tab === 'jobs' && (
        <section className="admin-section-content">
          <div className="admin-header-row">
            <h2>Rural Job Postings ({jobs.length})</h2>
            <button className="action-button" onClick={() => setEditingJob('new')}>+ Add New Job</button>
          </div>

          {editingJob && (
            <div className="directory-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #056839' }}>
              <h3>{editingJob === 'new' ? 'Create New Job Posting' : `Edit: ${editingJob.title}`}</h3>
              <JobForm initial={editingJob === 'new' ? {} : editingJob} onSave={saveJob} onCancel={() => setEditingJob(null)} />
            </div>
          )}

          {loading ? <p className="status-message">Loading…</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Employer</th>
                    <th>Location</th>
                    <th>Wage</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id}>
                      <td><strong>{j.title}</strong></td>
                      <td>{j.employer || '—'}</td>
                      <td>{j.location || '—'}</td>
                      <td>{j.wageOrSalary || '—'}</td>
                      <td>
                        <span className={`government-badge ${(j.governmentLevel || 'local').toLowerCase()}`}>
                          {j.governmentLevel || 'LOCAL'}
                        </span>
                      </td>
                      <td>
                        <button className="table-action edit" onClick={() => setEditingJob(j)}>✏️ Edit</button>
                        <button className="table-action del" onClick={() => deleteJob(j.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No jobs found. Add one above.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Schemes Tab ── */}
      {tab === 'schemes' && (
        <section className="admin-section-content">
          <div className="admin-header-row">
            <h2>Welfare Schemes ({schemes.length})</h2>
            <button className="action-button" onClick={() => setEditingScheme('new')}>+ Add New Scheme</button>
          </div>

          {editingScheme && (
            <div className="directory-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #004d99' }}>
              <h3>{editingScheme === 'new' ? 'New Welfare Scheme' : `Edit: ${editingScheme.name}`}</h3>
              <SchemeForm initial={editingScheme === 'new' ? {} : editingScheme} onSave={saveScheme} onCancel={() => setEditingScheme(null)} />
            </div>
          )}

          {loading ? <p className="status-message">Loading…</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Eligibility</th>
                    <th>Portal Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td style={{ maxWidth: '280px' }}>{s.eligibilityCriteria || '—'}</td>
                      <td>
                        {s.applicationLink ? (
                          <a href={s.applicationLink} target="_blank" rel="noreferrer" className="text-link">
                            Portal &nearr;
                          </a>
                        ) : '—'}
                      </td>
                      <td>
                        <button className="table-action edit" onClick={() => setEditingScheme(s)}>✏️ Edit</button>
                        <button className="table-action del" onClick={() => deleteScheme(s.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                  {schemes.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No schemes listed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Users Tab ── */}
      {tab === 'users' && (
        <section className="admin-section-content">
          <div className="admin-header-row">
            <h2>Registered Citizens &amp; Administrators ({users.length})</h2>
            <button className="action-button secondary-btn" onClick={fetchAll}>🔄 Refresh</button>
          </div>

          {loading ? <p className="status-message">Loading…</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td><strong>{u.fullName || 'Citizen User'}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        <span className={`status-pill ${u.role === 'ADMIN' ? 'status-rejected' : 'status-approved'}`}>
                          {u.role || 'CITIZEN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No users found in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default Admin
