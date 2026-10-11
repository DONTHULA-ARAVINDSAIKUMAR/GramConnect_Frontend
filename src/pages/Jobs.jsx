import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import apiClient from '../api/apiClient'

function Jobs() {
  const { user } = useContext(AuthContext)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [applyStatus, setApplyStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('ALL')

  const levels = [
    { id: 'ALL', label: 'All Openings' },
    { id: 'LOCAL', label: '🏡 Local / Panchayat' },
    { id: 'STATE', label: '🏛️ State Recruitment' },
    { id: 'CENTRAL', label: '🇮🇳 Central Opportunities' },
  ]

  useEffect(() => {
    let isMounted = true

    apiClient.get('/jobs')
      .then((res) => {
        if (isMounted) setJobs(res.data)
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Job postings could not be loaded right now. Please verify the backend service is running.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  function openApplyModal(job) {
    setSelectedJob(job)
    setCopiedPhone(false)
    setApplyStatus('')
  }

  function closeApplyModal() {
    setSelectedJob(null)
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2500)
    }
  }

  async function handleRecordApplication(job) {
    if (!user) {
      setApplyStatus('Please sign in with a citizen account to track this application in your dashboard.')
      return
    }

    try {
      await apiClient.post('/applications', {
        userId: user.id,
        jobId: job.id,
        type: 'JOB',
        title: `${job.title} - ${job.employer || 'Local'}`,
      })
      setApplyStatus('✓ Application successfully recorded in your Citizen Dashboard!')
    } catch {
      setApplyStatus('Application noted! You can contact the employer directly.')
    }
  }

  // Filter jobs based on search query and government level
  const filteredJobs = jobs.filter((job) => {
    const textToSearch = `${job.title} ${job.employer || ''} ${job.location || ''} ${job.description || ''} ${job.wageOrSalary || ''}`.toLowerCase()
    const matchesSearch = textToSearch.includes(searchQuery.toLowerCase().trim())

    let matchesLevel = true
    if (selectedLevel !== 'ALL') {
      matchesLevel = String(job.governmentLevel || 'LOCAL').toUpperCase() === selectedLevel
    }

    return matchesSearch && matchesLevel
  })

  return (
    <main className="directory-page jobs-page">
      <div className="page-heading">
        <span className="eyebrow">Livelihood &amp; Employment</span>
        <h1>Rural Job Postings &amp; Opportunities</h1>
        <p>
          Discover nearby agricultural, infrastructure, and cooperative roles, check wages, and connect directly with local employers.
        </p>
      </div>

      {/* Search and Level Filter Toolbar */}
      <div className="directory-filter-toolbar">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Search jobs by title, employer, location, trade, or skills…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search jobs"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="category-chips-row" role="tablist">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              className={`category-chip ${selectedLevel === lvl.id ? 'active-chip' : ''}`}
              onClick={() => setSelectedLevel(lvl.id)}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="status-message" role="status">Loading current job vacancies…</p>}
      {!loading && error && <p className="status-message error-message" role="alert">{error}</p>}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="directory-card empty-filter-card">
          <p>No job postings matched your current search filters.</p>
          {(searchQuery || selectedLevel !== 'ALL') && (
            <button
              type="button"
              className="action-button"
              onClick={() => {
                setSearchQuery('')
                setSelectedLevel('ALL')
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="directory-grid">
          {filteredJobs.map((job) => {
            const portalUrl = job.applicationLink || job.officialSourceUrl || 'https://www.ncs.gov.in/'

            return (
              <article className="directory-card job-card" key={job.id}>
                <div className="scheme-card-header">
                  <span className={`government-badge ${String(job.governmentLevel || 'LOCAL').toLowerCase()}`}>
                    {job.governmentLevel || 'Local listing'}
                  </span>
                  <span className="wage-highlight-badge">{job.wageOrSalary || 'Competitive Pay'}</span>
                </div>

                <h2>{job.title}</h2>
                <p className="employer-line">🏢 {job.employer || 'Gram Panchayat Project'}</p>

                {job.description && <p className="card-description">{job.description}</p>}

                <dl className="job-details">
                  <div>
                    <dt>Location</dt>
                    <dd>📍 {job.location || 'Rural District'}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>
                      📅 {job.applicationDeadline
                        ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(`${job.applicationDeadline}T00:00:00`))
                        : 'Open hiring'}
                    </dd>
                  </div>
                  <div>
                    <dt>Contact</dt>
                    <dd>📞 {job.contactInfo || 'Panchayat Office'}</dd>
                  </div>
                </dl>

                <div className="card-actions-row">
                  <button
                    className="action-button"
                    type="button"
                    onClick={() => openApplyModal(job)}
                  >
                    Apply for Job &rarr;
                  </button>
                  <a
                    className="action-button secondary-btn"
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Portal &nearr;
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Interactive Apply Modal */}
      {selectedJob && (
        <div className="modal-backdrop" onClick={closeApplyModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className={`government-badge ${String(selectedJob.governmentLevel || 'LOCAL').toLowerCase()}`}>
                  {selectedJob.governmentLevel || 'Local'} Recruitment Notice
                </span>
                <h2 style={{ marginTop: '0.4rem' }}>{selectedJob.title}</h2>
                <p style={{ color: '#555', margin: '0.2rem 0 0 0' }}>
                  {selectedJob.employer} &bull; {selectedJob.location}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeApplyModal}
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <div className="checklist-modal-body">
              <div className="wage-detail-strip">
                <div>
                  <span className="wage-label">Offered Compensation</span>
                  <strong className="wage-amount">{selectedJob.wageOrSalary || 'As per norms'}</strong>
                </div>
                <div>
                  <span className="wage-label">Application Status</span>
                  <strong className="status-open">Actively Hiring</strong>
                </div>
              </div>

              <div className="job-desc-box">
                <h4>Role Description:</h4>
                <p>{selectedJob.description || 'General rural coordination and field assistance.'}</p>
              </div>

              <div className="job-contact-options">
                <h4>Connect with Employer:</h4>
                {selectedJob.contactInfo && (
                  <div className="contact-buttons-row">
                    <a
                      className="action-button tel-btn"
                      href={selectedJob.contactInfo.includes('@') ? `mailto:${selectedJob.contactInfo}` : `tel:${selectedJob.contactInfo}`}
                    >
                      {selectedJob.contactInfo.includes('@') ? '✉️ Email Employer' : `📞 Call (${selectedJob.contactInfo})`}
                    </a>
                    {!selectedJob.contactInfo.includes('@') && (
                      <button
                        type="button"
                        className="action-button secondary-btn"
                        onClick={() => copyToClipboard(selectedJob.contactInfo)}
                      >
                        {copiedPhone ? '✓ Copied to Clipboard' : '📋 Copy Phone Number'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="record-app-box">
                <button
                  type="button"
                  className="action-button full-width"
                  onClick={() => handleRecordApplication(selectedJob)}
                >
                  Record in My Citizen Dashboard History
                </button>
                {applyStatus && (
                  <p className="apply-status-message" role="status">
                    {applyStatus}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-actions-bar">
              <a
                className="action-button secondary-btn"
                href={selectedJob.applicationLink || selectedJob.officialSourceUrl || 'https://www.ncs.gov.in/'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Official NCS Portal &nearr;
              </a>
              <button
                type="button"
                className="action-button secondary-btn"
                onClick={closeApplyModal}
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

export default Jobs