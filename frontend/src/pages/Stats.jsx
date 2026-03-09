import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Trophy, Target, Zap, BrainCircuit, BarChart3, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProject } from '../services/api';

const Stats = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const data = await getProject(userId);
                setProjects(data);
            } catch (error) {
                toast.error("Failed to load statistics data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [userId]);

    const total = projects.length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const inProgress = projects.filter(p => p.status === 'Implementation').length;
    const ideas = projects.filter(p => p.status === 'Idea').length;

    const totalXP = (completed * 100) + (inProgress * 50) + (ideas * 10);
    const currentLevel = Math.floor(totalXP / 300) + 1;
    const xpForNextLevel = 300 - (totalXP % 300);
    const progressPercentage = ((totalXP % 300) / 300) * 100;

    const pieData = [
        { name: 'Completed', value: completed, color: '#10b981' },
        { name: 'In Progress', value: inProgress, color: '#3b82f6' },
        { name: 'Ideas', value: ideas, color: '#f59e0b' },
    ];

    const areaData = projects.map((p, index) => ({
        name: `P${index + 1}`,
        xp: (index + 1) * 30 + (p.status === 'Completed' ? 70 : 0) 
    }));

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 animate-pulse">
                <BarChart3 size={48} className="text-indigo-500/50 mb-4" />
                <p className="font-medium">Analyzing system data...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="max-w-7xl mx-auto space-y-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-xl">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BrainCircuit className="text-indigo-400" size={32} />
                            Engineering Analytics
                        </h1>
                        <p className="text-slate-400 mt-2">Track your development journey and project milestones.</p>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                        <div className="text-center">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Rank</p>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold text-xl mx-auto shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                {currentLevel}
                            </div>
                        </div>
                        <div className="w-48">
                            <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                                <span>{totalXP} XP</span>
                                <span>{xpForNextLevel} to next</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-linear-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 relative"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                        <Trophy className="absolute -right-2 -bottom-2 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors duration-500" size={80} />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Impact</p>
                        <h3 className="text-4xl font-bold text-white">{total}</h3>
                        <p className="text-xs text-indigo-400 mt-2 font-medium">Projects in vault</p>
                    </div>
                    <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                        <Zap className="absolute -right-2 -bottom-2 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500" size={80} />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Shipped</p>
                        <h3 className="text-4xl font-bold text-white">{completed}</h3>
                        <p className="text-xs text-emerald-400 mt-2 font-medium">Successfully deployed</p>
                    </div>
                    <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                        <Target className="absolute -right-2 -bottom-2 text-blue-500/10 group-hover:text-blue-500/20 transition-colors duration-500" size={80} />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">In Progress</p>
                        <h3 className="text-4xl font-bold text-white">{inProgress}</h3>
                        <p className="text-xs text-blue-400 mt-2 font-medium">Currently building</p>
                    </div>
                    <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-2 -bottom-2 text-amber-500/10 group-hover:text-amber-500/20 transition-colors duration-500 text-6xl font-black">💡</div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Backlog</p>
                        <h3 className="text-4xl font-bold text-white">{ideas}</h3>
                        <p className="text-xs text-amber-400 mt-2 font-medium">Awaiting execution</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-cyan-400" /> 
                            Experience Trajectory
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.5}/>
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ color: '#22D3EE', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="xp" stroke="#22D3EE" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <PieChartIcon size={20} className="text-indigo-400" /> 
                            Status Distribution
                        </h3>
                        <div className="min-h-62.5 w-full flex-1 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={pieData} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        dataKey="value"
                                        stroke="#0f172a"
                                        strokeWidth={4}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="w-full mt-4 space-y-3">
                            {pieData.map(item => (
                                <div key={item.name} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-900/50 border border-slate-800/50">
                                    <span className="flex items-center gap-2 text-slate-300 font-medium">
                                        <span className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} /> 
                                        {item.name}
                                    </span>
                                    <span className="text-white font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PieChartIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
);

export default Stats;