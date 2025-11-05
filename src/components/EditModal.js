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

export default function EditModal({ client, onClose, onSave }){
  const [form, setForm] = useState({...client});

  function change(e){
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: (name==='name' || name==='country') ? value : Number(value)}));
  }

  function submit(e){
    e.preventDefault();
    if(!form.name.trim()) return alert('Name required');
    if(form.sessionsRequired < 1) return alert('Sessions must be at least 1');
    if(form.completedSessions < 0) return alert('Completed >= 0');
    if(form.completedSessions > form.sessionsRequired) form.completedSessions = form.sessionsRequired;
    if(form.paidAmount < 0) return alert('Paid >= 0');
    onSave(form);
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(2,6,23,0.45)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
    }}>
      <div className="card" style={{width:520}}>
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
              <input className="input" type="number" min="1" name="sessionsRequired" value={form.sessionsRequired} onChange={change} />
            </div>

            <div className="field">
              <label className="small">Sessions Completed</label>
              <input className="input" type="number" min="0" name="completedSessions" value={form.completedSessions} onChange={change} />
            </div>

            <div className="field">
              <label className="small">Amount Paid (₹)</label>
              <input className="input" type="number" min="0" name="paidAmount" value={form.paidAmount} onChange={change} />
            </div>
          </div>

          <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
