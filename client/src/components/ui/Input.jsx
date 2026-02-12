import React from 'react';

const Input = ({ icon: Icon, className = '', ...props }) => {
    return (
        <div className={`relative group ${className}`}>
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors duration-300">
                    <Icon size={20} />
                </div>
            )}
            <input
                className={`w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 ${Icon ? 'pl-10' : ''} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-neon-blue/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-neon-blue/50 focus:bg-white dark:focus:bg-black/40 transition-all duration-300`}
                {...props}
            />
        </div>
    );
};

export default Input;
