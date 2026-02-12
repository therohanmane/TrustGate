import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/40 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <ShieldCheck className="text-blue-600 dark:text-neon-blue" size={32} />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple">
                        TrustGate
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    {/* ThemeToggle hidden for strict dark mode compliance or re-styled if kept */}
                    <ThemeToggle />
                    <Link to="/login">
                        <Button variant="glass" className="!px-6 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">Login</Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="primary" className="shadow-[0_0_15px_rgba(37,99,235,0.3)] dark:shadow-[0_0_15px_rgba(0,229,255,0.3)]">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
