import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import ProjectDetails from './pages/ProjectDetails';
import Login from './pages/Login';
import { getUser } from './services/api';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('USER_ID'));

  const fetchUser = async (idToFetch) => {
    const targetId = idToFetch || currentUserId;
    if (!targetId) return;

    try {
      const userData = await getUser(targetId);
      setUser(userData);
    } catch (error) {
      console.error(error);
      handleLogout();
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUser();
    }
  }, [currentUserId]);

  const handleLoginSuccess = (id) => {
    setCurrentUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('USER_ID');
    setCurrentUserId(null);
    setUser(null);
  };

  if (!currentUserId) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/projects" element={<Projects userId={currentUserId} />} />
          <Route path="/stats" element={<Stats userId={currentUserId} />} />
          <Route path="/settings" element={<Settings userId={currentUserId} onLogout={handleLogout} />} />
          <Route path="/projects/:id" element={<ProjectDetails onUserUpdate={fetchUser} userId={currentUserId} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;