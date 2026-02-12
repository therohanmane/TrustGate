import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
    const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-transparent",
        secondary: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700",
        neon: "bg-transparent text-green-600 dark:text-neon-green border border-green-600 dark:border-neon-green hover:bg-green-600/10 dark:hover:bg-neon-green/10 hover:shadow-[0_0_15px_#39ff14]",
        glass: "bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white hover:bg-white/80 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20",
        danger: "bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20 hover:bg-red-500/20",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={20} />}
            {children}
        </motion.button>
    );
};

export default Button;
