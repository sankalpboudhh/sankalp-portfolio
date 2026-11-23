import { useState } from 'react';
import ReactGA from 'react-ga4';

// Submitted to Netlify Forms. The field names must match the hidden "callback" form in public/index.html.
const FORM_NAME = 'callback';
const TIMES = ['Any time', 'Morning (9–12 IST)', 'Afternoon (12–5 IST)', 'Evening (5–8 IST)'];
const EMPTY = { name: '', phone: '', 'best-time': TIMES[0], message: '', 'bot-field': '' };

// 7–15 digits, optionally with a leading + and spaces, dashes or brackets between them
export function isValidPhone(value) {
  const v = value.trim();
  if (!/^\+?[\d\s\-()]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}

function CallbackForm() {
  const [fields, setFields] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [phoneError, setPhoneError] = useState('');

  const update = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (name === 'phone' && phoneError) setPhoneError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidPhone(fields.phone)) {
      setPhoneError('Enter a valid phone number (add country code if outside India).');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': FORM_NAME, ...fields }).toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      setFields(EMPTY);
      ReactGA.event({ category: 'Contact', action: 'callback_requested' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="callback-done" role="status">
        <div className="callback-title">Thanks, request received.</div>
        <p>I'll call you back at your preferred time, usually within one working day.</p>
        <button type="button" className="callback-link" onClick={() => setStatus('idle')}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="callback-form" name={FORM_NAME} onSubmit={submit}>
      <div className="callback-title">Request a call back</div>

      {/* Honeypot: hidden from people, filled in by bots; Netlify discards submissions that have it */}
      <p className="callback-hp" aria-hidden="true">
        <label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" value={fields['bot-field']} onChange={update} /></label>
      </p>

      <label className="callback-field">
        <span>Name</span>
        <input name="name" required maxLength={80} autoComplete="name" value={fields.name} onChange={update} />
      </label>

      <label className="callback-field">
        <span>Phone</span>
        <input
          name="phone" type="tel" required maxLength={20} autoComplete="tel" placeholder="+91 98765 43210"
          value={fields.phone} onChange={update}
          aria-invalid={phoneError ? 'true' : undefined}
          aria-describedby={phoneError ? 'callback-phone-error' : undefined}
        />
        {phoneError && <small id="callback-phone-error" className="callback-error">{phoneError}</small>}
      </label>

      <label className="callback-field">
        <span>Best time to call</span>
        <select name="best-time" value={fields['best-time']} onChange={update}>
          {TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>

      <label className="callback-field">
        <span>Topic <em>(optional)</em></span>
        <input name="message" maxLength={200} placeholder="e.g. Frontend role" value={fields.message} onChange={update} />
      </label>

      <button type="submit" className="btn-primary callback-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Request call back'}
      </button>

      {status === 'error' && (
        <p className="callback-error" role="alert">
          Couldn't send your request. Please try again, or email me directly.
        </p>
      )}
    </form>
  );
}

export default CallbackForm;
