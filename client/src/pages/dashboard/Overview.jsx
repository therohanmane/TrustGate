import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { FileText, Users, Clock, AlertTriangle, Loader, Upload, Trash2, LogIn, Phone, User, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <Card className="flex items-center gap-4 p-6 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </Card>
);

const Overview = () => {
    const [stats, setStats] = useState({
        totalAssets: 0,
        totalContacts: 0,
        lastActive: 'Just now',
        inactivityDays: 30
    });
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch basic stats
                const assetsRes = await api.get('/assets');
                const contactsRes = await api.get('/contacts');
                const userRes = await api.get('/users/profile');

                // Fetch recent logs
                const logsRes = await api.get('/logs');

                setStats({
                    totalAssets: assetsRes.data.length,
                    totalContacts: contactsRes.data.length,
                    lastActive: userRes.data.lastActive ? formatDistanceToNow(new Date(userRes.data.lastActive), { addSuffix: true }) : 'Just now',
                    inactivityDays: userRes.data.settings?.inactivityPeriod || 30
                });

                setRecentLogs(logsRes.data.slice(0, 5)); // Take top 5 recent logs
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getIcon = (action) => {
        if (action.includes('UPLOAD')) return { icon: Upload, color: "text-neon-blue", bg: "bg-neon-blue/10" };
        if (action.includes('DELETE')) return { icon: Trash2, color: "text-red-400", bg: "bg-red-500/10" };
        if (action.includes('LOGIN') || action.includes('REGISTER')) return { icon: LogIn, color: "text-neon-green", bg: "bg-neon-green/10" };
        if (action.includes('CONTACT')) return { icon: Phone, color: "text-orange-400", bg: "bg-orange-500/10" };
        if (action.includes('PROFILE') || action.includes('AVATAR')) return { icon: User, color: "text-neon-purple", bg: "bg-neon-purple/10" };
        if (action.includes('PASSWORD')) return { icon: Key, color: "text-yellow-400", bg: "bg-yellow-500/10" };
        return { icon: FileText, color: "text-gray-400", bg: "bg-gray-500/10" };
    };

    const formatAction = (action) => {
        return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-neon-blue" /></div>;

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={FileText} label="Total Assets" value={stats.totalAssets} color="bg-blue-500 text-blue-600 dark:text-blue-500" delay={0} />
                <StatCard icon={Users} label="Trusted Contacts" value={stats.totalContacts} color="bg-purple-500 text-purple-600 dark:text-purple-500" delay={0.1} />
                <StatCard icon={Clock} label="Last Active" value={stats.lastActive} color="bg-green-500 text-green-600 dark:text-green-500" delay={0.2} />
                <StatCard icon={AlertTriangle} label="Inactivity Timer" value={`${stats.inactivityDays} Days`} color="bg-orange-500 text-orange-600 dark:text-orange-500" delay={0.3} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                    {recentLogs.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>No recent activity.</p>
                            <p className="text-sm">Upload assets to see activity here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentLogs.map((log) => {
                                const { icon: Icon, color, bg } = getIcon(log.action);
                                return (
                                    <div key={log._id} className="flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                                        <div className={`p-2 rounded-lg ${bg} ${color} shrink-0`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate text-sm">{formatAction(log.action)}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{log.details}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Inactivity Status */}
                <Card className="relative overflow-hidden bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Vault Status</h3>
                    <div className="relative w-48 h-48 mx-auto mb-6">
                        {/* Circular Progress Placeholder */}
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700" />
                        <div className="absolute inset-0 rounded-full border-8 border-green-500 dark:border-neon-green border-t-transparent animate-spin-slow rotate-45" style={{ animationDuration: '3s' }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">Active</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Monitoring</span>
                        </div>
                    </div>
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        Your vault is currently secure. Inactivity timer will trigger in <span className="text-gray-900 dark:text-white font-bold">{stats.inactivityDays} days</span>.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
