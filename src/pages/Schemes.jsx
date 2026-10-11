import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import apiClient from '../api/apiClient'

function Schemes() {
  const { user } = useContext(AuthContext)
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [docModalScheme, setDocModalScheme] = useState(null)

  const categories = [
    { id: 'ALL', label: 'All Schemes' },
    { id: 'AGRICULTURE', label: '🌾 Agriculture & Farmers' },
    { id: 'EMPLOYMENT', label: '💼 Employment & Wage' },
    { id: 'HOUSING', label: '🏠 Rural Housing' },
    { id: 'HEALTH', label: '🏥 Health & Insurance' },
  ]

  useEffect(() => {
    let isMounted = true

    apiClient.get('/schemes')
      .then((res) => {
        if (isMounted) setSchemes(res.data)
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Schemes could not be loaded right now. Please verify the backend service is running.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  async function handleApplyClick(scheme) {
    if (user) {
      try {
        await apiClient.post('/applications', {
          userId: user.id,
          schemeId: scheme.id,
          type: 'SCHEME',
          title: scheme.name,
        })
        showToast(`✓ Application for "${scheme.name}" recorded in your citizen dashboard!`)
      } catch {
        showToast(`✓ Opening official application portal for ${scheme.name}…`)
      }
    } else {
      showToast(`Opening official portal. (Sign in to record in your personal dashboard)`)
    }
  }

  // Filter schemes based on search query and category
  const filteredSchemes = schemes.filter((scheme) => {
    const textToSearch = `${scheme.name} ${scheme.description} ${scheme.eligibilityCriteria || ''} ${scheme.requiredDocuments || ''}`.toLowerCase()
    const matchesSearch = textToSearch.includes(searchQuery.toLowerCase().trim())

    let matchesCategory = true
    if (selectedCategory === 'AGRICULTURE') {
      matchesCategory = textToSearch.includes('kisan') || textToSearch.includes('farm') || textToSearch.includes('cultiv') || textToSearch.includes('agri')
    } else if (selectedCategory === 'EMPLOYMENT') {
      matchesCategory = textToSearch.includes('employment') || textToSearch.includes('wage') || textToSearch.includes('nrega') || textToSearch.includes('work')
    } else if (selectedCategory === 'HOUSING') {
      matchesCategory = textToSearch.includes('awas') || textToSearch.includes('house') || textToSearch.includes('housing') || textToSearch.includes('pucca')
    } else if (selectedCategory === 'HEALTH') {
      matchesCategory = textToSearch.includes('health') || textToSearch.includes('ayushman') || textToSearch.includes('bima') || textToSearch.includes('insurance')
    }

    return matchesSearch && matchesCategory
  })

  return (
    <main className="directory-page schemes-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="portal-floating-toast" role="status">
          {toastMessage}
        </div>
      )}

      <div className="page-heading">
        <span className="eyebrow">Public Welfare Programs</span>
        <h1>Government Welfare Schemes</h1>
        <p>
          Discover central and state government entitlements, check eligibility criteria, and continue to official online portals.
        </p>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="directory-filter-toolbar">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Search schemes by name, keyword, crop, housing, or wage…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search schemes"
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
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${selectedCategory === cat.id ? 'active-chip' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="status-message" role="status">Loading verified government schemes…</p>}
      {!loading && error && <p className="status-message error-message" role="alert">{error}</p>}

      {!loading && !error && filteredSchemes.length === 0 && (
        <div className="directory-card empty-filter-card">
          <p>No government schemes matched your search criteria.</p>
          {(searchQuery || selectedCategory !== 'ALL') && (
            <button
              type="button"
              className="action-button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredSchemes.length > 0 && (
        <div className="directory-grid">
          {filteredSchemes.map((scheme) => (
            <article className="directory-card scheme-card" key={scheme.id}>
              <div className="scheme-card-header">
                <span className="government-badge central">Central Welfare</span>
                <span className="scheme-tag-pill">Direct Benefit Transfer</span>
              </div>
              <h2>{scheme.name}</h2>
              <p className="card-description">{scheme.description}</p>

              <div className="eligibility-block">
                <strong>Who is Eligible:</strong>
                <p>{scheme.eligibilityCriteria || 'Check the official portal for detailed state criteria.'}</p>
              </div>

              {scheme.requiredDocuments && (
                <div className="doc-preview-block">
                  <strong>Required Documents:</strong>
                  <p>{scheme.requiredDocuments}</p>
                </div>
              )}

              <div className="card-actions-row">
                {scheme.applicationLink ? (
                  <a
                    className="action-button"
                    href={scheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleApplyClick(scheme)}
                  >
                    Apply on Official Portal &nearr;
                  </a>
                ) : (
                  <button className="action-button" type="button" disabled>
                    Application Closed
                  </button>
                )}

                <button
                  type="button"
                  className="action-button secondary-btn"
                  onClick={() => setDocModalScheme(scheme)}
                >
                  Document Checklist
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Document Checklist Modal */}
      {docModalScheme && (
        <div className="modal-backdrop" onClick={() => setDocModalScheme(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="government-badge local">Document Verification Checklist</span>
                <h2 style={{ marginTop: '0.4rem' }}>{docModalScheme.name}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDocModalScheme(null)}
              >
                &times;
              </button>
            </div>

            <div className="checklist-modal-body">
              <p>Keep the following original documents and photocopies ready before initiating your application:</p>
              <ul className="checklist-items">
                {docModalScheme.requiredDocuments
                  ? docModalScheme.requiredDocuments.split(',').map((doc) => (
                      <li key={doc}>
                        <span className="check-box-icon">✓</span>
                        <span>{doc.trim()}</span>
                      </li>
                    ))
                  : (
                    <>
                      <li><span className="check-box-icon">✓</span> Aadhaar Card (Linked with Mobile)</li>
                      <li><span className="check-box-icon">✓</span> Bank Passbook / Active DBT Account</li>
                      <li><span className="check-box-icon">✓</span> Village Residence Proof</li>
                    </>
                  )}
              </ul>

              <div className="checklist-tips-alert">
                <strong>Helpful Tip:</strong> You can visit your local Gram Panchayat Computer Centre or Common Service Centre (CSC) if you need help scanning documents.
              </div>
            </div>

            <div className="modal-actions-bar">
              {docModalScheme.applicationLink && (
                <a
                  className="action-button"
                  href={docModalScheme.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleApplyClick(docModalScheme)
                    setDocModalScheme(null)
                  }}
                >
                  Proceed to Official Portal &nearr;
                </a>
              )}
              <button
                type="button"
                className="action-button secondary-btn"
                onClick={() => setDocModalScheme(null)}
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

export default Schemes