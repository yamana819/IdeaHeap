import React from 'react';
import {LayoutDashboard,FolderKanban,Trophy,Settings,LogOut,Zap,X} from 'lucide-react';
import {Link,useLocation} from 'react-router-dom';

const Sidebar = ({isOpen,onClose,onLogout}) => {
    const location=useLocation();
    const menuItems = [
        {path:'/dashboard',label:'Dashboard',icon:LayoutDashboard},
        {path: '/projects',label:'Projects',icon:FolderKanban},
        {path:'/stats',label:'Statistics',icon:Trophy},
        {path:'/settings',label:'Settings',icon:Settings},
    ];
    return (
        <aside className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 
                    flex flex-col p-6 h-screen transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:static md:flex
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white md:hidden"
            >
                <X size={24}/>
            </button>
            <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20 ">
                    <Zap size={24} className="text-cyan-400" fill="currentColor"/>
                </div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    IdeaHeap    
                </h1>
            </div>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon=item.icon;
                    const isActive=location.pathname===item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="pt-6 border-t border-slate-800">
                <button 
                    onClick={onLogout}
                    className='flex items-center space-x-3 text-red-400 hover:text-red-300 w-full p-3 transition-colors rounded-xl hover:bg-red-500/10'
                >
                    <LogOut size={20} />
                    <span>LogOut</span>
                </button>
                <div className="flex flex-col items-center gap-1 text-xs text-slate-600 mt-4">
                    <p>
                        &copy; 2026 <span className="font-bold text-slate-500">IdeaHeap</span>
                    </p>
                    <div className="flex items-center gap-2 opacity-60">
                        <span>v1.0.0</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span>Beta</span>
                    </div>
                </div>
            </div>
        </aside> 
    );
};

export default Sidebar;