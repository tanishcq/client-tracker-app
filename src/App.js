import React, { useEffect, useState } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';

const STORAGE_KEY = 'client_tracker_data_v2';

function loadClients(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    return JSON.parse(raw);
  }catch(e){
    console.error(e);
    return [];
  }
}

function saveClients(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function App(){
  const [clients, setClients] = useState(loadClients);
  useEffect(()=> saveClients(clients), [clients]);

  function addClient(client){
    // prepare sessions array
    const sessions = Array.from({length: client.sessionsRequired}).map((_, i) => ({
      index: i + 1,
      date: '',
      completed: Boolean(i < client.completedSessions) // if user supplied completedSessions
    }));
    const completedCount = sessions.filter(s => s.completed).length;
    const toSave = {
      ...client,
      id: Date.now().toString(),
      sessions,
      completedSessions: completedCount
    };
    setClients(prev => [toSave, ...prev]);
  }

  function updateClient(id, patch){
    setClients(prev => prev.map(c => c.id === id ? {...c, ...patch} : c));
  }

  function deleteClient(id){
    setClients(prev => prev.filter(c => c.id !== id));
  }

  function replaceClient(id, newClient){
    setClients(prev => prev.map(c => c.id === id ? {...newClient, id} : c));
  }

  // helper for session-level updates (date or completed)
  function updateSession(id, sessionIndex, changes){
    setClients(prev => prev.map(c => {
      if(c.id !== id) return c;
      const sessions = c.sessions.map(s => s.index === sessionIndex ? {...s, ...changes} : s);
      const completedSessions = sessions.filter(s => s.completed).length;
      return {...c, sessions, completedSessions};
    }));
  }

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1 style={{margin:0}}>Client Tracker</h1>
          <div className="small">Track sessions, their dates, payments, and edit later.</div>
        </div>
        <div>
          <strong>Total clients:</strong> {clients.length}
        </div>
      </div>

      <div className="card">
        <ClientForm onAdd={addClient} />
      </div>

      <ClientList
        clients={clients}
        onUpdate={updateClient}
        onDelete={deleteClient}
        onReplace={replaceClient}
        onUpdateSession={updateSession}
      />

      <div className="footer small">
        <div>Note: Total = sessions × charge per session. Pending = total - paid.</div>
        <div>Data saved locally in your browser.</div>
      </div>
    </div>
  );
}
