import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Safety from './dashboard/Safety';
import Rules from './dashboard/Rules';
import ReleaseStatus from './dashboard/ReleaseStatus';
import Contacts from './dashboard/Contacts';
import Activity from './dashboard/Activity';
import Settings from './dashboard/Settings';
import Support from './dashboard/Support';
import Overview from './dashboard/Overview';
import Assets from './dashboard/Assets';
import { Bell, Search } from 'lucide-react';
import Input from '../components/ui/Input';
import api from '../utils/api';

const Dashboard = () => {
    const location = useLocation();
    const [user, setUser] = useState({ name: 'User', avatar: '', isVerified: false });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/profile');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            }
        };
        fetchUser();
    }, []);

    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (path === 'dashboard') return 'Overview';
        if (path === 'rules') return 'Inactivity Rules';
        if (path === 'safety') return 'Safety Tools';
        if (path === 'status') return 'Release Status';
        if (path === 'support') return 'Help & Support';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-neon-blue/30 transition-colors duration-300">
            <Sidebar />
            <div className="ml-64 p-8">
                {/* Top Navbar */}
                <header className="flex justify-between items-center mb-8 bg-white/80 dark:bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 dark:border-white/5 sticky top-8 z-30 transition-colors">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{getPageTitle()}</h2>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block w-64">
                            <Input icon={Search} placeholder="Search assets..." className="!py-2 !text-sm" />
                        </div>

                        <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Bell size={24} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-white/10">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-green-600 dark:text-neon-green">Verified</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 overflow-hidden">
                                    <img
                                        src={user.avatar ? `http://localhost:5000${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mt-8">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/assets" element={<Assets />} />
                        <Route path="/rules" element={<Rules />} />
                        <Route path="/safety" element={<Safety />} />
                        <Route path="/status" element={<ReleaseStatus />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/activity" element={<Activity />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/support" element={<Support />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
