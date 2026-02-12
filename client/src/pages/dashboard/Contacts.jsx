import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { UserPlus, Mail, Phone, Shield, MoreVertical, Trash, X, Loader, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        relationship: '',
        accessLevel: 'view'
    });

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts');
            setContacts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await api.post('/contacts', formData);
            fetchContacts();
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', relationship: '', accessLevel: 'view' });
        } catch (err) {
            setError('Failed to add contact.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this trusted contact?")) return;
        try {
            await api.delete(`/contacts/${id}`);
            setContacts(contacts.filter(c => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Trusted Contacts</h2>
                    <p className="text-gray-400">Manage who receives access to your vault.</p>
                </div>
                <Button variant="primary" icon={UserPlus} onClick={() => setShowModal(true)} className="shadow-[0_0_20px_rgba(124,77,255,0.3)]">Add Contact</Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-neon-purple" size={40} />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {contacts.map((contact) => (
                            <motion.div
                                key={contact._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="group relative bg-white/5 border-white/10 hover:border-neon-purple/50 transition-all hover:-translate-y-1 h-full">
                                    <div className="absolute top-4 right-4">
                                        <button onClick={() => handleDelete(contact._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash size={18} /></button>
                                    </div>

                                    <div className="flex flex-col items-center text-center p-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue p-[2px] mb-4">
                                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} alt={contact.name} />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white">{contact.name}</h3>
                                        <span className="text-neon-purple text-sm font-medium bg-neon-purple/10 px-2 py-0.5 rounded-full mt-1 border border-neon-purple/20">
                                            {contact.relationship}
                                        </span>

                                        <div className="mt-6 w-full space-y-3">
                                            <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                                <span className="text-gray-500">Access Level</span>
                                                <span className="text-white font-medium capitalize">{contact.accessLevel}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                                <span className="text-gray-500">Status</span>
                                                <span className={`font-medium ${contact.status === 'verified' ? 'text-neon-green' : 'text-yellow-500'} capitalize`}>
                                                    {contact.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-6 w-full">
                                            <a href={`mailto:${contact.email}`} className="flex-1"><Button variant="secondary" icon={Mail} className="w-full justify-center text-xs">Email</Button></a>
                                            {contact.phone && <a href={`tel:${contact.phone}`} className="flex-1"><Button variant="secondary" icon={Phone} className="w-full justify-center text-xs">Call</Button></a>}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Add New Placeholder */}
                    <button onClick={() => setShowModal(true)} className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-500 hover:text-neon-purple hover:border-neon-purple/30 hover:bg-neon-purple/5 transition-all group min-h-[350px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-neon-purple/20 transition-colors">
                            <UserPlus size={32} />
                        </div>
                        <span className="font-medium">Add New Contact</span>
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md"
                    >
                        <Card className="bg-[#1e2433] border-white/10 relative">
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>

                            <h2 className="text-2xl font-bold text-white mb-6">Add Trusted Contact</h2>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input icon={User} placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                                <Input icon={Mail} placeholder="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
                                <Input icon={Phone} placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                                <Input icon={Shield} placeholder="Relationship (e.g. Spouse, Lawyer)" name="relationship" value={formData.relationship} onChange={handleChange} required />

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 ml-1">Access Level</label>
                                    <select
                                        name="accessLevel"
                                        value={formData.accessLevel}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                                    >
                                        <option value="view" className="bg-gray-900">View Only</option>
                                        <option value="full" className="bg-gray-900">Full Access</option>
                                        <option value="partial" className="bg-gray-900">Partial Access</option>
                                    </select>
                                </div>

                                <Button variant="primary" type="submit" className="w-full justify-center mt-4" disabled={submitting}>
                                    {submitting ? <Loader className="animate-spin" /> : 'Save Contact'}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
