import React from 'react';

const InteractiveBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full bg-white overflow-hidden">

            {/* 1. Professional Grid Pattern Overlay */}
            {/* Uses a tiny SVG background pattern for that "Tech/Engineering" feel */}
            <div className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(107 114 128 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
                }}>
            </div>

            {/* 2. Soft Gradient Orbs (Mesh Gradient Effect) */}
            {/* Slow moving, large blur blobs to create depth without clutter */}
            <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">

                {/* Orb 1: Primary Violet (Top Left) */}
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-200/50 rounded-full blur-[120px] animate-blob mix-blend-multiply filter"></div>

                {/* Orb 2: Tech Blue (Top Right) */}
                <div className="absolute top-[0%] -right-[10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply filter"></div>

                {/* Orb 3: Soft Pink (Bottom Left) */}
                <div className="absolute -bottom-[20%] -left-[20%] w-[60%] h-[60%] bg-pink-200/40 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply filter"></div>

                {/* Orb 4: Indigo Accent (Center/Moving) */}
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-300/30 rounded-full blur-[100px] animate-float mix-blend-multiply filter"></div>

            </div>

            {/* 3. Radial Vignette for Focus */}
            {/* Keeps the center content clear and fades out the edges slightly */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/60 pointer-events-none"></div>
        </div>
    );
};

export default InteractiveBackground;
