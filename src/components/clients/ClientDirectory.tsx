import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Search, Users, X } from 'lucide-react';
import { fetchClientCount, fetchClientPage, type ClientCursor } from '../../lib/clientDirectory';
import { filterClientPage, type DirectoryClient } from '../../lib/clientDirectoryFilter';
import './clientDirectory.css';

interface Props { onClose: () => void; onLogout: () => void }

export function ClientDirectory({ onClose, onLogout }: Props) {
  const [size, setSize] = useState(25);
  const [cursors, setCursors] = useState<ClientCursor[]>([null]);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<DirectoryClient[]>([]);
  const [next, setNext] = useState<ClientCursor>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [countError, setCountError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selected, setSelected] = useState<DirectoryClient | null>(null);
  const detailRef = useRef<HTMLElement>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search), 250); return () => window.clearTimeout(timer); }, [search]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(false); setItems([]); setSelected(null);
    fetchClientPage(size, cursors[page]).then(data => {
      if (!active) return;
      setItems(data.clients); setNext(data.nextCursor); setHasMore(data.hasMore);
    }).catch(() => { if (active) { setError(true); setNext(null); setHasMore(false); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [size, page, cursors, revision]);
  useEffect(() => {
    let active = true;
    setTotal(null); setCountError(false);
    fetchClientCount().then(n => { if (active) setTotal(n); }).catch(() => { if (active) setCountError(true); });
    return () => { active = false; };
  }, [revision]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    detailRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setSelected(null); }
      if (e.key === 'Tab') {
        const focusable = detailRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])');
        if (!focusable?.length) { e.preventDefault(); return; }
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === detailRef.current)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [selected]);
  const filtered = useMemo(() => filterClientPage(items, debouncedSearch), [items, debouncedSearch]);
  const previous = () => { setPage(n => Math.max(0, n - 1)); setSearch(''); };
  const forward = () => { if (!next || !hasMore) return; setCursors(c => [...c.slice(0, page + 1), next]); setPage(n => n + 1); setSearch(''); };
  return <div className="client-workspace">
    <header className="client-header"><div className="client-brand"><span>J<span>.</span></span><div><strong>JHA</strong><small>ACCOUNTING SOLUTIONS</small></div></div><div className="client-header-actions"><button onClick={onClose}><ArrowLeft size={16}/> Website</button><button onClick={onLogout}>Sign out</button></div></header>
    <main className="client-main">
      <div className="client-page-title"><div><p className="client-kicker">ADMIN WORKSPACE / CLIENTS</p><h1>Client Management</h1><p>Manage client records, services, documents, and compliance</p></div><button type="button" className="client-refresh" onClick={() => setRevision(n => n + 1)} disabled={loading}><RefreshCw size={16}/> Refresh</button></div>
      <div className="client-notice"><strong>Read-only directory</strong><p>Client creation, edits, imports, exports and bulk actions require a verified backend with separate permissions and audit logs. They are not available in this workspace yet.</p></div>
      <section aria-label="Client summary" className="client-metrics"><div><span className="client-metric-icon"><Users size={19}/></span><div><p>Account records</p><strong>{total === null ? '—' : total.toLocaleString('en-IN')}</strong><small>{countError ? 'Count unavailable' : total === null ? 'Loading…' : 'All records in users collection'}</small></div></div><div><p>Client status</p><strong>—</strong><small>Not tracked in current model</small></div><div><p>Compliance deadlines</p><strong>—</strong><small>Not available in client records</small></div></section>
      <section className="client-list" aria-labelledby="clients-title"><div className="client-list-head"><div><h2 id="clients-title">Client directory</h2><p>Registered client accounts · ordered by client ID</p></div><div className="client-controls"><label className="client-search"><Search size={17}/><span className="sr-only">Search current page</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search this page" type="search"/></label><label className="client-size">Rows <select value={size} onChange={e => { setSize(Number(e.target.value)); setCursors([null]); setPage(0); setSearch(''); }}><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select></label></div></div>
        <p className="client-search-hint">Search applies only to the current page. Full-database search requires a secure search service.</p>
        {loading ? <div className="client-empty" role="status">Loading clients…</div> : error ? <div className="client-empty" role="alert"><strong>Unable to load client records.</strong><p>Check your connection and administrator access, then refresh.</p><button onClick={() => setRevision(n => n + 1)}>Try again</button></div> : filtered.length === 0 ? <div className="client-empty"><Users size={24}/><strong>{search ? 'No matches on this page' : 'No clients found'}</strong><p>{search ? 'Try a different search or browse another page.' : 'There are no registered client accounts on this page.'}</p></div> : <div className="client-table-wrap"><table><thead><tr><th>Client</th><th>Client ID</th><th>Contact</th><th>Service</th><th>Last updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.map(client => <tr key={client.id}><td data-label="Client"><strong>{client.name}</strong><small>{client.company || 'No company provided'}</small></td><td data-label="Client ID" className="client-id">{client.id}</td><td data-label="Contact">{client.email || '—'}<small>{client.phone || '—'}</small></td><td data-label="Service">{client.service || '—'}</td><td data-label="Last updated">{client.updatedAt ? (Number.isNaN(Date.parse(client.updatedAt)) ? '—' : new Date(client.updatedAt).toLocaleDateString('en-IN')) : '—'}</td><td data-label="Actions"><button className="client-open" onClick={() => setSelected(client)} aria-label={`View ${client.name}`}>View</button></td></tr>)}</tbody></table></div>}
        <div className="client-pagination"><span>Page {page + 1} · {items.length} loaded</span><div><button onClick={previous} disabled={page === 0 || loading}><ChevronLeft size={16}/> Previous</button><button onClick={forward} disabled={!hasMore || loading}>Next <ChevronRight size={16}/></button></div></div>
      </section>
    </main>
    {selected && <div className="client-detail-backdrop" onClick={() => setSelected(null)}><section ref={detailRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="client-detail-title" className="client-detail" onClick={e => e.stopPropagation()}><div className="client-detail-head"><div><p className="client-kicker">CLIENT PROFILE</p><h2 id="client-detail-title">{selected.name}</h2></div><button onClick={() => setSelected(null)} aria-label="Close client details"><X size={20}/></button></div><dl>{[['Client ID', selected.id], ['Company', selected.company], ['Email', selected.email], ['Phone', selected.phone], ['Requested service', selected.service], ['Last updated', selected.updatedAt]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not provided'}</dd></div>)}</dl><p>Compliance, documents and activity history are not available from this directory’s current data model.</p></section></div>}
  </div>;
}
