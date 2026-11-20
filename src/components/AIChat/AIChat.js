import { useCallback, useEffect, useId, useRef, useState } from 'react';
import './AIChat.css';

const MAX_CHARS = 300;
const MAX_HISTORY_MESSAGES = 8; // latest 4 exchanges; the server enforces this too
const CLIENT_TIMEOUT_MS = 25000;

const INTRO = "Hi! I'm Sankalp's portfolio assistant. Ask me about his experience, skills, projects, or frontend work.";
const SUGGESTIONS = [
  "Tell me about Sankalp's experience.",
  'What projects has he built?',
  'What is his experience with React?',
  'What kind of frontend work has he done?',
];

const ERRORS = {
  retryLater: 'The assistant is unavailable right now. Please try again later.',
  timeout: 'The assistant took too long to respond. Please try again.',
  network: "Couldn't reach the assistant. Check your connection and try again.",
  generic: 'Something went wrong. Please try again.',
};

// On touch devices, focusing the input would pop the on-screen keyboard over
// the panel, so focus the dialog itself there instead.
const prefersInputFocus = () => window.matchMedia?.('(pointer: fine)')?.matches ?? true;

let nextId = 0;
const newId = () => `m${++nextId}`;

// Only completed user → assistant exchanges are sent as history, so failed
// requests never leave a dangling user turn.
function buildHistory(messages) {
  const pairs = [];
  for (let i = 0; i < messages.length - 1; i++) {
    const a = messages[i];
    const b = messages[i + 1];
    if (a.role === 'user' && b.role === 'assistant' && !b.error) {
      pairs.push({ role: 'user', content: a.content }, { role: 'assistant', content: b.content });
      i++;
    }
  }
  return pairs.slice(-MAX_HISTORY_MESSAGES);
}

// Render plain text with http(s) URLs as links. Everything stays a React text
// node, so model output can never inject markup.
function Linkified({ text }) {
  const parts = text.split(/(https?:\/\/[^\s<>()]+)/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return part;
    const url = part.replace(/[.,;:!?'"]+$/, '');
    const trailing = part.slice(url.length);
    return (
      <span key={i}>
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>{trailing}
      </span>
    );
  });
}

async function requestReply(message, history) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });
    let data = {};
    try { data = await res.json(); } catch {}

    if (res.ok && typeof data.reply === 'string') return { reply: data.reply };
    if (res.status === 429 || res.status === 400) return { error: data.error || ERRORS.generic };
    if (res.status === 504) return { error: ERRORS.timeout };
    if (res.status === 503 || res.status === 502) return { error: ERRORS.retryLater };
    return { error: ERRORS.generic };
  } catch (err) {
    return { error: err?.name === 'AbortError' ? ERRORS.timeout : ERRORS.network };
  } finally {
    clearTimeout(timer);
  }
}

function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const wasOpen = useRef(false);
  const titleId = useId();
  const panelId = useId();
  const hintId = useId();

  const focusPanel = useCallback(() => {
    if (prefersInputFocus()) inputRef.current?.focus();
    else panelRef.current?.focus();
  }, []);

  // Focus into the panel on open; return focus to the launcher on close.
  useEffect(() => {
    if (open) focusPanel();
    else if (wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open, focusPanel]);

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, loading, open]);

  // After a reply, restore focus if it was lost (e.g. a clicked suggestion disappeared).
  useEffect(() => {
    if (loading || !open) return;
    const active = document.activeElement;
    if (!active || active === document.body) focusPanel();
  }, [loading, open, focusPanel]);

  const send = async (text) => {
    const message = text.trim();
    if (!message || loading || message.length > MAX_CHARS) return;

    const history = buildHistory(messages);
    setMessages((prev) => [...prev, { id: newId(), role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    const result = await requestReply(message, history);
    setMessages((prev) => [
      ...prev,
      result.reply
        ? { id: newId(), role: 'assistant', content: result.reply }
        : { id: newId(), role: 'assistant', content: result.error, error: true },
    ]);
    setLoading(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const onPanelKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setInput('');
    focusPanel();
  };

  const trimmedLength = input.trim().length;
  const canSend = trimmedLength > 0 && trimmedLength <= MAX_CHARS && !loading;

  return (
    <div className="aichat">
      {open && (
        <div
          id={panelId}
          ref={panelRef}
          tabIndex={-1}
          className="aichat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onKeyDown={onPanelKeyDown}
        >
          <div className="aichat-header">
            <div>
              <h2 id={titleId} className="aichat-title">Portfolio assistant</h2>
              <p className="aichat-subtitle">AI answers about Sankalp's work</p>
            </div>
            <div className="aichat-header-actions">
              <button
                type="button"
                className="aichat-icon-btn"
                onClick={resetConversation}
                disabled={loading || messages.length === 0}
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4h4" /></svg>
              </button>
              <button
                type="button"
                className="aichat-icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                title="Close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          </div>

          <div
            className="aichat-log"
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Conversation"
            tabIndex={0}
          >
            <div className="aichat-msg aichat-msg--assistant">{INTRO}</div>

            {messages.length === 0 && (
              <div className="aichat-suggestions" role="group" aria-label="Suggested questions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="aichat-suggestion" onClick={() => send(s)} disabled={loading}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`aichat-msg aichat-msg--${m.role}${m.error ? ' aichat-msg--error' : ''}`}
                role={m.error ? 'alert' : undefined}
              >
                <span className="aichat-sr">{m.role === 'user' ? 'You: ' : 'Assistant: '}</span>
                {m.role === 'assistant' && !m.error ? <Linkified text={m.content} /> : m.content}
              </div>
            ))}

            {loading && (
              <div className="aichat-msg aichat-msg--assistant aichat-typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form
            className="aichat-form"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <label htmlFor={`${panelId}-input`} className="aichat-sr">Your question</label>
            <textarea
              id={`${panelId}-input`}
              ref={inputRef}
              className="aichat-input"
              rows={1}
              value={input}
              maxLength={MAX_CHARS}
              placeholder="Ask about Sankalp…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-describedby={hintId}
              readOnly={loading}
            />
            <button type="submit" className="aichat-send" disabled={!canSend} aria-label="Send message">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <p id={hintId} className="aichat-hint">
              <span>Enter to send · Shift+Enter for a new line</span>
              <span aria-live="polite">{input.length}/{MAX_CHARS}</span>
            </p>
          </form>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="aichat-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? 'Close chat' : "Chat with Sankalp's portfolio assistant"}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>
        )}
      </button>
    </div>
  );
}

export default AIChat;
