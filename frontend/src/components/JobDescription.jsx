import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate import kiya
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate(); // navigate hook ko initialize kiya

    const applyJobHandler = async () => {
        // 1. Agar user login nahi hai, toh turant rok do aur login page par bhejo
        if (!user) {
            toast.error("Please login to apply for this job.");
            navigate("/login");
            return;
        }

        // 2. Agar user login hai, toh apply API call karo
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...(singleJob?.applications || []), { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong while applying.");
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);


    // Loading State Check: Jab tak job fetch ho rahi hai, error na aaye
    if (!singleJob) {
        return (
            <div>
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500 text-lg font-semibold animate-pulse">Loading job details...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8'>
                    <div>
                        <h1 className='font-bold text-xl sm:text-2xl text-gray-900'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-2 mt-4 flex-wrap'>
                            {/* 1. Positions: Light Blue Text on Dark Box */}
                            <Badge className={'text-white bg-purple-800 border border-white-700 font-bold'} variant="ghost">
                                {singleJob?.position} Positions
                            </Badge>

                            {/* 2. Job Type: Light Red Text on Dark Box */}
                            <Badge className={'text-white bg-purple-800 border border-white-700 font-bold'} variant="ghost">
                                {singleJob?.jobType}
                            </Badge>

                            {/* 3. Salary: Theme Yellow Text on Dark Box */}
                            <Badge className={'text-white bg-purple-800 border border-white-700 font-bold cursor-default whitespace-normal'} variant="ghost">
                                {singleJob?.salary}
                            </Badge>
                        </div>
                    </div>

                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        // Change: Purple colors hata diye, Yellow theme add kiya (As per your previous comments)
                        className={`rounded-lg py-3 px-6 ${isApplied
                            ? 'bg-gray-400 cursor-not-allowed text-white shadow-none'
                            : 'bg-primary hover:bg-violet-700 text-white font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1'
                            }`}>
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                <div className='bg-white p-6 sm:p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-purple-100'>
                    <h1 className='border-b-2 border-b-purple-100 font-bold text-lg text-gray-900 pb-4 mb-6'>Job Description</h1>

                    <div className='flex flex-col gap-4 text-sm sm:text-base break-words'>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4'>
                            <span className='font-bold text-gray-900'>Role:</span>
                            <span className='sm:col-span-2 font-medium text-gray-700 bg-purple-50/50 p-3 rounded-xl border border-purple-50 break-words'>{singleJob?.title}</span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4'>
                            <span className='font-bold text-gray-900'>Location:</span>
                            <span className='sm:col-span-2 font-medium text-gray-700 bg-purple-50/50 p-3 rounded-xl border border-purple-50 break-words'>{singleJob?.location}</span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4'>
                            <span className='font-bold text-gray-900'>Description:</span>
                            <span className='sm:col-span-2 font-medium text-gray-700 bg-purple-50/50 p-3 rounded-xl border border-purple-50 break-words leading-relaxed'>{singleJob?.description}</span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4'>
                            <span className='font-bold text-gray-900'>Experience:</span>
                            <span className='sm:col-span-2 font-medium text-gray-700 bg-purple-50/50 p-3 rounded-xl border border-purple-50'>{singleJob?.experienceLevel}</span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4'>
                            <span className='font-bold text-gray-900'>Salary:</span>
                            <span className='sm:col-span-2 font-medium text-gray-700 bg-purple-50/50 p-3 rounded-xl border border-purple-50'>{singleJob?.salary}</span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4'>
                            <span className='font-bold text-gray-900'>Total Applicants:</span>
                            <span className='sm:col-span-2 font-medium text-gray-700 bg-purple-50/50 p-3 rounded-xl border border-purple-50'>{singleJob?.applications?.length || 0}</span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4'>
                            <span className='font-bold text-gray-900'>Posted Date:</span>
                            <span className='sm:col-span-2 font-medium text-gray-700 bg-purple-50/50 p-3 rounded-xl border border-purple-50'>{singleJob?.createdAt?.split("T")[0] || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription