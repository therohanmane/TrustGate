import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { UserPlus, Mail, Phone, Shield, MoreHorizontal, Edit, Trash } from 'lucide-react';

const Contacts = () => {
    const contacts = [
        { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", relation: "Spouse", access: "Full Access", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        { id: 2, name: "Michael Chen", email: "m.chen@lawfirm.com", relation: "Lawyer", access: "View Only", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
        { id: 3, name: "Emily Davis", email: "emily.d@example.com", relation: "Sister", access: "Partial Access", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Trusted Contacts</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage who receives your assets when the protocol triggers.</p>
                </div>
                <Button variant="primary" icon={UserPlus}>Add Trusted Contact</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map((contact) => (
                    <Card key={contact.id} className="group hover:-translate-y-1 transition-transform bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500 dark:from-neon-blue dark:to-purple-500">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-black">
                                    <img src={contact.img} alt={contact.name} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{contact.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{contact.relation}</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <Mail size={16} className="text-blue-500 dark:text-neon-blue" />
                                {contact.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <Shield size={16} className="text-purple-500 dark:text-neon-purple" />
                                {contact.access}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="secondary" className="flex-1 !py-2 text-sm">Edit</Button>
                            <Button variant="danger" className="!px-3 !py-2 bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20"><Trash size={18} /></Button>
                        </div>
                    </Card>
                ))}

                {/* Add New Placeholder/Card */}
                <button className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group h-full min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 dark:group-hover:bg-neon-blue/20 group-hover:text-blue-500 dark:group-hover:text-neon-blue transition-colors text-gray-400 dark:text-gray-400">
                        <UserPlus size={32} />
                    </div>
                    <span className="font-semibold text-gray-400 group-hover:text-white">Add New Contact</span>
                </button>
            </div>
        </div>
    );
};

export default Contacts;
