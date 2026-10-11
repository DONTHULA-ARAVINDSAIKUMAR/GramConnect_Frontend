import { useState, useRef, useEffect } from 'react'
import apiClient from '../api/apiClient'

function formatMessageText(text) {
  if (!text) return null

  // Split lines to format nicely
  const lines = text.split('\n')
  return lines.map((line, idx) => {
    // Check if bullet point
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-')
    
    // Parse simple bold tags **text**
    const parts = line.split(/(\*\*.*?\*\*)/g)
    const formattedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx}>{part.slice(2, -2)}</strong>
      }
      return part
    })

    return (
      <span key={idx} style={{ display: 'block', marginBottom: isBullet ? '4px' : '6px' }}>
        {formattedParts}
      </span>
    )
  })
}

function AiWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const quickPrompts = [
    '🌾 PM-Kisan Scheme Details',
    '💼 Rural Jobs Available',
    '💰 How to get Income Certificate',
    '🏠 PMAY-G Housing Eligibility',
  ]

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, sending])

  async function handleSendQuery(queryText) {
    const query = queryText.trim()
    if (!query || sending) return

    setMessage('')
    setMessages((current) => [...current, { role: 'user', text: query }])
    setSending(true)

    try {
      const response = await apiClient.get('/ai/ask', { params: { query } })
      const answer = response.data?.answer || response.data?.message || 'I am ready to assist you.'
      setMessages((current) => [...current, { role: 'assistant', text: answer }])
    } catch {
      // Intelligent fallback answer if local network disconnects
      let fallback = 'Namaste! GramConnect AI Mitra is available. You can discover welfare schemes like PM-Kisan, apply for rural job postings, or track certificates like Domicile & Income certificates under the Certificates tab.'
      const q = query.toLowerCase()
      if (q.includes('pm kisan') || q.includes('kisan')) {
        fallback = '🌾 **PM Kisan Samman Nidhi**:\nDirect income support of ₹6,000 per year transferred directly to farmer bank accounts in three equal 4-monthly installments of ₹2,000.\n\n• **Eligibility:** Must own cultivable land.\n• **Required Documents:** Aadhaar, Land Record (Khata), Bank Account\n• **Apply:** Click on the Schemes tab to view the official link!'
      } else if (q.includes('job') || q.includes('work')) {
        fallback = '🚜 **Rural Job Opportunities**:\nCurrent openings include Farm Supervisor, Tractor Driver, and Panchayat Infrastructure assistance.\n\n👉 Head over to the **Jobs** tab to apply directly and view employer phone numbers!'
      } else if (q.includes('certificate') || q.includes('income') || q.includes('residence')) {
        fallback = '🏛️ **Digital Certificates Desk**:\nYou can now apply online for Birth, Death, Residence, and Income Certificates right here on GramConnect.\n\n👉 Click **Certificates & Services** in the top navigation to submit an application and get an instant Tracking ID!'
      }
      setMessages((current) => [...current, { role: 'assistant', text: fallback }])
    } finally {
      setSending(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    handleSendQuery(message)
  }

  function handleClearChat() {
    setMessages([])
  }

  return (
    <div className="ai-widget">
      {isOpen && (
        <section className="chat-panel" aria-label="GramConnect AI Mitra">
          <div className="chat-header">
            <div className="chat-avatar-wrap">
              <span className="chat-avatar" aria-hidden="true">GC</span>
              <span className="chat-status-dot" title="AI Assistant Online"></span>
            </div>
            <div className="chat-header-text">
              <strong>GramConnect Mitra</strong>
              <span>Rural Welfare &amp; Services AI Guide</span>
            </div>
            <div className="chat-header-actions">
              {messages.length > 0 && (
                <button
                  className="chat-action-icon"
                  type="button"
                  title="Clear chat"
                  onClick={handleClearChat}
                >
                  🧹
                </button>
              )}
              <button
                className="chat-close"
                type="button"
                aria-label="Close assistant"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.length === 0 && (
              <div className="chat-welcome-box">
                <div className="welcome-crest">🇮🇳</div>
                <h4>Namaste! How may I assist you today?</h4>
                <p>
                  Ask any questions about PM-Kisan, MGNREGA, village job openings, or applying for official panchayat certificates.
                </p>

                <div className="quick-prompts-container">
                  <span className="quick-prompts-title">Popular Questions:</span>
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="quick-prompt-btn"
                      onClick={() => handleSendQuery(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((item, index) => (
              <div
                className={`chat-bubble ${item.role}`}
                key={`${item.role}-${index}`}
              >
                {formatMessageText(item.text)}
              </div>
            ))}

            {sending && (
              <div className="chat-bubble assistant typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-text">Checking government database…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="assistant-message">Your question</label>
            <input
              id="assistant-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about schemes, jobs, certificates…"
              disabled={sending}
              autoComplete="off"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={sending || !message.trim()}
              className="chat-send-btn"
            >
              &rarr;
            </button>
          </form>
        </section>
      )}

      {/* Floating Trigger Button */}
      <button
        className={`chat-toggle ${isOpen ? 'toggle-open' : ''}`}
        type="button"
        aria-label={isOpen ? 'Close assistant' : 'Open GramConnect AI Assistant'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? (
          <span aria-hidden="true">&times;</span>
        ) : (
          <span className="chat-toggle-icon">
            <span className="bot-symbol">💬</span>
            <span className="chat-pulse-badge">AI</span>
          </span>
        )}
      </button>
    </div>
  )
}

export default AiWidget