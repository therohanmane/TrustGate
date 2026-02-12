import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <ShieldCheck className="text-neon-blue" size={32} />
                    <span className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                        TrustGate
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/login">
                        <Button variant="glass" className="!px-6">Login</Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="primary">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
