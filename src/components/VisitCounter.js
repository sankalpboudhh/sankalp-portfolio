import { useEffect, useState } from 'react';

const COUNTED_KEY = 'visit-counted';

// Guard against React StrictMode running the effect twice in development.
let request;

function fetchCount() {
  if (request) return request;

  let counted = false;
  try { counted = localStorage.getItem(COUNTED_KEY) === '1'; } catch {}

  request = fetch('/api/counter', { method: counted ? 'GET' : 'POST' })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(({ count }) => {
      if (!counted) {
        try { localStorage.setItem(COUNTED_KEY, '1'); } catch {}
      }
      return count;
    });

  return request;
}

function VisitCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let active = true;
    fetchCount()
      .then((c) => { if (active) setCount(c); })
      .catch(() => {}); // Counter is non-essential; hide it on failure.
    return () => { active = false; };
  }, []);

  if (count == null) return null;
  return <p>{count.toLocaleString()} visits</p>;
}

export default VisitCounter;
