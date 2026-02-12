import React from 'react';
import Card from '../../components/ui/Card';
import { FileText, Users, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

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
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={FileText} label="Total Assets" value="12" color="bg-blue-500 text-blue-600 dark:text-blue-500" delay={0} />
                <StatCard icon={Users} label="Trusted Contacts" value="4" color="bg-purple-500 text-purple-600 dark:text-purple-500" delay={0.1} />
                <StatCard icon={Clock} label="Last Active" value="2h ago" color="bg-green-500 text-green-600 dark:text-green-500" delay={0.2} />
                <StatCard icon={AlertTriangle} label="Inactivity Timer" value="29 Days" color="bg-orange-500 text-orange-600 dark:text-orange-500" delay={0.3} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Document "Will_Final.pdf" uploaded</h4>
                                    <p className="text-xs text-gray-500">Today, 10:23 AM</p>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400 px-2 py-1 rounded bg-green-100 dark:bg-green-500/10">Completed</span>
                            </div>
                        ))}
                    </div>
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
                        Your vault is currently secure. Inactivity timer will trigger in <span className="text-gray-900 dark:text-white font-bold">29 days</span>.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
