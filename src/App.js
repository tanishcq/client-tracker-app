import React, { useEffect, useState } from 'react';
import ClientForm from './components/ClientForm.js';
import ClientList from './components/ClientList';

const STORAGE_KEY = 'client_tracker_data_v1';

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
    setClients(prev => [{...client, id: Date.now().toString()}, ...prev]);
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

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1 style={{margin:0}}>Client Tracker</h1>
          <div className="small">Track sessions, payments, and edit later.</div>
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
      />

      <div className="footer small">
        <div>Note: Total per session = ₹1000. Pending = total - paid.</div>
        <div>Data saved locally in your browser.</div>
      </div>
    </div>
  );
}
