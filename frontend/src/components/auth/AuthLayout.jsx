import React from 'react';
import Skyline from './Skyline';

const AuthLayout = ({ children, activeField }) => {
    return (
        <div className="min-h-screen w-full flex bg-white overflow-hidden">
            {/* Left Side - Visuals (Hidden on small mobile, visible on lg) */}
            <div className="hidden lg:block w-1/2 relative bg-indigo-950 overflow-hidden">
                <Skyline activeField={activeField} />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-3/4 z-50">
                    <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">JobBridge</h1>
                    <p className="text-indigo-200 text-lg">
                        Connecting talent with opportunity. <br />
                        Your future starts here.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-white relative">
                {/* Mobile Skyline hint (optional background) */}
                <div className="absolute inset-0 lg:hidden opacity-10 pointer-events-none">
                    <Skyline activeField={activeField} />
                </div>

                <div className="w-full max-w-md z-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
