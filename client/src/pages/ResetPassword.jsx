import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus({ type: 'error', msg: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setStatus({ type: 'success', msg: 'Password reset successfully! Redirecting...' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to reset password. Link may be expired.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center px-4">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-neon-blue/5 rounded-full blur-[100px] opacity-30" />
            </div>

            <Navbar />

            <div className="w-full max-w-md z-10 mt-20">
                <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                        <p className="text-gray-400 text-sm">Create a new secure password.</p>
                    </div>

                    {status.msg && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 mb-6 ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm">{status.msg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            icon={Lock}
                            placeholder="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            icon={Lock}
                            placeholder="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <Button variant="primary" type="submit" className="w-full justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]" disabled={loading}>
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Reset Password'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
