import React from 'react';
import Card from '../../components/ui/Card';
import { ShieldCheck, Unlock, AlertTriangle } from 'lucide-react';

const ReleaseStatus = () => {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Vault Status</h1>
                <p className="text-gray-400">Current state of your digital asset release protocol.</p>
            </div>

            <div className="grid gap-6">
                <Card className="p-8 bg-green-500/5 border-green-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                            <ShieldCheck className="text-green-500" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Secure & Active</h2>
                            <p className="text-gray-400">Your vault is locked. Monitoring is active.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Next Check-in Due</div>
                        <div className="text-xl font-mono text-neon-blue">29 Days</div>
                    </div>
                </Card>

                {/* Timeline Visualization */}
                <div className="relative py-8 pl-8 border-l border-white/10 space-y-12 ml-6">
                    <div className="relative">
                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-green-500 rounded-full border-4 border-black box-content" />
                        <h3 className="text-lg font-bold text-green-500">Monitoring Active</h3>
                        <p className="text-gray-500 text-sm">System is tracking your activity.</p>
                    </div>

                    <div className="relative opacity-50">
                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-gray-700 rounded-full border-4 border-black box-content" />
                        <h3 className="text-lg font-bold text-white">Warning Phase</h3>
                        <p className="text-gray-500 text-sm">Triggers if inactive for 90 days. Alerts sent to you.</p>
                    </div>

                    <div className="relative opacity-50">
                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-gray-700 rounded-full border-4 border-black box-content" />
                        <h3 className="text-lg font-bold text-white">Grace Period</h3>
                        <p className="text-gray-500 text-sm">Final 48-hour countdown before release.</p>
                    </div>

                    <div className="relative opacity-50">
                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-gray-700 rounded-full border-4 border-black box-content" />
                        <h3 className="text-lg font-bold text-white">Vault Unlocked</h3>
                        <p className="text-gray-500 text-sm">Access granted to trusted contacts.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReleaseStatus;
