import React from 'react';
import {LayoutDashboard,FolderKanban,Trophy,Settings,LogOut,Zap} from 'lucide-react';

const Sidebar = ({activeTab,onTabChange}) => {
    const menuItems = [
        {id:'dashboard',label:'Dashboard',icon:LayoutDashboard},
        {id: 'projects',label:'Projects',icon:FolderKanban},
        {id:'stats',label:'Statistics',icon:Trophy},
        {id:'settings',label:'Settings',icon:Settings},
    ];
    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col p-6 hidden md:flex text-slate-300 h-screen">
            <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20 ">
                    <Zap size={24} className="text-cyan-400" fill="currentColor"/>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    IdeaHeap    
                </h1>
            </div>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon=item.icon;
                    const isActive=activeTab===item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={()=> onTabChange(item.id)}
                            className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="pt-6 border-t border-slate-800">
                <button className='flex items-center space-x-3 text-red-400 hover:text-red-300 w-full p-3 transition-colors rounded-xl hover:bg-red-500/10'>
                    <LogOut size={20} />
                    <span>LogOut</span>
                </button>
            </div>
        </aside> 
    );
};

export default Sidebar;
