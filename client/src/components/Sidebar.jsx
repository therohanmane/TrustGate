import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Activity, Settings, LogOut, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
    const links = [
        { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
        { icon: FileText, label: "My Assets", path: "/dashboard/assets" },
        { icon: Users, label: "Trusted Contacts", path: "/dashboard/contacts" },
        { icon: Activity, label: "Activity Logs", path: "/dashboard/activity" },
        { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    ];

    return (
        <aside className="w-64 bg-white/90 dark:bg-black/40 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 h-screen fixed left-0 top-0 flex flex-col z-40 transition-colors duration-300">
            <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple bg-clip-text text-transparent">
                    <ShieldCheck className="text-blue-600 dark:text-neon-blue" size={24} />
                    TrustGate
                </div>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === "/dashboard"}
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-blue-500/10 dark:bg-neon-blue/10 text-blue-600 dark:text-neon-blue shadow-none dark:shadow-[0_0_15px_rgba(0,243,255,0.1)]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                        <link.icon size={20} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 w-full rounded-xl transition-all font-medium">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
