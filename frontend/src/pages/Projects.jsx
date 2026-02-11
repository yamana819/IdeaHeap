import React, { useState, useEffect } from 'react';
import { Search, Plus, FolderOpen } from 'lucide-react';
import { getProject } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import AddProjectModal from '../components/AddProjectModal';

const Projects=()=>{
    const [projects,setProjects]=useState([]);
    const [loading,setLoading]=useState(true);
    const [isModalOpen,setIsModalOpen]=useState(false);

    const [filterStatus,setFilterStatus]=useState('All');
    const [searchQuery,setSearchQuery]=useState('');
    
    const USER_ID=1;

    const fetchProjects= async() =>{
        try {
            setLoading(true);
            const data=await getProject(USER_ID);
            setProjects(data.reverse());
        } catch (error) {
            console.error("Error loading projects.",error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(()=>{
        fetchProjects();
    },[]);

    const handleProjectDelete = (deletedId) =>{
        setProjects(prev=>prev.filter(p=>p.id!==deletedId));
    };

    const filteredProjects = projects.filter(project=>{
        const statusMatch=filterStatus==='All' || project.status===filterStatus;
        const searchLower=searchQuery.toLowerCase();
        const techStack=project.tech_stack || [];
        const searchMatch=
            project.title.toLowerCase().includes(searchLower) || 
            techStack.some(tech=>tech.toLowerCase.includes(searchLower));
        return statusMatch && searchMatch;
    });

    const FilterTab=({label,value,count})=>(
        <button 
            onClick={()=>setFilterStatus(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === value 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
            {label}
            {count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                    filterStatus === value ? 'bg-white/20' : 'bg-slate-800'
                }`}>
                     {count}
                </span>
            )}
        </button>
    );
    const counts = {
        All:projects.length,
        Idea:projects.filter(p=>p.status==='Idea').length,
        Implementation:projects.filter(p=>p.status==='Implementation').length,
        Completed:projects.filter(p=>p.status==='Completed').length
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <AddProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onProjectAdded={fetchProjects} 
            />
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            Projects 
                            <span className="text-lg font-normal text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                Total: {projects.length}
                            </span>
                        </h1>
                        <p className="text-slate-400">Manage your engineering journey.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Create Project</span>
                    </button>
                </div>
                <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                        <FilterTab label="All" value="All" count={counts.All} />
                        <FilterTab label="Ideas 💡" value="Idea" count={counts.Idea} />
                        <FilterTab label="In Progress 🚀" value="Implementation" count={counts.Implementation} />
                        <FilterTab label="Completed ✅" value="Completed" count={counts.Completed} />
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type='text'
                            placeholder='Search projects...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-pulse gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                        <span>Loading projects...</span>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onDelete={handleProjectDelete} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                        <div className="bg-slate-800 p-6 rounded-full mb-4 shadow-inner">
                            <FolderOpen size={48} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
                        <p className="text-slate-400 max-w-sm text-center mb-6">
                            Try adjusting your filters or search query.
                        </p>
                        <button 
                            onClick={() => {setFilterStatus('All'); setSearchQuery('');}}
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;