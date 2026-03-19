import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThreeBackground from './ThreeBackground';
import { toast } from 'sonner'; // Ensure 'sonner' or 'react-hot-toast' is installed

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Updated Handler with Pop-up logic
    const searchJobHandler = () => {
        // Agar user ne kuch nahi likha ya sirf spaces diye hain
        if (!query.trim()) {
            return toast.error("Please enter a job title or keyword!");
            // Agar toast nahi chal raha toh use: alert("Please enter a keyword")
        }

        // Agar query valid hai tabhi dispatch aur navigate hoga
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    // Enter Key Press Handler
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    }

    // Typewriter Variants
    const letterVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    const sentenceVariant = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5,
                staggerChildren: 0.03
            }
        }
    };

    const titleText = "Find the Best Jobs";

    return (
        <div className='relative text-center py-20 px-4 min-h-[80vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-white via-violet-50 to-white'>

            <ThreeBackground />

            {/* Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className='hidden md:block absolute top-20 left-10 p-4 glass rounded-2xl opacity-90 z-20'
            >
                <p className='text-sm font-bold text-gray-700'>✨ 1k+ Jobs Added Daily</p>
            </motion.div>

            <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className='hidden md:block absolute bottom-20 right-10 p-4 glass rounded-2xl opacity-90 z-20'
            >
                <p className='text-sm font-bold text-gray-700'>🚀 500+ Top Recruiters</p>
            </motion.div>

            <div className='flex flex-col gap-8 my-5 max-w-5xl mx-auto relative z-10'>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex justify-center'>
                    <span className='px-6 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-100 text-primary font-bold text-sm shadow-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-default tracking-wide'>
                        <span className='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
                        No. 1 Platform for Freshers
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2D2D2D] leading-tight tracking-tight'
                    variants={sentenceVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {titleText.split("").map((char, index) => (
                        <motion.span key={index} variants={letterVariant}>
                            {char}
                        </motion.span>
                    ))}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-1.5 h-8 md:h-12 lg:h-16 bg-[#6A38C2] ml-1 align-middle mb-2 rounded-sm"
                    />
                    <br />
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className='text-gradient drop-shadow-sm'
                    >
                        Near You & <span className='text-primary'>Work Local</span>
                    </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className='text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium bg-white/30 backdrop-blur-sm p-4 rounded-xl'
                >
                    Bridging the gap between Campus and Corporate. Connect with top companies in your city and kickstart your career.
                </motion.p>

                {/* Search Bar - Fixed Logic */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className='flex flex-col sm:flex-row w-full md:w-[60%] lg:w-[50%] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 px-4 sm:pl-6 sm:pr-2 py-2 rounded-3xl sm:rounded-full items-center gap-4 mx-auto bg-white mt-6 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(106,13,173,0.15)] hover:border-purple-200 group relative overflow-hidden'
                >
                    <input
                        type="text"
                        placeholder='Search for "Developer", "Designer", etc.'
                        value={query} // Linked state
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown} // Trigger on Enter
                        className='outline-none border-none w-full text-center sm:text-left text-gray-800 text-base sm:text-lg font-medium bg-transparent placeholder-gray-400 z-10 py-2 sm:py-0'
                    />
                    <Button
                        onClick={searchJobHandler}
                        className="w-full sm:w-auto rounded-full bg-primary hover:bg-violet-700 text-white font-bold h-12 md:px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all z-10 flex items-center justify-center gap-2"
                    >
                        <Search className='h-5 w-5 font-bold' />
                        <span className='sm:hidden'>Search</span>
                    </Button>
                </motion.div>

                {/* Trusted By */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className='text-sm text-gray-400 mt-6 font-semibold tracking-wide'>
                    Trusted by <span className='text-primary font-bold'>100+ Companies</span> in Bareilly
                </motion.p>
            </div>
        </div>
    )
}

export default HeroSection;