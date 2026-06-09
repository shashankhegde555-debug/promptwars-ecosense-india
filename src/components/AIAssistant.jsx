import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { MOCK_ASSISTANT_RESPONSES } from '../mockData.js';

const SUGGESTED_PROMPTS = [
  { text: 'How can I reduce my transport carbon footprint in India?', emoji: '🚗' },
  { text: 'What are the best eco-friendly habits for daily life?', emoji: '🌿' },
  { text: 'Calculate my footprint: drove 20km in a petrol car in Delhi', emoji: '🧮' },
  { text: 'How much CO₂ does using AC for 8 hours produce?', emoji: '❄️' },
  { text: 'What is India\'s carbon footprint compared to global average?', emoji: '🌍' },
  { text: 'Give me tips to reduce my food-related carbon emissions', emoji: '🍛' },
];

function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: '👋 Hi! I\'m your EcoSense AI Assistant. Please select one of the quick questions below to learn more about carbon footprints, eco-friendly habits, and carbon calculations!',
      time: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    // Simulated thinking delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 500));

    const replyText = MOCK_ASSISTANT_RESPONSES[text.trim()] || "I'm sorry, I don't have a pre-prepared answer for that question.";
    const aiMsg = { id: Date.now() + 1, role: 'assistant', text: replyText, time: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line === '') return <br key={i} />;

      // Parse inline bolding (**bold text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const parsedElements = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('🔁 ') || line.startsWith('✅ ')) {
        return <p key={i} className="ai-msg-bullet">{parsedElements}</p>;
      }
      return <p key={i} className="ai-msg-line">{parsedElements}</p>;
    });
  };

  return (
    <section className="ai-assistant" aria-label="AI Assistant">
      <div className="section-header">
        <h2 className="section-title">🤖 AI Eco Assistant</h2>
        <p className="section-desc">
          Get instant tips, eco-friendly habits, and India-specific carbon emission insights by clicking on the quick questions below.
        </p>
      </div>

      {/* Suggested prompts */}
      <div className="ai-suggestions" aria-label="Suggested prompts">
        <span className="ai-suggestions-label">Quick questions:</span>
        <div className="ai-suggestions-chips">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p.text}
              type="button"
              className="ai-chip"
              onClick={() => sendMessage(p.text)}
              disabled={loading}
            >
              <span aria-hidden="true">{p.emoji}</span> {p.text}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="ai-chat-window" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ai-bubble-row ${msg.role === 'user' ? 'ai-bubble-row--user' : 'ai-bubble-row--assistant'}`}
          >
            {msg.role === 'assistant' && (
              <div className="ai-avatar" aria-hidden="true">🤖</div>
            )}
            <div className={`ai-bubble ${msg.isError ? 'ai-bubble--error' : ''}`}>
              <div className="ai-bubble-content">
                {renderText(msg.text)}
              </div>
              <span className="ai-bubble-time">{formatTime(msg.time)}</span>
            </div>
            {msg.role === 'user' && (
              <div className="ai-avatar ai-avatar--user" aria-hidden="true">👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="ai-bubble-row ai-bubble-row--assistant">
            <div className="ai-avatar" aria-hidden="true">🤖</div>
            <div className="ai-bubble ai-bubble--thinking">
              <span className="ai-thinking-dot" />
              <span className="ai-thinking-dot" />
              <span className="ai-thinking-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

