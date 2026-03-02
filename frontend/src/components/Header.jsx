import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';

const Header = ({ user, onMenuClick }) => {
    const location = useLocation();
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Dashboard';
            case '/projects': return 'Projects';
            case '/stats': return 'Statistics';
            case '/settings': return 'Settings';
            default: return 'IdeaHeap';
        }
    };

    return (
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 bg-slate-800/80 rounded-lg text-white border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-2xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    {getPageTitle()}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                    <Bell size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-sm border-2 border-slate-800 shadow-lg shadow-indigo-500/20 ">
                    {user ? user.username.substring(0, 2).toUpperCase() : '..'}
                </div>
            </div>
        </header>
    );
};

export default Header;