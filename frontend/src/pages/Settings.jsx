import React, { useState, useEffect } from 'react';
import { User, Shield, Trash2, Save, Loader2, Key, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUser, updateUser, deleteUser, loginUser } from '../services/api';

const Settings = ({ userId, onLogout }) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    
    const [userData, setUserData] = useState({ username: '' });
    const [originalUsername, setOriginalUsername] = useState('');

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            try {
                const data = await getUser(userId);
                setUserData({ username: data.username });
                setOriginalUsername(data.username);
            } catch (error) {
                toast.error("Failed to load user data");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!userData.username.trim()) return toast.error("Username cannot be empty");
        if (userData.username === originalUsername) return toast.success("No changes made.");
        
        setProfileLoading(true);
        try {
            await updateUser(userId, { username: userData.username });
            setOriginalUsername(userData.username);
            toast.success('Username updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.detail || "Failed to update profile");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New passwords do not match!");
        }
        if (passwords.newPassword === passwords.oldPassword) {
            return toast.error("New password must be different from the current one!");
        }
        if (passwords.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        setPasswordLoading(true);
        try {
            await loginUser({ username: originalUsername, password: passwords.oldPassword });
            
            await updateUser(userId, { password: passwords.newPassword });
            
            toast.success('Password updated successfully! 🔒');
            setIsPasswordModalOpen(false);
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error("Incorrect current password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you absolutely sure? This will delete your account, all projects, and logs forever.");
        if (confirmDelete) {
            try {
                await deleteUser(userId);
                toast.success('Account deleted permanently.');
                onLogout();
            } catch (error) {
                toast.error(error.response?.data?.detail || "Failed to delete account");
            }
        }
    };

    if (initialLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500 animate-pulse">
                Loading workspace settings...
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Key size={20} className="text-indigo-400" />
                                Change Password
                            </h2>
                            <button onClick={() => {
                                setIsPasswordModalOpen(false);
                                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                            }} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                                <input 
                                    type="password" required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all"
                                    value={passwords.oldPassword}
                                    onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                                <input 
                                    type="password" required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                                <input 
                                    type="password" required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsPasswordModalOpen(false);
                                        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                    }} 
                                    className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={passwordLoading} 
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                                >
                                    {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Workspace Settings</h1>
                    <p className="text-slate-400">Manage your profile details, security preferences, and account data.</p>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-800/50 pb-4">
                            <User className="text-indigo-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Profile Information</h2>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 shrink-0 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] border-4 border-[#0f172a] uppercase">
                                {originalUsername ? originalUsername.charAt(0) : '?'}
                            </div>
                            
                            <form onSubmit={handleUpdateProfile} className="flex-1 w-full space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                                    <input 
                                        type="text" 
                                        value={userData.username} 
                                        onChange={e => setUserData({...userData, username: e.target.value})} 
                                        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={profileLoading || userData.username === originalUsername} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {profileLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                                    Save Profile
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-800/50 pb-4">
                            <Shield className="text-emerald-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Security</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                            <div>
                                <h4 className="text-white font-medium text-base">Account Password</h4>
                                <p className="text-slate-400 text-sm mt-1">Ensure your account is using a long, random password to stay secure.</p>
                            </div>
                            <button 
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="shrink-0 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors border border-slate-700 flex items-center gap-2"
                            >
                                <Key size={18} />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-red-500/20 rounded-2xl shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="p-6 md:p-8 relative z-10">
                        <div className="flex items-center gap-3 mb-6 border-b border-red-500/10 pb-4">
                            <AlertTriangle className="text-red-400" size={24} />
                            <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-white font-medium text-base">Delete Account</h4>
                                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                                    Once you delete your account, there is no going back. All of your projects, logs, and XP data will be permanently wiped from our servers.
                                </p>
                            </div>
                            <button 
                                onClick={handleDeleteAccount} 
                                className="shrink-0 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2.5 rounded-lg font-medium transition-colors border border-red-500/30 flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;