import { Link } from 'react-router-dom'

function WarliHeader() {
  return (
    <section className="warli-header" aria-labelledby="portal-title">
      <div className="warli-art" aria-hidden="true">
        <svg className="warli-tree" viewBox="0 0 220 250">
          <g fill="none" stroke="#FAF9F6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <path d="M108 240V92m0 56L75 112m33 15 34-30M108 113 84 83m24 24 21-39M108 86 96 59m12 33 14-34M70 240h78" />
            <path d="M108 111 66 89m75 4 28-22M76 111l-22 7m97-12 28 7" />
          </g>
          <g fill="#FAF9F6">
            <circle cx="96" cy="54" r="5" /><circle cx="123" cy="53" r="5" />
            <circle cx="63" cy="86" r="5" /><circle cx="79" cy="78" r="5" />
            <circle cx="139" cy="86" r="5" /><circle cx="157" cy="75" r="5" />
            <circle cx="51" cy="120" r="4" /><circle cx="179" cy="117" r="4" />
            <circle cx="73" cy="107" r="4" /><circle cx="148" cy="104" r="4" />
          </g>
          <g fill="none" stroke="#FAF9F6" strokeWidth="2">
            <circle cx="108" cy="53" r="31" /><circle cx="69" cy="92" r="25" />
            <circle cx="149" cy="91" r="25" />
          </g>
        </svg>

        <svg className="warli-dancers" viewBox="0 0 440 230">
          <g fill="none" stroke="#FAF9F6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <path d="M5 104 30 91 55 104 80 91 105 104 130 91 155 104 180 91 205 104 230 91 255 104 280 91 305 104 330 91 355 104 380 91 405 104 435 91" />
            <path d="M30 105v32m0 0-18 37m18-37 20 34m-20-34-15 12m15-12 20 10" />
            <path d="M80 105v32m0 0-18 34m18-34 20 37m-20-37-15 10m15-10 20-12" />
            <path d="M130 105v32m0 0-18 37m18-37 20 34m-20-34-15 12m15-12 20 10" />
            <path d="M180 105v32m0 0-18 34m18-34 20 37m-20-37-15 10m15-10 20-12" />
            <path d="M230 105v32m0 0-18 37m18-37 20 34m-20-34-15 12m15-12 20 10" />
            <path d="M280 105v32m0 0-18 34m18-34 20 37m-20-37-15 10m15-10 20-12" />
            <path d="M330 105v32m0 0-18 37m18-37 20 34m-20-34-15 12m15-12 20 10" />
            <path d="M380 105v32m0 0-18 34m18-34 20 37m-20-37-15 10m15-10 20-12" />
            <path d="M5 218h430" />
          </g>
          <g fill="#FAF9F6">
            <circle cx="30" cy="76" r="8" /><circle cx="80" cy="76" r="8" />
            <circle cx="130" cy="76" r="8" /><circle cx="180" cy="76" r="8" />
            <circle cx="230" cy="76" r="8" /><circle cx="280" cy="76" r="8" />
            <circle cx="330" cy="76" r="8" /><circle cx="380" cy="76" r="8" />
          </g>
          <g fill="none" stroke="#FAF9F6" strokeWidth="2">
            <path d="m20 123 10 11 10-11m40-11 10 11 10-11m40 11 10 11 10-11m40-11 10 11 10-11m40 11 10 11 10-11m40-11 10 11 10-11m40 11 10 11 10-11m40-11 10 11 10-11" />
          </g>
        </svg>

        <svg className="warli-hut" viewBox="0 0 240 250">
          <g fill="none" stroke="#FAF9F6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <path d="M26 240h188M49 240V129h140v111M32 132l87-79 89 79M25 132h191M44 120l75-68 78 68" />
            <path d="M104 240v-63a15 15 0 0 1 30 0v63m-81-81h142M62 146v-16m24 16v-16m86 16v-16m24 16v-16" />
            <path d="M119 53V31m-13 10h26m-87 91-17 11m180-11 16 11" />
          </g>
          <g fill="#FAF9F6">
            <circle cx="34" cy="167" r="3" /><circle cx="205" cy="170" r="3" />
            <circle cx="66" cy="225" r="3" /><circle cx="177" cy="220" r="3" />
          </g>
        </svg>
      </div>

      <div className="warli-copy">
        <div className="warli-badge-strip">
          <span className="warli-kicker">GramConnect · Digital India Rural Mission</span>
          <span className="portal-live-pill">● Official e-Governance Portal</span>
        </div>
        <h1 id="portal-title">Unified Rural Citizen Services &amp; Welfare Portal</h1>
        <p>
          A single digital window connecting rural communities to central and state welfare benefits, essential panchayat certificates, and local livelihood opportunities.
        </p>

        {/* Quick Actions Buttons in Hero */}
        <div className="hero-action-buttons">
          <Link to="/schemes" className="hero-btn hero-primary-btn">
            🌾 Explore Welfare Schemes &rarr;
          </Link>
          <Link to="/services" className="hero-btn hero-secondary-btn">
            🏛️ Apply for Certificates
          </Link>
          <Link to="/jobs" className="hero-btn hero-tertiary-btn">
            💼 Rural Job Openings
          </Link>
        </div>

        {/* Trust Metrics Bar */}
        <div className="hero-metrics-strip">
          <div className="metric-item">
            <strong>₹6,000 / yr</strong>
            <span>Direct DBT Assistance</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>100 Days</strong>
            <span>Guaranteed Rural Work</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>7+ Certificates</strong>
            <span>Digital Block Verification</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>100% Free</strong>
            <span>Transparent Public Desk</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WarliHeader