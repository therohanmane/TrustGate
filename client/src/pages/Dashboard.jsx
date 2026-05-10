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
import { Bell, Search, Menu, X } from 'lucide-react';
import Input from '../components/ui/Input';
import ThemeToggle from '../components/ThemeToggle';
import api from '../utils/api';

const Dashboard = () => {
    const location = useLocation();
    const [user, setUser] = useState({ name: 'User', avatar: '', isVerified: false });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/profile');
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user profile', err);
            }
        };
        fetchUser();
    }, []);

    // Close sidebar on route change (mobile)
    useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (path === 'dashboard') return 'Overview';
        if (path === 'rules')   return 'Inactivity Rules';
        if (path === 'safety')  return 'Safety Tools';
        if (path === 'status')  return 'Release Status';
        if (path === 'support') return 'Help & Support';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div style={{ minHeight:'100vh', background:'var(--ink)', color:'var(--cream)', display:'flex', position:'relative', overflowX:'hidden' }}>
            {/* Backdrop overlay — mobile only */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:39, backdropFilter:'blur(2px)' }}
                />
            )}

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="dash-main" style={{ flex:1, minWidth:0, paddingTop:16 }}>
                {/* Top Bar */}
                <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, background:'rgba(255,255,255,0.03)', backdropFilter:'blur(12px)', padding:'10px 16px', borderRadius:16, border:'1px solid var(--border)', position:'sticky', top:8, zIndex:30, gap:12 }}>
                    {/* Hamburger — hidden on desktop via CSS */}
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="dash-hamburger"
                        aria-label="Toggle sidebar"
                        style={{ flexShrink:0 }}
                    >
                        {sidebarOpen ? <X size={20} color="var(--cream)" /> : <Menu size={20} color="var(--cream)" />}
                    </button>

                    <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(16px,2vw,22px)', fontWeight:700, color:'var(--cream)', flex:1, minWidth:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {getPageTitle()}
                    </h2>

                    <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
                        <div style={{ display:'none' }} className="search-desktop">
                            <Input icon={Search} placeholder="Search assets..." />
                        </div>
                        <ThemeToggle />
                        <button style={{ position:'relative', background:'none', border:'none', cursor:'pointer', color:'var(--slate2)', minHeight:44, minWidth:44, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Bell size={20} />
                            <span style={{ position:'absolute', top:8, right:8, width:8, height:8, background:'#e05a5a', borderRadius:'50%' }}/>
                        </button>
                        <div style={{ display:'flex', alignItems:'center', gap:10, paddingLeft:12, borderLeft:'1px solid var(--border)' }}>
                            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#c9a84c,#e8c97a)', padding:2, flexShrink:0 }}>
                                <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:'var(--ink)', overflow:'hidden' }}>
                                    <img
                                        src={user.avatar ? `http://localhost:5000${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                        alt={user.name}
                                        style={{ width:'100%', height:'100%', objectFit:'cover' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display:'none', textAlign:'right' }} className="user-name-desktop">
                                <p style={{ fontSize:13, fontWeight:600, color:'var(--cream)', margin:0 }}>{user.name}</p>
                                <p style={{ fontSize:11, color:'#4ade80', margin:0 }}>Verified</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ paddingTop:8 }}>
                    <Routes>
                        <Route path="/"         element={<Overview />} />
                        <Route path="/assets"   element={<Assets />} />
                        <Route path="/rules"    element={<Rules />} />
                        <Route path="/safety"   element={<Safety />} />
                        <Route path="/status"   element={<ReleaseStatus />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/activity" element={<Activity />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/support"  element={<Support />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
