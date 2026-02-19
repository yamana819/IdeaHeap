import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Plus } from 'lucide-react';
import { updateProject } from '../services/api';

const EditProjectModal = ({ isOpen, onClose, project, onProjectUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [currentTech, setCurrentTech] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tech_stack: [],
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                tech_stack: project.tech_stack || [],
            });
        }
    }, [project, isOpen]);

    if (!isOpen) return null;

    const handleAddTech = (e) => {
        if (e) e.preventDefault();
        if (!currentTech.trim() || formData.tech_stack.includes(currentTech.trim())) return;
        setFormData({
            ...formData,
            tech_stack: [...formData.tech_stack, currentTech.trim()]
        });
        setCurrentTech('');
    };

    const handleRemoveTech = (techToRemove) => {
        setFormData({
            ...formData,
            tech_stack: formData.tech_stack.filter(tech => tech !== techToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const projectPayload = {
                title: formData.title,
                description: formData.description,
                tech_stack: formData.tech_stack,
            };
            await updateProject(project.id, projectPayload);
            onProjectUpdated(); 
            onClose(); 
        } catch (error) {
            console.error("Error updating project:", error);
            alert(error.response?.data?.detail || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Edit Project</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Project Title</label>
                        <input 
                            type="text" required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Tech Stack</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                                placeholder="Type & Press Enter (e.g. React)"
                                value={currentTech}
                                onChange={(e) => setCurrentTech(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTech();
                                    }
                                }}
                            />
                            <button 
                                type="button" onClick={handleAddTech}
                                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-700 transition-colors"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tech_stack.map((tech, index) => (
                                <span key={index} className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm border border-indigo-500/30">
                                    {tech}
                                    <button 
                                        type="button" onClick={() => handleRemoveTech(tech)}
                                        className="hover:text-white ml-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </span> 
                            ))}
                            {formData.tech_stack.length === 0 && (
                                <span className="text-slate-600 text-xs italic">No technologies added yet</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                        <textarea 
                            required rows="3"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none placeholder:text-slate-600"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;