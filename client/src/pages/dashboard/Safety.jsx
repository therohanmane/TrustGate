import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AlertTriangle, MapPin, MessageSquare, Mic } from 'lucide-react';

const Safety = () => {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Safety Tools</h1>
                <p className="text-gray-400">Emergency features designed for your personal safety.</p>
            </div>

            {/* SOS Section */}
            <Card className="p-8 border-red-500/30 bg-red-500/5 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/10 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse">
                        <AlertTriangle className="text-white w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-500 mb-2">EMERGENCY SOS</h2>
                    <p className="text-gray-400 mb-6 max-w-md">
                        Pressing this will instantly send your live location and a distress message to all your Trusted Contacts.
                    </p>
                    <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white border-none text-lg px-8 py-3 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                        ACTIVATE SOS
                    </Button>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <MapPin className="text-neon-blue mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Share Location</h3>
                    <p className="text-gray-400 text-sm">Send your real-time location to a contact for the next 1 hour.</p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <MessageSquare className="text-neon-purple mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Silent Alert</h3>
                    <p className="text-gray-400 text-sm">Discreetly notify contacts without raising an audible alarm.</p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <Mic className="text-neon-green mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Record Evidence</h3>
                    <p className="text-gray-400 text-sm">Start a stealth audio recording and upload to your vault.</p>
                </Card>
            </div>
        </div>
    );
};

export default Safety;
