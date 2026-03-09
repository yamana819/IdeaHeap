import React from 'react';
import { Calendar, ChevronRight, Layers, ScrollText, Trash2, CheckCircle2, Clock, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteProject } from '../services/api';

const ProjectCard = ({ project, onDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the project "${project.title}"?`)) {
            try {
                await deleteProject(project.id);
                if (onDelete) onDelete(project.id);
            } catch (error) {
                toast.error("An error occurred while deleting the project!");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/20', icon: <CheckCircle2 size={16} />
                };
            case 'Implementation':
                return {
                    color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-blue-500/20', icon: <Clock size={16} />
                };
            case 'Idea':
                return {
                    color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', shadow: 'shadow-amber-500/20', icon: <Lightbulb size={16} />
                };
            default:
                return {
                    color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', shadow: 'shadow-slate-500/20', icon: <Layers size={16} />
                };
        }
    };

    const statusStyle = getStatusStyle(project.status);

    return (
        <div
            onClick={() => navigate(`/projects/${project.id}`)}
            className="group relative bg-[#0f172a] border border-slate-800 hover:border-slate-600 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden" 
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.bg.replace('/10', '')} shadow-[0_0_15px_rgba(0,0,0,0.5)] ${statusStyle.shadow} transition-all group-hover:w-1.5`} />
            <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {project.title}
                    </h3>
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border} border`}>
                        {statusStyle.icon}
                        <span>{project.status}</span>
                    </div>
                </div>
                <button 
                    onClick={handleDelete}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors z-10"
                    title="Delete Project"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <p className="text-slate-500 text-sm mb-5 pl-2 line-clamp-2 h-10 font-medium">
                {project.description || "No description provided..."}
            </p>
            <div className="pl-2 flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack && project.tech_stack.length > 0 ? (
                        project.tech_stack.slice(0, 3).map((tech, index) => (
                            <span key={index} className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {tech}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Layers size={12} /> No Stack 
                        </span>
                    )}
                    {project.tech_stack && project.tech_stack.length > 3 && (
                        <span className="text-[10px] px-1.5 py-1 text-slate-500">
                            +{project.tech_stack.length - 3}
                        </span>
                    )}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-800 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-indigo-400 transition-colors">
                        <ScrollText size={14} />
                        <span className="font-medium">{project.logs ? project.logs.length : 0} Logs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={14} />
                        <span>{project.deadline ? formatDate(project.deadline) : 'No deadline'}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;