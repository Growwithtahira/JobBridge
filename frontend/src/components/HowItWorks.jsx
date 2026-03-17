import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, FileText, Search, Send, TrendingUp,
  Building, Briefcase, Users, Calendar, Award
} from 'lucide-react';

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('students'); // 'students' or 'recruiters'

    const studentSteps = [
        {
            icon: <UserPlus className="w-6 h-6 text-white" />,
            title: "Create Account",
            desc: "Sign up for free using your email.",
            bgColor: "bg-blue-400",
            shadowColor: "shadow-blue-200"
        },
        {
            icon: <FileText className="w-6 h-6 text-white" />,
            title: "Build Profile",
            desc: "Add your skills and upload resume.",
            bgColor: "bg-pink-400",
            shadowColor: "shadow-pink-200"
        },
        {
            icon: <Search className="w-6 h-6 text-white" />,
            title: "Browse Jobs",
            desc: "Explore listings in Bareilly.",
            bgColor: "bg-green-500",
            shadowColor: "shadow-green-200"
        },
        {
            icon: <Send className="w-6 h-6 text-white" />,
            title: "Apply Now",
            desc: "Submit applications with one click.",
            bgColor: "bg-orange-400",
            shadowColor: "shadow-orange-200"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-white" />,
            title: "Track Progress",
            desc: "Monitor status and get hired.",
            bgColor: "bg-purple-500",
            shadowColor: "shadow-purple-200"
        }
    ];

    const recruiterSteps = [
        {
            icon: <Building className="w-6 h-6 text-white" />,
            title: "Register",
            desc: "Verify your business profile.",
            bgColor: "bg-orange-400",
            shadowColor: "shadow-orange-200"
        },
        {
            icon: <Briefcase className="w-6 h-6 text-white" />,
            title: "Post a Job",
            desc: "Create detailed job listings.",
            bgColor: "bg-pink-400",
            shadowColor: "shadow-pink-200"
        },
        {
            icon: <Users className="w-6 h-6 text-white" />,
            title: "Review",
            desc: "Browse qualified candidates.",
            bgColor: "bg-blue-400",
            shadowColor: "shadow-blue-200"
        },
        {
            icon: <Calendar className="w-6 h-6 text-white" />,
            title: "Interview",
            desc: "Schedule with top talent.",
            bgColor: "bg-purple-400",
            shadowColor: "shadow-purple-200"
        },
        {
            icon: <Award className="w-6 h-6 text-white" />,
            title: "Hire",
            desc: "Select the best candidate.",
            bgColor: "bg-green-500",
            shadowColor: "shadow-green-200"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const currentSteps = activeTab === 'students' ? studentSteps : recruiterSteps;

    return (
        <section className="py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-[#6A38C2] mb-4"
                    >
                        How It Works
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-lg mb-8"
                    >
                        {activeTab === 'students' ? 'Find your dream job in minutes.' : 'Hire the best talent in minutes.'}
                    </motion.p>

                    {/* Toggle Switch */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center items-center bg-white p-1 rounded-full sm:rounded-full w-fit mx-auto shadow-sm border border-gray-100 gap-2 sm:gap-0"
                    >
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'students' 
                                    ? 'bg-[#6A38C2] text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            For Students
                        </button>
                        <button
                            onClick={() => setActiveTab('recruiters')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'recruiters' 
                                    ? 'bg-[#6A38C2] text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            For Recruiters
                        </button>
                    </motion.div>
                </div>

                {/* Steps Grid */}
                <motion.div 
                    key={activeTab} // Retrigger animation on tab change
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                >
                    {currentSteps.map((step, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-[0_8px_30px_-4px_rgba(106,56,194,0.1)] transition-shadow duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg ${step.bgColor} ${step.shadowColor}`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default HowItWorks;
