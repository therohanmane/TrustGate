import React from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Shield, Clock, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Lock,
        title: "The Digital Vault",
        description: "A secure fortress for your most sensitive documents, financial details, and final wishes. AES-256 encrypted."
    },
    {
        icon: Users,
        title: "Legacy Contacts",
        description: "Designate family members or legal guardians who will receive access only when you are no longer here."
    },
    {
        icon: Clock,
        title: "Inactivity Protocol",
        description: "If you don't check in for a set period (30-90 days), our system initiates the safety checks."
    },
    {
        icon: Shield,
        title: "Emotional Safety",
        description: "Leave voice notes, video messages, and letters for your loved ones to comfort them in difficult times."
    }
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-neon-blue/30 transition-colors duration-300">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-neon-purple/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-neon-blue/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
            </div>

            <Navbar />

            <main className="relative pt-32 pb-20 px-6 container mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-32 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-neon-blue/10 border border-blue-500/20 dark:border-neon-blue/20 text-sm text-blue-600 dark:text-neon-blue font-medium shadow-[0_0_15px_rgba(37,99,235,0.2)] dark:shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                    >
                        🔒 India's First Controlled Digital Asset Release System
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-gray-900 dark:text-white tracking-tight"
                    >
                        Your Life. Your Secrets. <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-neon-blue dark:via-neon-purple dark:to-neon-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            Released Only When It Matters.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed"
                    >
                        TrustGate acts as your digital executor. We monitor your activity and securely release your critical data (passwords, will, messages) to your trusted family members
                        <span className="text-gray-900 dark:text-white font-semibold"> only if you become inactive</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link to="/signup">
                            <Button variant="primary" className="text-lg px-8 py-4 shadow-[0_0_30px_rgba(37,99,235,0.3)] dark:shadow-[0_0_30px_rgba(124,77,255,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] dark:hover:shadow-[0_0_50px_rgba(124,77,255,0.6)]">
                                Create My Secure Vault
                            </Button>
                        </Link>
                        <Button variant="glass" className="text-lg px-8 py-4 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                            See How It Works
                        </Button>
                    </motion.div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {features.map((feature, index) => (
                        <Card key={index} className="group hover:-translate-y-2 transition-transform duration-300 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 shadow-lg dark:shadow-none">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-neon-blue/20 dark:to-neon-purple/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-white/5">
                                <feature.icon className="text-blue-600 dark:text-neon-blue" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{feature.description}</p>
                        </Card>
                    ))}
                </div>

                {/* Trust/Emotional Section */}
                <div className="mt-32 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Designed for Indian Families & Seniors</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-12">
                        We understand that technology can be overwhelming. TrustGate is built to be simple, accessible, and emotionally sensitive for every citizen.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-500 dark:text-neon-green mb-2">AES-256</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Encryption</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-500 dark:text-neon-blue mb-2">100%</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Privacy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-500 dark:text-neon-purple mb-2">24/7</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Monitoring</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-500 dark:text-neon-red mb-2">SOS</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Safety Tools</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-white/10 py-12 text-center text-gray-500 bg-white/80 dark:bg-black/40 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-left">
                            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-2">
                                <Shield className="text-blue-600 dark:text-neon-blue" size={24} />
                                TrustGate
                            </div>
                            <p className="text-sm">Empowering every Indian to secure their digital legacy.</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 text-sm text-left">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Contact Support</h4>
                                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                    <p><span className="text-blue-600 dark:text-neon-blue">Rohan Mane:</span> 7841910823</p>
                                    <a href="mailto:rohanmane0823@gmail.com" className="hover:text-blue-600 dark:hover:text-white transition-colors">rohanmane0823@gmail.com</a>
                                </div>
                                <div className="space-y-1 text-gray-600 dark:text-gray-400 mt-2">
                                    <p><span className="text-purple-600 dark:text-neon-purple">Anuja Wadnere:</span> 8956805564</p>
                                    <a href="mailto:anujawadnere@gmail.com" className="hover:text-purple-600 dark:hover:text-white transition-colors">anujawadnere@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-neon-blue transition-colors">Privacy Policy</Link>
                                <Link to="/terms" className="hover:text-blue-600 dark:hover:text-neon-blue transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 text-xs border-t border-gray-200 dark:border-white/5 pt-8 text-center text-gray-500">
                        <span>© 2026 TrustGate. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
