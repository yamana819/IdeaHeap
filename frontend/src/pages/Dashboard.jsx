import React,{useState,useEffect} from 'react';
import {Search,Plus,Bell,Zap,Trophy,Flame,Layout,CheckCircle,Clock,Layers,ArrowRight,ChevronRight} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';

import {getUser,getProject} from '../services/api';

const Dashboard=() =>{
    const [user,setUser] = useState(null);
    const [projects,setProjects] = useState([]);
    const [loading,setLoading] = useState(true);
    const [activeTab,setActiveTab] = useState('dashboard');

    const USER_ID=1;

    useEffect(()=>{
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userData,projectsData] = await Promise.all([
                    getUser(USER_ID),
                    getProject(USER_ID)
                ]);
                setUser(userData);
                setProjects(projectsData.reverse());
            } catch (error) {
                console.error("Dashboard data fetch error:",error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    },[]);

    const handeProjectDelete=(deletedId) =>{
        setProjects(prev=>prev.filter(p=>p.id !== deletedId));
    };
    const calculateProgress = () => {
        if (!user || !user.next_level_xp_limit) return 0;
        const percentage = (user.total_xp/user.next_level_xp_limit) * 100;
        return Math.min(percentage,100);
    };
    const xpLeft = user ? (user.next_level_xp_limit - user.total_xp) : 0;
    const totalProjects = projects.length;
    const completedCount=projects.filter(p=>p.status==='Completed').length;
    const inProgressCount=projects.filter(p=>p.status==='Implementation').length;
    const streakCount=user?.current_streak || 0;
    const recentProjects=projects.slice(0,3);

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab}/>
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md z-10 sticky top-0">
                    <h2 className="text-2xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Dashboard
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="relative-hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                            <input 
                                type='text'
                                placeholder='Search projects...'
                                className="bg-slate-900 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-64 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                            <Bell size={20}/>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from indigo-600 to purple-600 flex items-center justify-center font-bold text-sm border-2 border-slate-800 shadow-lg shadow-indigo-500/20 ">
                            {user ? user.username.substrign(0,2).toUpperCase(): '..'}
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-500 animate-pulse">
                                Loading dashboard data...
                        </div>
                    ):(
                        <div className="max-w-7xl mx-auto space-y-8">
                            <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-800 p-6 md:p-8 shadow-2xl group">
                                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-1000"></div>
                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white">
                                                Hello <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">{user?.username || 'Dev'}</span>! 👋 
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}