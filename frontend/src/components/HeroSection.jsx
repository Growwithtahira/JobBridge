import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        // 1. Background Black kar diya
        <div className='text-center bg-black py-20 px-4 min-h-[60vh] flex flex-col justify-center'>
            <div className='flex flex-col gap-6 my-5 max-w-5xl mx-auto'>
                
                {/* 2. Badge: Dark background with Yellow text */}
                <div className='flex justify-center'>
                    <span className='px-5 py-2 rounded-full bg-gray-900 text-yellow-400 font-semibold text-sm border border-gray-800 shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-default'>
                        ⚡ No. 1 Platform for Freshers
                    </span>
                </div>

                {/* 3. Heading: White Text + Yellow Highlight */}
                <h1 className='text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight'>
                    Find the Best Jobs <br /> 
                    Near You & <span className='text-yellow-400'>Work Local</span>
                </h1>

                {/* 4. Subtitle: Light Gray for readability on Black */}
                <p className='text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed'>
                    Bridging the gap between Campus and Corporate. Connect with top companies in your city and kickstart your career without leaving your home town.
                </p>

                {/* 5. Search Bar: Dark Gray Box + Yellow Button */}
                <div className='flex w-full md:w-[60%] lg:w-[50%] shadow-[0_0_15px_rgba(250,204,21,0.2)] border border-gray-800 pl-6 rounded-full items-center gap-4 mx-auto bg-gray-900 mt-6 p-2 transition-all duration-300 hover:border-yellow-400/50'>
                    <input
                        type="text"
                        placeholder='Search for "Developer", "Delivery", etc.'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full text-white text-lg font-medium bg-transparent placeholder-gray-500'
                    />
                    <Button onClick={searchJobHandler} className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 w-12 md:w-auto md:px-8 shadow-md transition-all">
                        <Search className='h-5 w-5 font-bold' />
                    </Button>
                </div>
                
                {/* 6. Trusted By Text */}
                <p className='text-sm text-gray-500 mt-6 font-medium'>
                    Trusted by <span className='text-yellow-400'>100+ Companies</span> in Bareilly
                </p>
            </div>
        </div>
    )
}

export default HeroSection