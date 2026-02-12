import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import api from '../../utils/api';
import { Mail, Loader, AlertCircle } from 'lucide-react';

const OTPInput = ({ onVerified, email }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/verify-otp', { email, otp: otp.join('') });
            onVerified();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email });
            setResendTimer(60);
            setError('');
            alert('Code resent successfully!');
        } catch (err) {
            setError('Failed to resend code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <Mail className="text-blue-500" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">Email Verification</h3>
                <p className="text-gray-400 text-sm mt-2">
                    We sent a 6-digit code to <span className="text-neon-blue font-bold">{email}</span>
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2 rounded text-sm flex items-center justify-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-10 h-12 md:w-12 md:h-14 rounded-lg bg-black/40 border border-white/10 text-center text-xl font-bold text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                    />
                ))}
            </div>

            <Button
                variant="primary"
                className="w-full justify-center shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                onClick={handleVerify}
                disabled={otp.join('').length !== 6 || loading}
            >
                {loading ? (
                    <><Loader className="animate-spin" size={18} /> Verifying...</>
                ) : (
                    'Verify Code'
                )}
            </Button>

            <p
                onClick={handleResend}
                className={`text-center text-xs transition-colors cursor-pointer ${resendTimer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
            >
                {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
            </p>
        </div>
    );
};

export default OTPInput;
