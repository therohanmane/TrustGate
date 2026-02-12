import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const icons = {
        light: Sun,
        dark: Moon,
        system: Monitor,
    };

    const ActiveIcon = icons[theme] || Sun;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
                <ActiveIcon size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-36 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                        {Object.keys(icons).map((key) => {
                            const Icon = icons[key];
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setTheme(key);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${theme === key ? 'text-neon-blue bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span className="capitalize">{key}</span>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop to close */}
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
};

export default ThemeToggle;
