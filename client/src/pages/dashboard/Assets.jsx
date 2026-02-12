import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Upload, FileText, Trash2, Eye, Lock, Image, Music, Key, Loader, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Assets = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const tabs = ['All', 'Document', 'Media', 'Password', 'Other'];

    const fetchAssets = async () => {
        try {
            const res = await api.get('/assets');
            setAssets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        // Determine category based on type
        let category = 'other';
        if (file.type.includes('image') || file.type.includes('video') || file.type.includes('audio')) category = 'media';
        else if (file.type.includes('pdf') || file.type.includes('text') || file.type.includes('document')) category = 'document';

        formData.append('category', category);

        try {
            await api.post('/assets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchAssets(); // Refresh list
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this asset?")) return;
        try {
            await api.delete(`/assets/${id}`);
            setAssets(assets.filter(a => a._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        if (type === 'document') return FileText;
        if (type === 'media') return Image;
        if (type === 'password') return Key;
        return Lock;
    };

    const filteredAssets = activeTab === 'All' ? assets : assets.filter(a => a.category === activeTab.toLowerCase());

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Digital Vault</h1>
                    <p className="text-gray-400">Securely store and manage your sensitive assets.</p>
                </div>
                <div onClick={() => fileInputRef.current.click()}>
                    <Button variant="primary" icon={Upload} className="shadow-[0_0_20px_rgba(0,229,255,0.3)]" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload New Asset'}
                    </Button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Upload Zone */}
            <div
                className="group relative overflow-hidden rounded-2xl"
                onClick={() => fileInputRef.current.click()}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Card className="relative border-2 border-dashed border-gray-700 hover:border-neon-blue/50 bg-black/20 hover:bg-black/40 transition-all cursor-pointer flex flex-col items-center justify-center p-12">
                    <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-neon-blue/30 shadow-[0_0_0_0_rgba(0,229,255,0)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                        {uploading ? <Loader className="animate-spin text-neon-blue" /> : <Upload size={32} className="text-gray-400 group-hover:text-neon-blue transition-colors" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Drop Secure Files Here</h3>
                    <p className="text-gray-400 text-center max-w-sm text-sm">
                        Supports PDF, JPG, MP4, MP3. <br />
                        <span className="text-neon-green/80 text-xs">AES-256 Encryption Auto-Enabled</span>
                    </p>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-neon-blue' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-neon-blue shadow-[0_0_10px_#00E5FF]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Assets Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-neon-blue" size={40} />
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No assets found. Upload your first secure file.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAssets.map((asset) => {
                            const Icon = getIcon(asset.category);
                            return (
                                <motion.div
                                    key={asset._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="bg-white/5 border-white/10 hover:border-neon-blue/30 transition-colors group cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <a href={`http://localhost:5000/${asset.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"><Eye size={16} /></a>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(asset._id); }} className="p-1.5 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>

                                        <div className="flex items-start gap-4 p-2">
                                            <div className={`p-3 rounded-lg ${asset.category === 'document' ? 'bg-blue-500/10 text-blue-400' : asset.category === 'media' ? 'bg-purple-500/10 text-purple-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white text-lg truncate">{asset.name}</h3>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                    <span>{asset.size}</span>
                                                    <span>•</span>
                                                    <span>{new Date(asset.uploadedAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="mt-4 flex items-center gap-1.5 text-xs text-neon-green bg-neon-green/5 w-fit px-2 py-1 rounded border border-neon-green/10">
                                                    <Lock size={10} /> {asset.status}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Assets;
