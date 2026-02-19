import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Skyline = ({ activeField }) => {
    const [windows, setWindows] = useState(Array(15).fill(false));

    // Dynamic Window Lights
    useEffect(() => {
        const interval = setInterval(() => {
            setWindows(prev => prev.map(() => Math.random() > 0.6)); // More lights active
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#1e1b4b] via-[#2e1065] to-[#4c1d95] flex flex-col justify-end">

            {/* --- ATMOSPHERE --- */}

            {/* Twinkling Stars */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                            top: `${Math.random() * 60}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.7
                        }}
                        animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* Shooting Star */}
            <motion.div
                className="absolute top-10 left-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
                initial={{ x: -100, y: -100, opacity: 0 }}
                animate={{ x: 800, y: 300, opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeIn" }}
                style={{ rotate: '20deg' }}
            />

            {/* Moon / Glow */}
            <motion.div
                className="absolute top-16 right-16 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-40"
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.5, 0.4] }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Moving Clouds */}
            <div className="absolute top-20 left-0 w-full h-full pointer-events-none opacity-20">
                <motion.div
                    className="absolute top-10 w-96 h-24 bg-purple-400 blur-3xl rounded-full"
                    animate={{ x: [-200, 800] }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-32 w-80 h-20 bg-indigo-400 blur-3xl rounded-full"
                    animate={{ x: [-300, 900] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear", delay: 5 }}
                />
            </div>

            {/* --- BUILDINGS --- */}

            {/* Back Layer (Silhouette) */}
            <div className="absolute bottom-0 w-full flex items-end justify-center opacity-40 scale-95 origin-bottom">
                <div className="w-24 h-56 bg-[#170F38] mx-1 rounded-t-lg"></div>
                <div className="w-32 h-80 bg-[#170F38] mx-2 rounded-t-xl"></div>
                <div className="w-20 h-48 bg-[#170F38] mx-1 rounded-t-md"></div>
                <div className="w-28 h-64 bg-[#170F38] mx-1 rounded-t-lg"></div>
            </div>

            {/* Front Layer (Main) */}
            <div className="relative bottom-0 w-full flex items-end justify-center px-8 space-x-2 z-10">

                {/* Building 1 */}
                <div className="w-24 h-72 bg-[#2E1065] rounded-t-lg relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                    <div className="grid grid-cols-3 gap-2 p-3 mt-6">
                        {[...Array(9)].map((_, i) => (
                            <motion.div
                                key={`b1-${i}`}
                                className="w-full h-3 bg-yellow-100"
                                animate={{ opacity: windows[i] ? 0.8 : 0.1 }}
                                transition={{ duration: 0.5 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Building 2 (Tall Tower) */}
                <div className="w-32 h-96 bg-[#3B0764] rounded-t-xl relative overflow-hidden ring-1 ring-white/10 shadow-2xl z-20">
                    {/* Antenna */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-12 bg-white/30">
                        <motion.div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 -left-0.5" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                    </div>

                    {/* Windows */}
                    <div className="flex flex-col space-y-3 p-4 mt-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={`b2-row-${i}`} className="flex space-x-2">
                                <motion.div className="w-full h-2 bg-yellow-100" animate={{ opacity: windows[i + 5] ? 0.9 : 0.15 }} />
                                <motion.div className="w-full h-2 bg-yellow-100" animate={{ opacity: windows[(i + 2) % 10] ? 0.9 : 0.15 }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Building 3 */}
                <div className="w-20 h-60 bg-[#2E1065] rounded-t-lg relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                    <div className="grid grid-cols-2 gap-2 p-3 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={`b3-${i}`}
                                className="w-full h-4 bg-yellow-100"
                                animate={{ opacity: windows[i + 2] ? 0.8 : 0.1 }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Foreground Fog */}
            <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#1e1b4b] via-[#2e1065]/50 to-transparent z-30 pointer-events-none"></div>
        </div>
    );
};

export default Skyline;
