import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
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

                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input icon={Mail} placeholder="Email Address" type="email" required />
                        <Input icon={Lock} placeholder="Password" type="password" required />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded bg-gray-200 dark:bg-black/40 border-gray-400 dark:border-gray-600 text-neon-blue focus:ring-neon-blue checked:bg-neon-blue" />
                                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-600 dark:text-neon-blue hover:text-purple-600 dark:hover:text-neon-purple transition-colors">Forgot Password?</a>
                        </div>

                        <Button variant="primary" className="w-full justify-center" type="submit" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login'} {!loading && <LogIn size={18} />}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        Don't have an account? <Link to="/signup" className="text-blue-600 dark:text-neon-blue hover:underline font-semibold">Sign up</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};


export default Login;
