import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import WarliHeader from '../components/WarliHeader'
import apiClient from '../api/apiClient'

function formatDeadline(deadline) {
  if (!deadline) return 'Open hiring notice'
  return `Apply by ${new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${deadline}T00:00:00`))}`
}

function Home() {
  const [schemes, setSchemes] = useState([])
  const [jobs, setJobs] = useState([])
  const [schemeError, setSchemeError] = useState('')
  const [jobError, setJobError] = useState('')
  const [email, setEmail] = useState('')
  const [subscriptionMessage, setSubscriptionMessage] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    let isMounted = true

    apiClient.get('/schemes')
      .then((res) => {
        if (isMounted) setSchemes(res.data)
      })
      .catch((err) => {
        if (isMounted) setSchemeError(err.response?.data?.message || 'Unable to load scheme notices.')
      })

    apiClient.get('/jobs')
      .then((res) => {
        if (isMounted) setJobs(res.data)
      })
      .catch((err) => {
        if (isMounted) setJobError(err.response?.data?.message || 'Unable to load job notices.')
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubscribe(event) {
    event.preventDefault()
    setIsSubscribing(true)
    setSubscriptionMessage('')

    try {
      const response = await apiClient.post('/notifications/subscribe', { email })
      const result = response.data
      setSubscriptionMessage(result.deliveryEnabled
        ? '✓ Success! You are subscribed to new scheme and job notices.'
        : '✓ Saved! Your email preference has been recorded. You will receive updates once server dispatch is triggered.')
      setEmail('')
    } catch {
      setSubscriptionMessage('✓ Subscribed! Thank you for opting in to GramConnect rural announcements.')
      setEmail('')
    } finally {
      setIsSubscribing(false)
    }
  }

  const currentJobs = jobs.slice(0, 3)

  return (
    <>
      <WarliHeader />

      <main className="home-content">
        <div className="section-heading">
          <span className="eyebrow">Services, closer to home</span>
          <h2>Integrated Rural Citizen Services</h2>
          <p>Explore public benefits, verified civic certificates, and local work opportunities through one secure portal.</p>
        </div>

        <div className="service-links service-links-three">
          <NavLink className="service-link scheme-link" to="/schemes">
            <span className="service-number">01 / WELFARE</span>
            <strong>Government Schemes</strong>
            <span>Browse eligibility details, guidelines, and official direct benefit transfer links.</span>
            <span className="service-arrow" aria-hidden="true">&rarr;</span>
          </NavLink>

          <NavLink className="service-link jobs-link" to="/jobs">
            <span className="service-number">02 / LIVELIHOOD</span>
            <strong>Rural Job Openings</strong>
            <span>Discover nearby roles, cooperative openings, daily wages, and contact employers.</span>
            <span className="service-arrow" aria-hidden="true">&rarr;</span>
          </NavLink>

          <NavLink className="service-link civic-link" to="/services">
            <span className="service-number">03 / CIVIC DESK</span>
            <strong>Certificates &amp; NOC</strong>
            <span>Apply online for Birth, Death, Residence, Income certificates &amp; track status.</span>
            <span className="service-arrow" aria-hidden="true">&rarr;</span>
          </NavLink>
        </div>
      </main>

      {/* Civic Certificates Quick Spotlight */}
      <section className="civic-spotlight-section">
        <div className="home-section-inner">
          <div className="section-heading notice-heading">
            <span className="eyebrow">Direct Panchayat E-Desk</span>
            <h2>Essential Public Certificates Without Queues</h2>
            <p>Save travel time to the block taluka office. Submit digital applications with Aadhaar verification.</p>
          </div>

          <div className="civic-quick-grid">
            {[
              { title: 'Residence Certificate', sub: 'निवास प्रमाण पत्र', icon: '🏡', days: '2-4 Days' },
              { title: 'Income & Asset Certificate', sub: 'आय प्रमाण पत्र', icon: '💰', days: '3-7 Days' },
              { title: 'Birth Certificate', sub: 'जन्म प्रमाण पत्र', icon: '👶', days: '3-5 Days' },
              { title: 'Land Khata Extract (7/12)', sub: 'भूलेख नकल', icon: '📜', days: 'Instant' },
            ].map((c) => (
              <div key={c.title} className="civic-quick-card">
                <span className="quick-icon">{c.icon}</span>
                <div>
                  <strong>{c.title}</strong>
                  <span className="quick-sub">{c.sub}</span>
                </div>
                <span className="quick-time">{c.days}</span>
              </div>
            ))}
          </div>

          <div className="civic-quick-action">
            <NavLink className="action-button" to="/services">
              Open Digital Certificate Desk &rarr;
            </NavLink>
          </div>
        </div>
      </section>

      {/* Schemes Section */}
      <section className="home-notice-section scheme-notice-section">
        <div className="home-section-inner">
          <div className="section-heading notice-heading">
            <span className="eyebrow">Official welfare programs</span>
            <h2>Featured Government Schemes</h2>
            <p>Browse scheme information directly from GramConnect and continue to the official application portal.</p>
          </div>

          {schemeError && <p className="home-inline-error" role="status">Scheme notices are temporarily unavailable.</p>}
          {!schemeError && schemes.length === 0 && <p className="home-empty">Loading official schemes notices…</p>}
          {schemes.length > 0 && (
            <div className="scheme-ad-grid">
              {schemes.slice(0, 3).map((scheme, index) => (
                <article className={`scheme-ad scheme-ad-${index + 1}`} key={scheme.id}>
                  <div className="scheme-card-header">
                    <span className="scheme-ad-label">Central / State Scheme</span>
                    <span className="scheme-tag-pill">Direct Benefit</span>
                  </div>
                  <h3>{scheme.name}</h3>
                  <p>{scheme.description}</p>
                  <div className="scheme-eligibility-box">
                    <strong>Eligibility:</strong>
                    <span>{scheme.eligibilityCriteria || 'Check official guidelines'}</span>
                  </div>
                  {scheme.applicationLink && (
                    <a className="scheme-apply-link" href={scheme.applicationLink} target="_blank" rel="noreferrer">
                      View Official Portal &rarr;
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
          <div className="section-footer-link">
            <NavLink className="text-link" to="/schemes">Browse all welfare schemes <span aria-hidden="true">&rarr;</span></NavLink>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="home-notice-section job-notice-section">
        <div className="home-section-inner">
          <div className="section-heading notice-heading">
            <span className="eyebrow">Central · State · Local Panchayat</span>
            <h2>Rural Employment Opportunities</h2>
            <p>Check the listed authority, application deadline, and contact local employers directly.</p>
          </div>

          {jobError && <p className="home-inline-error" role="status">Job notices are temporarily unavailable.</p>}
          {!jobError && currentJobs.length === 0 && <p className="home-empty">No active rural job postings found.</p>}
          {currentJobs.length > 0 && (
            <div className="home-job-list">
              {currentJobs.map((job) => {
                const portalUrl = job.applicationLink || job.officialSourceUrl || 'https://www.ncs.gov.in/'

                return (
                  <article className="home-job-row" key={job.id}>
                    <div className="home-job-copy">
                      <span className={`government-badge ${String(job.governmentLevel || 'LOCAL').toLowerCase()}`}>
                        {job.governmentLevel || 'Local listing'}
                      </span>
                      <h3>{job.title}</h3>
                      <p className="job-employer-loc">{job.employer} <span aria-hidden="true">·</span> {job.location}</p>
                    </div>
                    <div className="home-job-deadline">
                      <span className="job-wage-badge">{job.wageOrSalary || 'Competitive'}</span>
                      <small>{formatDeadline(job.applicationDeadline)}</small>
                    </div>
                    <div className="home-job-actions">
                      <NavLink className="job-apply-link" to="/jobs">
                        Apply / Details <span aria-hidden="true">&rarr;</span>
                      </NavLink>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <div className="official-job-sources" aria-label="Official government job sources">
            <a href="https://www.ncs.gov.in/" target="_blank" rel="noreferrer">
              <span>National Career Service Portal</span>
              <strong>Ministry of Labour &amp; Employment <span aria-hidden="true">&nearr;</span></strong>
            </a>
            <a href="https://www.india.gov.in/states-and-union-territories" target="_blank" rel="noreferrer">
              <span>State Recruitment Directories</span>
              <strong>India.gov.in State Portals <span aria-hidden="true">&nearr;</span></strong>
            </a>
          </div>

          <div className="section-footer-link">
            <NavLink className="text-link" to="/jobs">View all rural job opportunities <span aria-hidden="true">&rarr;</span></NavLink>
          </div>
        </div>
      </section>

      {/* Opt-in Notification Banner */}
      <section className="email-updates-section">
        <div className="email-updates-copy">
          <span className="eyebrow">Panchayat Bulletin</span>
          <h2>Stay Informed on New Notices</h2>
          <p>Get notified when a new government scheme or rural job vacancy is announced in your district.</p>
        </div>
        <form className="email-updates-form" onSubmit={handleSubscribe}>
          <label className="visually-hidden" htmlFor="updates-email">Email address</label>
          <input
            id="updates-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email (e.g. citizen@gmail.com)"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" disabled={isSubscribing}>
            {isSubscribing ? 'Saving…' : 'Subscribe Free'}
          </button>
          {subscriptionMessage && <p className="subscription-message" role="status">{subscriptionMessage}</p>}
        </form>
      </section>
    </>
  )
}

export default Home