import React from 'react';
import Card from '../../components/ui/Card';
import { FileText, LogIn, Settings as SettingsIcon, Shield, Upload, Trash2 } from 'lucide-react';

const Activity = () => {
    const logs = [
        { id: 1, action: "File Uploaded", details: "Last_Will_Final.pdf", time: "2 hours ago", icon: Upload, color: "text-blue-400", bg: "bg-blue-500/10" },
        { id: 2, action: "Protocol Updated", details: "Inactivity timer set to 90 days", time: "1 day ago", icon: SettingsIcon, color: "text-purple-400", bg: "bg-purple-500/10" },
        { id: 3, action: "Login Success", details: "Logged in from Chrome / Windows", time: "1 day ago", icon: LogIn, color: "text-green-400", bg: "bg-green-500/10" },
        { id: 4, action: "Contact Added", details: "Sarah Johnson added as Beneficiary", time: "3 days ago", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" },
        { id: 5, action: "File Deleted", details: "Old_Keys.txt", time: "1 week ago", icon: Trash2, color: "text-red-400", bg: "bg-red-500/10" },
    ];

    return (
        <div className="max-w-4xl space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Activity Audit Log</h2>

            <Card className="p-0 overflow-hidden bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {logs.map((log) => (
                        <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className={`p-3 rounded-xl ${log.bg} ${log.color} shrink-0`}>
                                <log.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{log.action}</h4>
                                <p className="text-gray-500 dark:text-gray-400">{log.details}</p>
                            </div>
                            <div className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap pt-1">
                                {log.time}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-black/20 text-center border-t border-gray-100 dark:border-white/5">
                    <button className="text-neon-blue text-sm hover:underline">View All Log History</button>
                </div>
            </Card>
        </div>
    );
};

export default Activity;
