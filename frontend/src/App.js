import { useEffect, useState } from 'react';
import './App.css';

const API_BASE = `http://localhost:4000`;

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d)) return ts;
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${hours}:${minutes} ${ampm}`;
}

function App() {
  console.log('App loaded');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ level: '', message: '', timestamp: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ level: '', search: '', start: '', end: '' });

  const fetchLogs = () => {
    console.log('Fetching logs');
    setLoading(true);
    let url = `${API_BASE}/logs`;
    const params = [];
    if (filters.level) params.push(`level=${encodeURIComponent(filters.level)}`);
    if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
    if (filters.start) params.push(`start=${encodeURIComponent(filters.start)}`);
    if (filters.end) params.push(`end=${encodeURIComponent(filters.end)}`);
    if (params.length) url += '?' + params.join('&');
    fetch(url)
      .then(res => res.json())
      .then(setLogs)
      .catch(() => setError('Failed to fetch logs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [filters]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add log');
      setForm({ level: '', message: '', timestamp: '' });
      fetchLogs();
    } catch {
      setError('Failed to add log');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="App">
      <h1>Log Viewer</h1>
      <form onSubmit={handleSubmit} style={{marginBottom: 24}}>
        <input name="level" placeholder="Level (e.g. info, error)" value={form.level} onChange={handleChange} required style={{marginRight: 8}} />
        <input name="message" placeholder="Message" value={form.message} onChange={handleChange} required style={{marginRight: 8}} />
        <input name="timestamp" type="datetime-local" value={form.timestamp} onChange={handleChange} required style={{marginRight: 8}} />
        <button type="submit" disabled={submitting}>Add Log</button>
      </form>
      <div style={{marginBottom: 24}}>
        <input name="level" placeholder="Filter by level" value={filters.level} onChange={handleFilterChange} style={{marginRight: 8}} />
        <input name="search" placeholder="Search message" value={filters.search} onChange={handleFilterChange} style={{marginRight: 8}} />
        <input name="start" type="datetime-local" value={filters.start} onChange={handleFilterChange} style={{marginRight: 8}} />
        <input name="end" type="datetime-local" value={filters.end} onChange={handleFilterChange} style={{marginRight: 8}} />
        <button onClick={() => setFilters({ level: '', search: '', start: '', end: '' })} style={{marginLeft: 8}}>Clear Filters</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <table style={{margin: '0 auto', borderCollapse: 'collapse', width: '80%'}}>
        <thead>
          <tr>
            <th>Level</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.level}</td>
              <td>{log.message}</td>
              <td>{formatTimestamp(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!loading && logs.length === 0) && <p>No logs found.</p>}
    </div>
  );
}

export default App;
