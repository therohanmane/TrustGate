import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Lock, Clock, Shield, Save, Mail, AlertTriangle, Camera, Loader, CheckCircle } from 'lucide-react';
import api from '../../utils/api';

const Settings = () => {
    const [user, setUser] = useState({ name: '', email: '', phone: '', avatar: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', content: '' });
    const [inactivityDays, setInactivityDays] = useState(90);
    const [gracePeriod, setGracePeriod] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setUser(res.data);
            if (res.data.settings) {
                setInactivityDays(res.data.settings.inactivityPeriod || 90);
                setGracePeriod(res.data.settings.gracePeriod);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/users/profile', { name: user.name, phone: user.phone });
            setUser({ ...user, ...res.data });
            setMsg({ type: 'success', content: 'Profile updated successfully!' });
        } catch (err) {
            setMsg({ type: 'error', content: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMsg({ type: 'error', content: 'New passwords do not match' });
            return;
        }
        setLoading(true);
        try {
            await api.put('/users/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            setMsg({ type: 'success', content: 'Password changed successfully!' });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            setMsg({ type: 'error', content: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await api.post('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser({ ...user, avatar: res.data.avatar });
            // Update local storage user object to reflect new avatar immediately if needed elsewhere
            const lsUser = JSON.parse(localStorage.getItem('user'));
            if (lsUser) {
                lsUser.avatar = res.data.avatar;
                localStorage.setItem('user', JSON.stringify(lsUser));
            }
        } catch (err) {
            setMsg({ type: 'error', content: 'Failed to upload avatar' });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-10">
            {msg.content && (
                <div className={`p-4 rounded-xl flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    {msg.content}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="text-center p-6 bg-white/5 border-white/10 relative overflow-hidden group">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 border-4 border-white/10 group-hover:border-neon-blue/50 transition-all">
                                <img
                                    src={user.avatar ? `http://localhost:5000${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-neon-blue rounded-full cursor-pointer hover:bg-neon-purple transition-colors shadow-lg">
                                <Camera size={16} className="text-white" />
                                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                            </label>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Lock size={18} className="text-neon-blue" /> Change Password</h4>
                        <form onSubmit={handlePasswordChange} className="space-y-3">
                            <Input
                                type="password"
                                placeholder="Current Password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="bg-black/20"
                            />
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                className="bg-black/20"
                            />
                            <Input
                                type="password"
                                placeholder="Confirm New Password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="bg-black/20"
                            />
                            <Button variant="primary" type="submit" className="w-full justify-center" disabled={loading}>
                                {loading ? <Loader className="animate-spin" size={16} /> : 'Update Password'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Right Column: General Settings */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <User size={20} className="text-neon-purple" /> Edit Profile
                        </h3>
                        <form onSubmit={handleProfileUpdate} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Full Name</label>
                                <Input
                                    icon={User}
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Email Address</label>
                                <Input
                                    icon={Mail}
                                    value={user.email}
                                    disabled
                                    className="bg-black/20 border-white/10 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Phone Number</label>
                                <Input
                                    icon={Clock} // Using Clock as placeholder icon or verify import
                                    value={user.phone || ''}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <Button variant="secondary" type="submit" disabled={loading}>Save Changes</Button>
                            </div>
                        </form>
                    </Card>

                    {/* Inactivity Configuration */}
                    <Card className="border-l-4 border-l-neon-blue overflow-visible bg-white/5 border-white/10">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Clock size={100} className="text-neon-blue" />
                        </div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10 text-white">
                            <Shield className="text-neon-blue" /> Inactivity Protocol Configuration
                        </h3>

                        <div className="mb-8 relative z-10">
                            <div className="flex justify-between mb-2">
                                <label className="text-gray-300 font-medium">Inactivity Trigger Duration</label>
                                <span className="text-2xl font-bold text-neon-blue">{inactivityDays} Days</span>
                            </div>

                            <input
                                type="range"
                                min="30"
                                max="365"
                                step="15"
                                value={inactivityDays}
                                onChange={(e) => setInactivityDays(e.target.value)}
                                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue hover:accent-neon-purple transition-all"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>30 Days</span>
                                <span>1 Year</span>
                            </div>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="bg-white/5 border-white/10">
                        <h3 className="text-xl font-bold mb-6 text-red-500">Danger Zone</h3>
                        <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-colors">
                            <div>
                                <h4 className="font-bold text-white">Delete Vault</h4>
                                <p className="text-gray-400 text-sm">Permanently delete your account and all stored assets.</p>
                            </div>
                            <Button variant="danger" className="bg-red-500 hover:bg-red-600 text-white border-transparent shadow-[0_0_20px_rgba(239,68,68,0.3)]">Delete Account</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
