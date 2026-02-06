import React,{useState,useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header'

import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

import {getUser} from './services/api';

function App() {
  const [isSidebarOpen,setIsSidebarOpen] = useState(false);
  const [user,setUser] = useState(null);
  const USER_ID=1;
  useEffect(() =>{
    const fetchUser= async()=>{
      try {
        const userData=await(getUser(USER_ID));
        setUser(userData);
      } catch (error){
        console.error("User fetch error:", error);
      }
    };
    fetchUser();
  },[]);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={()=>setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={()=>setIsSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header 
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;