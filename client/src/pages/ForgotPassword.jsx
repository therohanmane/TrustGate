import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, ArrowRight, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await api.post('/auth/forgot-password', { email });
            setStatus({ type: 'success', msg: 'Password reset link sent to your email.' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to send reset link.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-neon-purple/5 rounded-full blur-[100px] opacity-30" />
            </div>

            <Navbar />

            <div className="w-full max-w-md z-10 mt-20">
                <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
                        <p className="text-gray-400 text-sm">Enter your email to receive a reset link.</p>
                    </div>

                    {status.msg && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 mb-6 ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm">{status.msg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            icon={Mail}
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Button variant="primary" type="submit" className="w-full justify-center shadow-[0_0_20px_rgba(124,77,255,0.3)]" disabled={loading}>
                            {loading ? <Loader className="animate-spin" size={20} /> : <>Send Reset Link <ArrowRight size={18} /></>}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Back to Login</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
