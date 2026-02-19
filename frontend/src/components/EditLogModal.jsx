import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from 'lucide-react';
import { updateLog } from '../services/api';

const EditLogModal = ({ isOpen, onClose, log, onLogUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });

    useEffect(() => {
        if (log) {
            setFormData({ title: log.title || '', content: log.content || '' });
        }
    }, [log, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateLog(log.id, formData);
            onLogUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating log:", error);
            alert(error.response?.data?.detail || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Edit Log</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Log Title</label>
                        <input 
                            type="text" required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Content</label>
                        <textarea 
                            required rows="4"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 shadow-lg shadow-indigo-500/20">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Save Log</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLogModal;