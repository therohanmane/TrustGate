import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });

            // Save token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.data._id,
                name: response.data.name,
                email: response.data.email
            }));

            // navigate('/dashboard');
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center overflow-hidden px-4 transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-purple-500/20 dark:bg-neon-blue/20 rounded-full blur-[100px] opacity-40" />
                <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-blue-500/20 dark:bg-neon-purple/20 rounded-full blur-[100px] opacity-40" />
            </div>

            <Navbar />

            <div className="w-full max-w-md z-10 mt-20">
                <Card className="p-8 bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Access your secure vault</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            icon={Mail}
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            icon={Lock}
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded bg-gray-200 dark:bg-black/40 border-gray-400 dark:border-gray-600 text-neon-blue focus:ring-neon-blue checked:bg-neon-blue" />
                                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
                            </label>
                        </div>

                        <Button variant="primary" type="submit" className="w-full justify-center mt-6 shadow-[0_0_20px_rgba(0,229,255,0.3)]" disabled={loading}>
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Access Vault'}
                        </Button>
                    </form>

                    <div className="mt-6 flex justify-between items-center text-sm">
                        <Link to="/forgot-password" className="text-gray-400 hover:text-white transition-colors">Forgot Password?</Link>
                        <Link to="/signup" className="text-neon-blue hover:underline font-semibold">Create Vault</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};


export default Login;
