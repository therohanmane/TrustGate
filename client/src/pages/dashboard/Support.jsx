import React from 'react';
import Card from '../../components/ui/Card';
import { Phone, Mail, HelpCircle, MessageCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const Support = () => {
    return (
        <div className="max-w-4xl space-y-8 animate-fade-in text-gray-900 dark:text-white">
            <div>
                <h2 className="text-3xl font-bold mb-2">Help & Support</h2>
                <p className="text-gray-500 dark:text-gray-400">Get assistance with your vault or report issues.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Card 1 */}
                <Card className="bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 p-6 flex flex-col items-center text-center hover:border-neon-blue/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-neon-blue/10 flex items-center justify-center mb-4 text-blue-600 dark:text-neon-blue">
                        <Phone size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Rohan Sandeep Mane</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Technical Support Lead</p>

                    <div className="space-y-3 w-full">
                        <div className="flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-black/20 rounded-lg">
                            <Phone size={16} className="text-gray-400" />
                            <span className="font-mono">7841910823</span>
                        </div>
                        <a href="mailto:rohanmane0823@gmail.com" className="flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-black/20 rounded-lg hover:bg-blue-50 dark:hover:bg-neon-blue/10 transition-colors">
                            <Mail size={16} className="text-gray-400" />
                            <span className="font-medium">rohanmane0823@gmail.com</span>
                        </a>
                    </div>
                </Card>

                {/* Contact Card 2 */}
                <Card className="bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 p-6 flex flex-col items-center text-center hover:border-neon-purple/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-neon-purple/10 flex items-center justify-center mb-4 text-purple-600 dark:text-neon-purple">
                        <MessageCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Anuja Chandrakant Wadnere</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Customer Success</p>

                    <div className="space-y-3 w-full">
                        <div className="flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-black/20 rounded-lg">
                            <Phone size={16} className="text-gray-400" />
                            <span className="font-mono">8956805564</span>
                        </div>
                        <a href="mailto:anujawadnere@gmail.com" className="flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-black/20 rounded-lg hover:bg-purple-50 dark:hover:bg-neon-purple/10 transition-colors">
                            <Mail size={16} className="text-gray-400" />
                            <span className="font-medium">anujawadnere@gmail.com</span>
                        </a>
                    </div>
                </Card>
            </div>

            {/* FAQ Section */}
            <Card className="bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <HelpCircle className="text-neon-green" /> Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">How do I verify my identity?</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Go to Settings and complete the Aadhaar verification process. This is required to activate your vault.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Can I change my beneficiaries later?</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Yes, you can add or remove Trusted Contacts at any time from the Contacts page.</p>
                    </div>
                </div>
            </Card>

            <div className="text-center pt-8">
                <a href="https://wa.me/917841910823" target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="shadow-[0_0_20px_rgba(0,229,255,0.3)] gap-2">
                        <MessageCircle size={20} /> Start Live Chat
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default Support;
