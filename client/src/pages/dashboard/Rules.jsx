import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Timer, AlertCircle } from 'lucide-react';

const Rules = () => {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Inactivity Protocol</h1>
                <p className="text-gray-400">Configure when and how your digital vault should be released.</p>
            </div>

            <Card className="p-8 bg-white/5 border-white/10">
                <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-neon-blue/10 rounded-lg">
                        <Timer className="text-neon-blue" size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Inactivity Timer</h2>
                        <p className="text-gray-400 text-sm mt-1">If you don't log in for this duration, the release sequence begins.</p>
                    </div>
                </div>

                <div className="mb-10 px-4">
                    <input type="range" min="30" max="365" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue" />
                    <div className="flex justify-between mt-4 text-sm text-gray-400 font-mono">
                        <span>30 Days</span>
                        <span className="text-neon-blue font-bold text-lg">90 Days</span>
                        <span>365 Days</span>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 mb-8">
                    <AlertCircle className="text-yellow-500 shrink-0" size={24} />
                    <p className="text-yellow-200/80 text-sm">
                        After this period, we will attempt to contact you for <strong>48 hours</strong> (Grace Period) before unlocking your vault to beneficiaries.
                    </p>
                </div>

                <Button variant="primary" className="w-full justify-center">
                    Save Configuration
                </Button>
            </Card>
        </div>
    );
};

export default Rules;
