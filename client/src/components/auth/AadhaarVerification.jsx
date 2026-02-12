import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { CreditCard, ShieldCheck, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const AadhaarVerification = ({ onVerified }) => {
    const [aadhaar, setAadhaar] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleVerify = () => {
        if (aadhaar.length === 12) {
            setVerifying(true);
            setTimeout(() => {
                setVerifying(false);
                setVerified(true);
                onVerified();
            }, 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" alt="Aadhaar" className="w-10 opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-white">Identity Verification</h3>
                <p className="text-gray-400 text-sm mt-2">To ensure the integrity of the TrustGate vault, we need to verify your identity.</p>
            </div>

            {!verified ? (
                <div className="space-y-4">
                    <div>
                        <Input
                            icon={CreditCard}
                            placeholder="Enter 12-digit Aadhaar Number"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                            className="tracking-widest text-center text-lg"
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">We do not store your Aadhaar number. Used for one-time verification only.</p>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full justify-center"
                        onClick={handleVerify}
                        disabled={aadhaar.length !== 12 || verifying}
                    >
                        {verifying ? (
                            <>
                                <Loader className="animate-spin" size={18} /> Verifying with UIDAI...
                            </>
                        ) : (
                            'Verify Identity'
                        )}
                    </Button>
                </div>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center"
                >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShieldCheck className="text-black" size={24} />
                    </div>
                    <h4 className="text-green-500 font-bold text-lg">Identity Verified</h4>
                    <p className="text-gray-400 text-sm mt-1">Aadhaar: XXXX-XXXX-{aadhaar.slice(-4)}</p>
                </motion.div>
            )}
        </div>
    );
};

export default AadhaarVerification;
