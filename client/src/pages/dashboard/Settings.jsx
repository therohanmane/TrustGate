import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Lock, Clock, Shield, Save, Mail, AlertTriangle } from 'lucide-react';

const Settings = () => {
    const [inactivityDays, setInactivityDays] = useState(90);
    const [gracePeriod, setGracePeriod] = useState(true);

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            {/* Inactivity Configuration (Critical) */}
            <Card className="border-l-4 border-l-blue-500 dark:border-l-neon-blue overflow-visible bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Clock size={100} className="text-blue-500 dark:text-neon-blue" />
                </div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10 text-gray-900 dark:text-white">
                    <Shield className="text-blue-500 dark:text-neon-blue" /> Inactivity Protocol Configuration
                </h3>

                <div className="mb-8 relative z-10">
                    <div className="flex justify-between mb-2">
                        <label className="text-gray-600 dark:text-gray-300 font-medium">Inactivity Trigger Duration</label>
                        <span className="text-2xl font-bold text-blue-600 dark:text-neon-blue">{inactivityDays} Days</span>
                    </div>

                    <input
                        type="range"
                        min="30"
                        max="365"
                        step="15"
                        value={inactivityDays}
                        onChange={(e) => setInactivityDays(e.target.value)}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:accent-neon-blue hover:accent-purple-500 dark:hover:accent-neon-purple transition-all"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>30 Days</span>
                        <span>1 Year</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">Note:</span> If you do not login for <span className="text-gray-900 dark:text-white font-bold">{inactivityDays} consecutive days</span>, the system will initiate the asset release process.
                    </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 mb-6 relative z-10">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Validation Grace Period
                            <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 dark:bg-neon-green/10 text-green-600 dark:text-neon-green border border-green-500/20 dark:border-neon-green/20">Recommended</span>
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Wait 48 hours after inactivity period before final release.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={gracePeriod} onChange={() => setGracePeriod(!gracePeriod)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-neon-green"></div>
                    </label>
                </div>

                <div className="flex justify-end relative z-10">
                    <Button variant="primary" icon={Save}>Update Protocol</Button>
                </div>
            </Card>

            {/* Profile Settings */}
            <Card>
                <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Full Name</label>
                        <Input icon={User} defaultValue="Alex Sterling" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Email Address</label>
                        <Input icon={Mail} defaultValue="alex.sterling@example.com" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button variant="secondary">Save Profile</Button>
                </div>
            </Card>

            {/* Security */}
            <Card>
                <h3 className="text-xl font-bold mb-6 text-red-400">Danger Zone</h3>
                <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                    <div>
                        <h4 className="font-bold text-white">Delete Vault</h4>
                        <p className="text-gray-400 text-sm">Permanently delete your account and all stored assets.</p>
                    </div>
                    <Button variant="danger" className="bg-red-500 hover:bg-red-600 text-white border-transparent">Delete Account</Button>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
