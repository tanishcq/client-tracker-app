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

function blank(){
  return {
    name: '',
    country: '',
    sessionsRequired: 1,
    completedSessions: 0,
    paidAmount: 0
  };
}

export default function ClientForm({ onAdd, initial }){
  const [form, setForm] = useState(initial ?? blank());

  function change(e){
    const { name, value } = e.target;
    // country and name remain strings; others numbers
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
          <input className="input" type="number" min="1" name="sessionsRequired" value={form.sessionsRequired} onChange={change} />
        </div>

        <div className="field">
          <label className="small">Sessions Completed</label>
          <input className="input" type="number" min="0" name="completedSessions" value={form.completedSessions} onChange={change} />
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
