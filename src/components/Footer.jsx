import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-intro">
          <div className="footer-brand-header">
            <span className="footer-mark" aria-hidden="true">GC</span>
            <div>
              <h2>GramConnect</h2>
              <span className="footer-tagline">Rural Citizen Services &amp; Welfare Portal</span>
            </div>
          </div>
          <p>
            An integrated digital public infrastructure initiative designed to simplify welfare access, block administration, and local livelihood connectivity for rural citizens across India.
          </p>
          <div className="digital-india-emblem">
            <span>🇮🇳 Digital India Rural Initiative</span>
          </div>
        </div>

        <div className="footer-links-group">
          <h3>Quick Portals</h3>
          <Link to="/">Home Overview</Link>
          <Link to="/schemes">Government Schemes</Link>
          <Link to="/jobs">Rural Job Postings</Link>
          <Link to="/services">Certificates &amp; NOC</Link>
          <Link to="/dashboard">Citizen Dashboard</Link>
        </div>

        <div className="footer-contact-group">
          <h3>National Helplines</h3>
          <a href="tel:155255">
            <strong>MyGov Citizen Desk</strong>
            <span>155255 (Toll-Free)</span>
          </a>
          <a href="tel:18001801551">
            <strong>Kisan Call Centre</strong>
            <span>1800-180-1551 (Farmer Help)</span>
          </a>
          <a href="tel:1930">
            <strong>Cyber Financial Safety</strong>
            <span>1930 (Direct Assistance)</span>
          </a>
          <a href="tel:181">
            <strong>Women Helpline</strong>
            <span>181 (24/7 Support)</span>
          </a>
        </div>

        <div className="footer-contact-group footer-email">
          <h3>Community Secretariat</h3>
          <div className="contact-item">
            <strong>Technical Desk:</strong>
            <a href="mailto:support@gramconnect.in">support@gramconnect.in</a>
          </div>
          <div className="contact-item">
            <strong>Panchayat Office Helpline:</strong>
            <span>9247272924 / 9701704152</span>
          </div>
          <p className="footer-disclaimer">
            All government scheme applications redirect to official central &amp; state portals (.gov.in / .nic.in).
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} GramConnect Citizen Services Portal. All rights reserved.</span>
        <span>Empowering Connected Panchayats &amp; Villages</span>
      </div>
    </footer>
  )
}

export default Footer
