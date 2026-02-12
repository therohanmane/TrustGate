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
        title: "Secure Storage",
        description: "Military-grade encryption for your most sensitive digital assets and documents."
    },
    {
        icon: Users,
        title: "Trusted Contacts",
        description: "Assign beneficiaries who will receive access only when specific conditions are met."
    },
    {
        icon: Clock,
        title: "Inactivity Monitoring",
        description: "Customizable timers that track your digital presence and trigger protocols."
    },
    {
        icon: Shield,
        title: "Controlled Release",
        description: "Automated safe-fail mechanisms ensure data is released only after verification."
    }
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-neon-blue/30 transition-colors duration-300">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px] opacity-50 mix-blend-multiply dark:mix-blend-normal" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px] opacity-50 mix-blend-multiply dark:mix-blend-normal" />
            </div>

            <Navbar />

            <main className="relative pt-40 pb-20 px-6 container mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 px-4 py-1 rounded-full bg-blue-500/10 dark:bg-white/5 border border-blue-500/20 dark:border-white/10 text-sm text-blue-600 dark:text-neon-green font-medium"
                    >
                        🔒 Secure Digital Inheritance Protocol
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-gray-900 dark:text-white"
                    >
                        Your Digital Assets. <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-neon-blue dark:via-neon-purple dark:to-neon-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            Released Only When It Matters.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl"
                    >
                        TrustGate monitors your activity and securely releases your critical data to trusted contacts if you become inactive. The ultimate failsafe for your digital legacy.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link to="/signup">
                            <Button variant="primary" className="text-lg px-8 py-4 shadow-xl shadow-blue-500/20 dark:shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                                Start Secure Vault
                            </Button>
                        </Link>
                        <Button variant="glass" className="text-lg px-8 py-4 text-gray-700 dark:text-white">How it Works</Button>
                    </motion.div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="group hover:-translate-y-2 transition-transform duration-300 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-neon-blue/10 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-neon-blue/20 transition-colors">
                                <feature.icon className="text-blue-600 dark:text-neon-blue" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-white/5 py-10 text-center text-gray-500 bg-gray-50/50 dark:bg-black/40 backdrop-blur-sm">
                <p>© 2026 TrustGate. Secure Digital Asset Release System.</p>
            </footer>
        </div>
    );
};

export default Landing;
