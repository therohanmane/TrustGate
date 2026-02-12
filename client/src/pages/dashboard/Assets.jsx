import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Upload, FileText, Trash2, Eye, MoreVertical, Lock } from 'lucide-react';

const Assets = () => {
    const assets = [
        { id: 1, name: "Last_Will_Final.pdf", date: "Oct 24, 2025", size: "2.4 MB", status: "Encrypted" },
        { id: 2, name: "Crypto_Wallet_Keys.txt", date: "Nov 01, 2025", size: "1 KB", status: "Encrypted" },
        { id: 3, name: "Property_Deeds.scan", date: "Jan 15, 2026", size: "45 MB", status: "Encrypted" },
        { id: 4, name: "Stock_Portfolio_Login.json", date: "Feb 10, 2026", size: "12 KB", status: "Encrypted" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Search/Filter Bar could go here */}

            {/* Upload Zone */}
            <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-neon-blue dark:to-neon-purple rounded-2xl opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
                <Card className="relative border-dashed border-2 border-gray-300 dark:border-white/20 bg-white/50 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center p-12 group-hover:border-blue-400 dark:group-hover:border-white/40">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-neon-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload size={32} className="text-blue-600 dark:text-neon-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Secure Assets</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                        Drag and drop your critical files here. <br />
                        <span className="text-xs text-gray-400 dark:text-gray-500">All files are AES-256 encrypted before storage.</span>
                    </p>
                </Card>
            </div>

            {/* Assets List */}
            <Card className="overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Secured Assets</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">4 Encrypted Files Stored</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="!py-2 !px-4 text-sm">Select All</Button>
                        <Button variant="primary" icon={Upload} className="!py-2 !px-4 text-sm">Upload New</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold tracking-wider">
                            <tr>
                                <th className="p-4 pl-6 rounded-l-lg">Asset Name</th>
                                <th className="p-4">Upload Date</th>
                                <th className="p-4">Size</th>
                                <th className="p-4">Encryption Status</th>
                                <th className="p-4 rounded-r-lg text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {assets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="p-4 pl-6 flex items-center gap-4 text-gray-900 dark:text-white font-medium">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        {asset.name}
                                    </td>
                                    <td className="p-4 text-sm">{asset.date}</td>
                                    <td className="p-4 text-sm">{asset.size}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-neon-green text-xs font-medium px-2 py-1 bg-neon-green/10 rounded-full w-fit">
                                            <Lock size={12} /> {asset.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="View Details"><Eye size={18} /></button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Delete Asset"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Assets;
