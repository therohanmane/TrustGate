import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignup = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate signup
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center overflow-hidden px-4 transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[30%] w-[400px] h-[400px] bg-green-500/10 dark:bg-neon-green/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 dark:bg-neon-blue/10 rounded-full blur-[100px] opacity-40" />
            </div>

            <Navbar />

            <div className="w-full max-w-md z-10 mt-24 mb-10">
                <Card className="p-8 bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Start securing your digital legacy</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <Input icon={User} placeholder="Full Name" type="text" required />
                        <Input icon={Mail} placeholder="Email Address" type="email" required />
                        <Input icon={Lock} placeholder="Password" type="password" required />
                        <Input icon={ShieldCheck} placeholder="Confirm Password" type="password" required />

                        <div className="text-xs text-gray-500 mt-2">
                            Password Strength: <span className="text-green-600 dark:text-neon-green">Strong</span>
                            <div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                                <div className="h-full w-3/4 bg-green-600 dark:bg-neon-green rounded-full" />
                            </div>
                        </div>

                        <Button variant="primary" className="w-full justify-center mt-6" type="submit" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Get Started'} {!loading && <ArrowRight size={18} />}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        Already have an account? <Link to="/login" className="text-blue-600 dark:text-neon-blue hover:underline font-semibold">Log in</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
