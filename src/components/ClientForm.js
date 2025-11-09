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

const SESSION_OPTIONS = [1,3,5,7,11,21];

function blank(){
  return {
    name: '',
    country: 'India',
    sessionsRequired: 3,
    completedSessions: 0,
    paidAmount: 0,
    chargePerSession: 1000
  };
}

export default function ClientForm({ onAdd, initial }){
  const [form, setForm] = useState(initial ?? blank());

  function change(e){
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: (name === 'name' || name === 'country') ? value : Number(value)
    }));
  }

  function submit(e){
    e.preventDefault();
    if(!form.name.trim()) return alert('Please enter name');
    if(form.sessionsRequired <= 0) return alert('Sessions must be at least 1');
    if(form.completedSessions < 0) return alert('Completed sessions must be >= 0');
    if(form.completedSessions > form.sessionsRequired) form.completedSessions = form.sessionsRequired;
    if(form.paidAmount < 0) return alert('Paid amount must be >= 0');
    if(form.chargePerSession < 800 || form.chargePerSession > 5100) return alert('Charge per session must be between ₹800 and ₹5100');
    onAdd(form);
    setForm(blank());
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">

        <div className="field">
          <label className="small">Client Name</label>
          <input className="input" name="name" value={form.name} onChange={change} placeholder="e.g., Aman Kumar" />
        </div>

        <div className="field">
          <label className="small">Country</label>
          <select className="select" name="country" value={form.country} onChange={change}>
            {COUNTRIES.map(c => (
              <option key={c.code || c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="small">Sessions Needed</label>
          <select className="select" name="sessionsRequired" value={form.sessionsRequired} onChange={change}>
            {SESSION_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="field">
          <label className="small">Sessions Completed (optional)</label>
          <input className="input" type="number" min="0" max={form.sessionsRequired} name="completedSessions" value={form.completedSessions} onChange={change} />
        </div>

        <div className="field">
          <label className="small">Charge per session (₹)</label>
          <input className="input" type="number" min="800" max="5100" name="chargePerSession" value={form.chargePerSession} onChange={change} />
          <div className="small">Allowed: ₹800 — ₹5100</div>
        </div>

        <div className="field">
          <label className="small">Amount Already Paid (₹)</label>
          <input className="input" type="number" min="0" name="paidAmount" value={form.paidAmount} onChange={change} />
        </div>

        <div style={{display:'flex', alignItems:'flex-end'}}>
          <button className="btn" type="submit">Add client</button>
        </div>
      </div>
    </form>
  );
}
