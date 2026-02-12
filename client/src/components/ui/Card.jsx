import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${className}`}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
