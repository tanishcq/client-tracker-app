import React, { useState } from 'react';

const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'AE', name: 'UAE' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SG', name: 'Singapore' },
  { code: '',   name: 'Other / Prefer not to specify' }
];

const SESSION_OPTIONS = [3,5,7,11,21];

function adjustSessionsArray(oldSessions, newCount){
  const copy = [...oldSessions];
  if(copy.length > newCount) {
    return copy.slice(0, newCount);
  } else {
    // extend
    const start = copy.length;
    for(let i = start; i < newCount; i++){
      copy.push({ index: i+1, date: '', completed: false });
    }
    return copy;
  }
}

export default function EditModal({ client, onClose, onSave }){
  const [form, setForm] = useState({...client});

  function change(e){
    const { name, value } = e.target;
    const val = (name === 'name' || name === 'country') ? value : Number(value);
    setForm(prev => {
      let next = {...prev, [name]: val};
      // if sessionsRequired changed, adjust sessions array and completedSessions
      if(name === 'sessionsRequired'){
        next.sessions = adjustSessionsArray(prev.sessions || [], Number(value));
        next.completedSessions = next.sessions.filter(s=>s.completed).length;
      }
      return next;
    });
  }

  function submit(e){
    e.preventDefault();
    if(!form.name.trim()) return alert('Name required');
    if(form.sessionsRequired < 1) return alert('Sessions must be at least 1');
    if(form.chargePerSession < 800 || form.chargePerSession > 5100) return alert('Charge per session must be between ₹800 and ₹5100');
    if(form.paidAmount < 0) return alert('Paid >= 0');
    // ensure sessions array length matches sessionsRequired
    const sessions = adjustSessionsArray(form.sessions || [], form.sessionsRequired);
    const completedSessions = sessions.filter(s => s.completed).length;
    onSave({...form, sessions, completedSessions});
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(2,6,23,0.45)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
    }}>
      <div className="card" style={{width:600, maxWidth:'95%'}}>
        <h3 style={{marginTop:0}}>Edit client</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="field">
              <label className="small">Client Name</label>
              <input className="input" name="name" value={form.name} onChange={change} />
            </div>

            <div className="field">
              <label className="small">Country</label>
              <select className="select" name="country" value={form.country} onChange={change}>
                {COUNTRIES.map(c => (
                  <option key={c.code || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label className="small">Sessions Needed</label>
              <select className="select" name="sessionsRequired" value={form.sessionsRequired} onChange={change}>
                {SESSION_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="field">
              <label className="small">Charge per session (₹)</label>
              <input className="input" type="number" min="800" max="5100" name="chargePerSession" value={form.chargePerSession} onChange={change} />
              <div className="small">Allowed: ₹800 — ₹5100</div>
            </div>

            <div className="field">
              <label className="small">Amount Paid (₹)</label>
              <input className="input" type="number" min="0" name="paidAmount" value={form.paidAmount} onChange={change} />
            </div>
          </div>

          <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:8}}>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
