import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import our Axios instance
import Navbar from '../components/Navbar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StepWizard from '../components/auth/StepWizard';
import AadhaarVerification from '../components/auth/AadhaarVerification';
import OTPInput from '../components/auth/OTPInput';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Phone, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on change
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const handleSignup = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.mobile
            });

            // Save token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.data._id,
                name: response.data.name,
                email: response.data.email
            }));

            // Redirect to dashboard
            // navigate('/dashboard');
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBasicInfoSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/send-otp', { email: formData.email });
            nextStep();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: "Basic Info",
            component: (
                <div className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    <Input icon={User} placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input icon={Mail} placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                    <Input icon={Phone} placeholder="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required />
                    <Button variant="primary" className="w-full justify-center mt-4" onClick={handleBasicInfoSubmit} disabled={!formData.name || !formData.email || !formData.mobile || loading}>
                        {loading ? <Loader className="animate-spin" size={18} /> : <>Next Step <ArrowRight size={18} /></>}
                    </Button>
                </div>
            )
        },
        {
            title: "Verification",
            component: (
                <OTPInput email={formData.email} onVerified={nextStep} />
            )
        },
        {
            title: "Identity Check",
            component: (
                <AadhaarVerification onVerified={nextStep} />
            )
        },
        {
            title: "Secure Access",
            component: (
                <div className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    <Input icon={Lock} placeholder="Create Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    <Input icon={Lock} placeholder="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />

                    <div className="text-xs text-gray-500 mt-2">
                        Password Strength: <span className="text-green-500 font-bold">Strong</span>
                        <div className="h-1 w-full bg-gray-800 rounded-full mt-1 overflow-hidden">
                            <div className="h-full w-3/4 bg-green-500 rounded-full" />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Button variant="secondary" onClick={prevStep} className="flex-1 justify-center" disabled={loading}>
                            Back
                        </Button>
                        <Button variant="primary" className="flex-1 justify-center" onClick={handleSignup} disabled={!formData.password || loading}>
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Create Vault'}
                        </Button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center overflow-hidden px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[30%] w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[150px] opacity-30" />
                <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-neon-blue/5 rounded-full blur-[120px] opacity-30" />
            </div>

            <Navbar />

            <div className="w-full max-w-lg z-10 mt-24 mb-10">
                <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Create Secure Vault
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm">Follow the steps to secure your digital legacy</p>
                    </div>

                    <StepWizard steps={steps} currentStep={currentStep} />

                    <p className="mt-8 text-center text-gray-500 text-sm">
                        Already have an account? <Link to="/login" className="text-neon-blue hover:underline font-semibold">Log in</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
