import React from 'react';

const StatCard = ({label,value,icon:Icon,color})=> {
    const variants = {
        purple:"bg-violet-500/10 text-violet-400 border-violet-500/20 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.15)] ",
        cyan:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
        pink:"bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(232,121,249,0.15)]",
        yellow:"bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    };
    const activeStyle = variants[color] || variants.cyan;
    return (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:bg-slate-900 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl border transition-all duration-300 ${activeStyle}`}>
                    <Icon size={24} />
                </div>    
            </div>    
        </div>
    )
}

export default StatCard;