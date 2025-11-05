import React, { useState } from 'react';
import EditModal from './EditModal';

function formatINR(n){
  return '₹' + n.toLocaleString('en-IN');
}

export default function ClientItem({ client, onUpdate, onDelete, onReplace }){
  const [showEdit, setShowEdit] = useState(false);
  const [payInput, setPayInput] = useState('');

  const totalPayment = client.sessionsRequired * 1000;
  const pending = totalPayment - client.paidAmount;
  const progressPercent = Math.round((client.completedSessions / Math.max(1, client.sessionsRequired)) * 100);

  function incCompleted(){
    if(client.completedSessions >= client.sessionsRequired) return;
    onUpdate(client.id, { completedSessions: client.completedSessions + 1 });
  }
  function decCompleted(){
    if(client.completedSessions <= 0) return;
    onUpdate(client.id, { completedSessions: client.completedSessions - 1 });
  }

  function addPayment(){
    const add = Number(payInput);
    if(!add || add <= 0) return alert('Enter positive amount to add');
    onUpdate(client.id, { paidAmount: Number(client.paidAmount) + add });
    setPayInput('');
  }

  return (
    <div className="client-item card" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <div>
          <div className="name">{client.name} <span className="small">({client.country || '—'})</span></div>
          <div className="small">Sessions: {client.completedSessions}/{client.sessionsRequired} — {progressPercent}% completed</div>
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <div className="badge">{formatINR(totalPayment)}</div>
        </div>
      </div>

      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <div style={{textAlign:'right', minWidth:140}}>
          <div style={{fontWeight:700}}>{formatINR(client.paidAmount)}</div>
          <div className="small">Paid</div>
          <div style={{marginTop:6, fontWeight:700, color: pending <= 0 ? '#059669' : '#b91c1c'}}>
            {pending <= 0 ? 'Paid in full' : formatINR(pending)}
          </div>
          <div className="small">Pending</div>
        </div>

        <div className="controls">
          <button className="icon-btn" onClick={decCompleted} title="Decrease completed">−</button>
          <div className="small">{client.completedSessions}</div>
          <button className="icon-btn" onClick={incCompleted} title="Increase completed">+</button>
        </div>

        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input className="input pay-input" placeholder="Add payment ₹" value={payInput} onChange={e=>setPayInput(e.target.value)} />
          <button className="btn" onClick={addPayment}>Add</button>
        </div>

        <div style={{display:'flex', gap:8}}>
          <button className="icon-btn" onClick={()=>setShowEdit(true)}>Edit</button>
          <button className="icon-btn danger" onClick={()=> {
            if(window.confirm('Delete client?')) onDelete(client.id);
          }}>Delete</button>
        </div>
      </div>

      {showEdit && <EditModal client={client} onClose={()=>setShowEdit(false)} onSave={(updated)=>{ onReplace(client.id, updated); setShowEdit(false); }} />}
    </div>
  );
}
