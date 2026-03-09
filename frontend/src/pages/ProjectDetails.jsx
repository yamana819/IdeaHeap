import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Layers, Clock, CheckCircle2, Trash2, Send, Rocket, AlertCircle, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProject, getProjectLogs, updateProject, startProject, completeProject, createLog, deleteLog } from '../services/api';
import EditProjectModal from '../components/EditProjectModal';
import EditLogModal from '../components/EditLogModal';

const ProjectDetails = ({ onUserUpdate, userId }) => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [logs, setLogs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [deadlineInput, setDeadlineInput] = useState(''); 
    const [newLogTitle, setNewLogTitle] = useState('');
    const [newLogContent, setNewLogContent] = useState('');
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [selectedLogForEdit, setSelectedLogForEdit] = useState(null);

    const fetchData = async () => {
        if (!userId) return; 
        try {
            setLoading(true);
            const allProjects = await getProject(userId);
            const currentProject = allProjects.find(p => String(p.id) === String(id));
            if (currentProject) {
                setProject(currentProject);
                const projectLogs = await getProjectLogs(currentProject.id);
                setLogs(projectLogs);
            } else {
                setProject(null);
            }
        } catch (error) {
            toast.error("Failed to load project details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, userId]);

    const handleStartProject = async () => {
        if (!deadlineInput) {
            return toast.error("Please select a target deadline first!");
        }
        
        try {
            await updateProject(project.id, { deadline: deadlineInput });
            await startProject(project.id);
            fetchData(); 
            toast.success('Project started successfully! 🚀');
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error starting project");
        }
    };

    const handleCompleteProject = async () => {
        try {
            await completeProject(project.id);
            fetchData();
            if (onUserUpdate) onUserUpdate();
            toast.success('Project Completed! +100 XP 🎉');
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error completing project");
        }
    };

    const handleAddLog = async (e) => {
        e.preventDefault();
        if (!newLogTitle.trim() || !newLogContent.trim()) {
            return toast.error("Both Title and Content are required!");
        }
        try {
            await createLog(project.id, { title: newLogTitle, content: newLogContent });
            setNewLogTitle('');
            setNewLogContent(''); 
            const updatedLogs = await getProjectLogs(project.id);
            setLogs(updatedLogs);
            if (onUserUpdate) onUserUpdate();
            toast.success('Log added successfully!');
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error adding log");
        }
    };

    const handleDeleteLog = async (logId) => {
        if (window.confirm("Are you sure you want to delete this log?")) {
            try {
                await deleteLog(logId);
                const updatedLogs = await getProjectLogs(project.id);
                setLogs(updatedLogs);
                toast.success('Log deleted successfully');
            } catch (error) {
                toast.error(error.response?.data?.detail || "Error deleting log");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) return <div className="flex-1 flex items-center justify-center p-8 text-slate-500 animate-pulse">Loading workspace...</div>;
    if (!project) return <div className="flex-1 flex items-center justify-center p-8 text-red-400">Project not found!</div>;

    return (
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <EditProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={project} onProjectUpdated={fetchData} />
            <EditLogModal isOpen={!!selectedLogForEdit} onClose={() => setSelectedLogForEdit(null)} log={selectedLogForEdit} onLogUpdated={fetchData} />
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 mb-6 font-medium">
                    <ArrowLeft size={18} /> Back to Projects
                </button>
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider ${project.status === 'Idea' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : project.status === 'Implementation' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                {project.status}
                            </span>
                            {project.status !== 'Completed' && (
                                <button onClick={() => setIsProjectModalOpen(true)} className="text-slate-500 hover:text-indigo-400 ml-2">
                                    <Edit2 size={18} />
                                </button>
                            )}
                        </div>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">{project.description || "No description provided."}</p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col items-end gap-3 z-10 shrink-0">
                        {project.status === 'Idea' && (
                            <div className="flex flex-col gap-2 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                                <label className="text-xs text-slate-400 font-medium">Target Deadline:</label>
                                <div className="flex gap-2">
                                    <input type="date" value={deadlineInput} onChange={e => setDeadlineInput(e.target.value)} className="bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                                    <button onClick={handleStartProject} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Rocket size={16} /> Start</button>
                                </div>
                            </div>
                        )}
                        {project.status === 'Implementation' && (
                            <button onClick={handleCompleteProject} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"><CheckCircle2 size={20} /> Complete Project</button>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {project.status === 'Implementation' && (
                            <form onSubmit={handleAddLog} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
                                <h3 className="text-sm font-bold text-slate-400">Add New Log</h3>
                                <input type="text" placeholder="Log Title" value={newLogTitle} onChange={e => setNewLogTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Detailed description..." value={newLogContent} onChange={e => setNewLogContent(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg flex items-center justify-center"><Send size={18} /></button>
                                </div>
                            </form>
                        )}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3"><Clock size={20} className="text-indigo-400" /> Project Logs<span className="bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full ml-1">{logs.length}</span></h3>
                            {logs && logs.length > 0 ? (
                                <div className="space-y-4">
                                    {[...logs].reverse().map((log) => (
                                        <div key={log.id} className="group flex justify-between items-start bg-[#0f172a] border border-slate-800 p-5 rounded-xl hover:border-slate-600 transition-all relative">
                                            <div className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-500/30 rounded-r-full group-hover:bg-indigo-500 transition-colors" />
                                            <div className="pl-3">
                                                <h4 className="text-white font-bold text-sm">{log.title}</h4>
                                                <p className="text-slate-400 text-sm mt-1">{log.content}</p>
                                                <p className="text-xs text-slate-500 mt-3 font-medium">{formatDate(log.created_at)}</p>
                                            </div>
                                            {project.status !== 'Completed' && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => setSelectedLogForEdit(log)} className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteLog(log.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30"><p className="font-medium">No logs yet.</p></div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                            <Calendar size={100} className="absolute -right-6 -bottom-6 text-slate-800/50 rotate-12" />
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2 relative z-10">Target Deadline</h3>
                            <p className="text-xl font-bold text-white relative z-10">{formatDate(project.deadline)}</p>
                            {project.status === 'Implementation' && (
                                <div className="mt-3 text-xs text-amber-400 flex items-center gap-1.5 font-medium bg-amber-500/10 w-fit px-2 py-1 rounded relative z-10 border border-amber-500/20"><AlertCircle size={14} /> Keep pushing forward!</div>
                            )}
                        </div>
                        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Layers size={16} /> Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tech_stack && project.tech_stack.length > 0 ? (
                                    project.tech_stack.map((tech, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-300">{tech}</span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-500 italic">No technologies specified.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;