import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { FileText, LogIn, Settings as SettingsIcon, Shield, Upload, Trash2, User, Key, Phone, Loader, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

const Activity = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/logs');
                setLogs(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load activity logs.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
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

    return (
        <div className="max-w-4xl space-y-6 animate-fade-in text-white">
            <h2 className="text-2xl font-bold mb-6">Activity Audit Log</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <Card className="p-0 overflow-hidden bg-white/5 border-white/10 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader className="animate-spin text-neon-blue" size={32} />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                        <Shield size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">No activity recorded yet.</p>
                        <p className="text-sm">Actions performed in the vault will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {logs.map((log) => {
                            const { icon: Icon, color, bg } = getIcon(log.action);
                            return (
                                <div key={log._id} className="p-6 flex items-start gap-4 hover:bg-white/5 transition-colors group">
                                    <div className={`p-3 rounded-xl ${bg} ${color} shrink-0 border border-white/5`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-lg group-hover:text-neon-blue transition-colors">{formatAction(log.action)}</h4>
                                        <p className="text-gray-400 text-sm">{log.details}</p>
                                    </div>
                                    <div className="text-sm text-gray-500 whitespace-nowrap pt-1 font-mono">
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {logs.length > 0 && (
                    <div className="p-4 bg-black/20 text-center border-t border-white/5">
                        <span className="text-xs text-gray-500">Showing last {logs.length} activities</span>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Activity;
