import React, { useEffect, useState } from 'react';
import EditModal from './EditModal';

function formatINR(n){
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

/* Sessions modal component (local to this file) */
function SessionsModal({ client, onClose, onUpdateSession }) {
  // close on Escape
  useEffect(() => {
    function onKey(e){
      if(e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function toggleCompleted(idx){
    const sess = (client.sessions || []).find(s => s.index === idx);
    if(!sess) return;
    if (typeof onUpdateSession === 'function') onUpdateSession(client.id, idx, { completed: !sess.completed });
  }

  function changeSessionDate(idx, date){
    if (typeof onUpdateSession === 'function') onUpdateSession(client.id, idx, { date });
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <h3 style={{margin:0}}>Sessions for {client.name}</h3>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>

        <div className="small" style={{marginBottom:10}}>
          Total sessions: <strong>{client.sessionsRequired}</strong> — Charge per session: <strong>{formatINR(client.chargePerSession)}</strong>
        </div>

        <div style={{display:'grid', gap:8}}>
          {(client.sessions || []).map(s => (
            <div key={s.index} className="session-row-compact" style={{alignItems:'center'}}>
              <div className="session-index">{s.index}.</div>

              <input
                type="date"
                value={s.date || ''}
                onChange={e => changeSessionDate(s.index, e.target.value)}
                className="date-input-compact"
                aria-label={`Session ${s.index} date`}
              />

              <label className="session-check-compact">
                <input
                  type="checkbox"
                  checked={!!s.completed}
                  onChange={() => toggleCompleted(s.index)}
                />
                <span className="small" style={{marginLeft:6}}>Done</span>
              </label>
            </div>
          ))}
        </div>

        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function ClientItem({ client, onUpdate, onDelete, onReplace, onUpdateSession }){
  const [showEdit, setShowEdit] = useState(false);
  const [payInput, setPayInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // modal state

  const totalPayment = (client.sessionsRequired || 0) * (client.chargePerSession || 0);
  const pending = totalPayment - (client.paidAmount || 0);
  const completedCount = client.sessions ? client.sessions.filter(s=>s.completed).length : (client.completedSessions || 0);
  const progressPercent = Math.round((completedCount / Math.max(1, client.sessionsRequired)) * 100);

  function addPayment(){
    const add = Number(payInput);
    if(!add || add <= 0) return alert('Enter positive amount to add');
    onUpdate(client.id, { paidAmount: Number(client.paidAmount || 0) + add });
    setPayInput('');
  }

  return (
    <div className="client-item card" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, position:'relative'}}>
      <div style={{display:'flex', gap:12, alignItems:'center', flex:1}}>
        <div style={{minWidth:220}}>
          <div className="name">{client.name} <span className="small">({client.country || '—'})</span></div>
          <div className="small">Sessions: {completedCount}/{client.sessionsRequired} — {progressPercent}% completed</div>
          <div className="small">Charge per session: {formatINR(client.chargePerSession)}</div>
        </div>

        <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
          <div className="badge">{formatINR(totalPayment)}</div>

          <div style={{textAlign:'right', minWidth:140}}>
            <div style={{fontWeight:700}}>{formatINR(client.paidAmount)}</div>
            <div className="small">Paid</div>
            <div style={{marginTop:6, fontWeight:700, color: pending <= 0 ? '#059669' : '#b91c1c'}}>
              {pending <= 0 ? 'Paid in full' : formatINR(pending)}
            </div>
            <div className="small">Pending</div>
          </div>
        </div>
      </div>

      <div className="control-group" role="group" aria-label={`Controls for ${client.name}`}>
        <button
          className="btn ghost btn-block"
          onClick={() => setModalOpen(true)}
          aria-expanded={modalOpen}
        >
          View sessions ▼
        </button>

        <div className="payment-row">
          <input
            className="input pay-input"
            placeholder="Add payment ₹"
            value={payInput}
            onChange={e => setPayInput(e.target.value)}
            aria-label={`Add payment for ${client.name}`}
          />
          <button className="btn primary" onClick={addPayment}>Add</button>
        </div>

        <div className="row small-gap">
          <button className="icon-btn" onClick={() => setShowEdit(true)}>Edit</button>
          <button className="icon-btn danger" onClick={() => {
            if (window.confirm('Delete client?')) onDelete(client.id);
          }}>Delete</button>
        </div>
      </div>


      {modalOpen && <SessionsModal client={client} onClose={() => setModalOpen(false)} onUpdateSession={onUpdateSession} />}

      {showEdit && <EditModal client={client} onClose={()=>setShowEdit(false)} onSave={(updated)=>{ onReplace(client.id, updated); setShowEdit(false); }} />}
    </div>
  );
}
