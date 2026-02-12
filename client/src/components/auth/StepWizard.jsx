import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StepWizard = ({ steps, currentStep }) => {
    return (
        <div className="w-full">
            {/* Step Indicators */}
            <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-800 -z-10" />
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isActive ? '#00E5FF' : isCompleted ? '#00E676' : '#111827',
                                    borderColor: isActive ? '#00E5FF' : isCompleted ? '#00E676' : '#374151',
                                }}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${isActive || isCompleted ? 'text-black' : 'text-gray-500'}`}
                            >
                                {isCompleted ? '✓' : index + 1}
                            </motion.div>
                            <span className={`text-xs ${isActive ? 'text-neon-blue' : 'text-gray-500'}`}>{step.title}</span>
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="relative overflow-hidden min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {steps[currentStep].component}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StepWizard;
