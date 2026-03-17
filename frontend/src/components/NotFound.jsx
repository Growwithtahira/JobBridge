import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-white text-center px-4'>
            <h1 className='text-7xl font-bold text-primary mb-4'>404</h1>
            <h2 className='text-3xl font-semibold text-gray-800 mb-4'>Page Not Found</h2>
            <p className='text-gray-500 mb-8 max-w-md'>
                It looks like you've taken a wrong turn. The page you are looking for doesn't exist or has been moved. Let's get you back on track.            </p>
            <Link to="/">
                <button className="bg-primary hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                    Go Back Home
                </button>
            </Link>
        </div>
    )
}

export default NotFound