import React, { useState, useEffect } from 'react';
import { Search, Plus, Bell, Zap, Trophy, Flame, Layout, CheckCircle, Clock, Layers, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';
import AddProjectModal from '../components/AddProjectModal';
import { getProject } from '../services/api';

const Dashboard = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProjects = async () => {
        if (!user || !user.id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const projectsData = await getProject(user.id);
            setProjects(projectsData.reverse());
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, [user]);

    const handleProjectDelete = (deletedId) => {
        setProjects(prev => prev.filter(p => p.id !== deletedId));
    };

    const calculateProgress = () => {
        if (!user || !user.next_level_xp_limit) return 0;
        const percentage = (user.total_xp / user.next_level_xp_limit) * 100;
        return Math.min(percentage, 100);
    };

    const xpLeft = user ? (user.next_level_xp_limit - user.total_xp) : 0;
    const totalProjects = projects.length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;
    const inProgressCount = projects.filter(p => p.status === 'Implementation').length;
    const streakCount = user?.current_streak || 0;
    const recentProjects = projects.slice(0, 3);

    return (
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <AddProjectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectAdded={fetchProjects}
                userId={user?.id}
            />
            {loading ? (
                <div className="flex items-center justify-center h-full text-slate-500 animate-pulse">
                    Loading dashboard data...
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-800 p-6 md:p-8 shadow-2xl group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-1000"></div>
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">
                                        Hello <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.username || 'Dev'}</span>! 👋 
                                    </h2>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-400 uppercase tracking-wider shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                            {user?.rank || "Novice"}
                                        </span>
                                        <span className="text-slate-400 text-sm font-medium">
                                            Level {user?.level || 1}
                                        </span>
                                    </div>
                                </div>        
                                <div className="hidden md:block text-right bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 backdrop-blur-sm"> 
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Next Milestone</div>
                                    <div className="text-xl font-mono text-white flex items-center justify-end gap-2">
                                        <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                                        {xpLeft > 0 ? `${xpLeft} XP Left` : `Level Up Ready!`}
                                    </div>
                                </div>
                            </div>
                            <div> 
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider"> 
                                    <span>Progress to Lvl {user ? user.level + 1 : 2}</span>
                                    <span>{user?.total_xp || 0} / {user?.next_level_xp_limit || 50}</span>
                                </div>
                                <div className="h-5 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out relative"
                                        style={{ width: `${calculateProgress()}%` }}    
                                    >
                                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            label="Total Projects"
                            value={totalProjects}
                            icon={Layers}
                            color="yellow"
                        />
                        <StatCard
                            label="In Progress"
                            value={inProgressCount}
                            icon={Clock}
                            color="cyan"
                        />
                        <StatCard
                            label="Completed"
                            value={completedCount}
                            icon={CheckCircle}
                            color="purple"
                        />
                        <StatCard
                            label="Day Streak"
                            value={streakCount}
                            icon={Flame}
                            color="pink"
                        />
                    </div>
                    <div className="pt-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                                Recent Projects
                            </h3>
                            <div className="flex items-center gap-3">
                                <Link
                                    to={'/projects'}
                                    className="text-sm text-slate-500 hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors"
                                >
                                    View All <ArrowRight size={14}/>
                                </Link>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
                                >
                                    <Plus size={18}/>
                                    <span>New Project</span>
                                </button>
                            </div>
                        </div>

                        {recentProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {recentProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onDelete={handleProjectDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                                <div className="bg-slate-800 p-4 rounded-full mb-4">
                                    <Layout size={32} className="text-slate-400"/>
                                </div>
                                <h4 className="text-lg font-medium text-slate-300">No Recent Activity</h4>
                                <p className="text-sm mb-6 text-slate-500">Your workspace is clean</p>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                                >
                                    Start a new project <ChevronRight size={14}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;