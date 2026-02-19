import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';
import { createUser, loginUser } from '../services/api';

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userData;
            if (isLoginView) {
                userData = await loginUser(formData);
            } else {
                userData = await createUser(formData);
            }
            localStorage.setItem('USER_ID', userData.id);
            onLoginSuccess(userData.id);
            navigate('/dashboard');
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.response?.data?.detail || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl mb-4">
                        <Terminal size={32} className="text-indigo-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isLoginView ? 'Welcome Back' : 'Start Your Journey'}
                    </h1>
                    <p className="text-slate-400">
                        {isLoginView ? 'Enter your credentials to access your workspace.' : 'Create an account to track your engineering projects.'}
                    </p>
                </div>
                <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Username</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !formData.username || !formData.password}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    {isLoginView ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            {isLoginView ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsLoginView(!isLoginView);
                                    setError('');
                                    setFormData({username: '', password: ''});
                                }}
                                className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors focus:outline-none"
                            >
                                {isLoginView ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;