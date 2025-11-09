import React, { useState } from 'react';
import ClientItem from './ClientItem';

export default function ClientList({
  clients,
  onUpdate,
  onDelete,
  onReplace,
  onUpdateSession // <- accept the prop here
}) {
  const [filter, setFilter] = useState('');
  const [onlyPending, setOnlyPending] = useState(false);

  const filtered = clients.filter(c => {
    if (filter && !(`${c.name} ${c.country}`.toLowerCase().includes(filter.toLowerCase()))) return false;
    if (onlyPending) {
      const total = (c.sessionsRequired || 0) * (c.chargePerSession || 0);
      if ((c.paidAmount || 0) >= total) return false;
    }
    return true;
  });

  return (
    <div className="client-list card" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="input" placeholder="Search name or country" value={filter} onChange={e => setFilter(e.target.value)} />
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={onlyPending} onChange={e => setOnlyPending(e.target.checked)} /> only pending
          </label>
        </div>
        <div className="small">Showing {filtered.length} of {clients.length}</div>
      </div>

      {filtered.length === 0 && <div style={{ padding: 18 }} className="small">No clients yet. Add one above.</div>}

      {filtered.map(client => (
        <ClientItem
          key={client.id}
          client={client}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReplace={onReplace}
          onUpdateSession={onUpdateSession} // <- forward it here
        />
      ))}
    </div>
  );
}
