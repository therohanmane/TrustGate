import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Users, Activity, Settings,
    LogOut, ShieldCheck, AlertTriangle, Timer, Unlock, HelpCircle, X
} from 'lucide-react';

const links = [
    { icon: LayoutDashboard, label: 'Overview',         path: '/dashboard' },
    { icon: FileText,        label: 'My Vault',         path: '/dashboard/assets' },
    { icon: Users,           label: 'Trusted Contacts', path: '/dashboard/contacts' },
    { icon: Timer,           label: 'Inactivity Rules', path: '/dashboard/rules' },
    { icon: AlertTriangle,   label: 'Safety Tools',     path: '/dashboard/safety' },
    { icon: Unlock,          label: 'Release Status',   path: '/dashboard/status' },
    { icon: Activity,        label: 'Activity Logs',    path: '/dashboard/activity' },
    { icon: Settings,        label: 'Settings',         path: '/dashboard/settings' },
    { icon: HelpCircle,      label: 'Support',          path: '/dashboard/support' },
];

const Sidebar = ({ open, onClose }) => {
    const nav = useNavigate();

    return (
        <aside style={{
            width: 256,
            background: 'rgba(10,15,30,0.96)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            position: 'fixed',
            left: 0, top: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40,
            transform: open ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(.22,1,.36,1)',
            overflowY: 'auto',
        }}>
            {/* Logo row */}
            <div style={{ height: 72, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:'var(--gold2)' }}>
                    <ShieldCheck size={22} color="var(--gold)" />
                    TrustGate
                </div>
                {/* Close button — only on mobile */}
                <button onClick={onClose} aria-label="Close sidebar"
                    style={{ background:'none', border:'none', cursor:'pointer', color:'var(--slate)', padding:4, display:'flex', alignItems:'center', justifyContent:'center', minHeight:44, minWidth:44 }}
                    className="sidebar-close-btn">
                    <X size={18} />
                </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4, overflowY:'auto' }}>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/dashboard'}
                        onClick={onClose}
                        style={({ isActive }) => ({
                            display:'flex', alignItems:'center', gap:12,
                            padding:'11px 14px', borderRadius:12,
                            fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:14,
                            textDecoration:'none', transition:'all .2s',
                            color: isActive ? 'var(--gold2)' : 'var(--slate2)',
                            background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                            border: isActive ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
                            minHeight: 44,
                        })}
                    >
                        <link.icon size={18} style={{ flexShrink:0 }} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div style={{ padding:12, borderTop:'1px solid var(--border)', flexShrink:0 }}>
                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to logout?')) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            nav('/login');
                        }
                    }}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', color:'#f87171', background:'rgba(248,113,113,0.05)', border:'1px solid rgba(248,113,113,0.1)', width:'100%', borderRadius:12, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:14, transition:'all .2s', minHeight:44 }}
                >
                    <LogOut size={18} style={{ flexShrink:0 }} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
