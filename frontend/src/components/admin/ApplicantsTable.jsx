import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {
                    applicants && applicants?.applications?.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-indigo-500 rounded-l-xl"></div>
                            
                            <div className="pl-3 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{item?.applicant?.fullname}</h3>
                                        <p className="text-sm text-gray-500 font-medium">Applied: {item?.applicant?.createdAt?.split("T")[0]}</p>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2 shrink-0">
                                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2 rounded-xl shadow-lg border-gray-100 right-0">
                                            <p className="text-xs font-semibold text-gray-400 px-2 pb-1 uppercase tracking-wider mb-1 border-b border-gray-100">Update Status</p>
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    const isAccepted = status === "Accepted";
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} 
                                                             className={`flex w-full items-center p-2 rounded-lg cursor-pointer transition-colors ${isAccepted ? 'hover:bg-green-50 hover:text-green-700' : 'hover:bg-red-50 hover:text-red-700'}`}>
                                                            <span className="font-medium">{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid grid-cols-1 gap-1.5 mt-1 border-t border-gray-50 pt-3">
                                    <div className="flex flex-col text-sm text-gray-600">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</span>
                                        <span className="font-medium truncate">{item?.applicant?.email}</span>
                                    </div>
                                    <div className="flex flex-col text-sm text-gray-600 mt-1">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Contact</span>
                                        <span className="font-medium truncate">{item?.applicant?.phoneNumber}</span>
                                    </div>
                                    <div className="flex flex-col text-sm text-gray-600 mt-1">
                                         <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Resume</span>
                                         {
                                            item.applicant?.profile?.resume ? (
                                                <a className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition-all truncate flex items-center gap-1" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                    {item?.applicant?.profile?.resumeOriginalName}
                                                </a>
                                            ) : <span className="text-gray-400 italic">Not Provided</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {applicants?.applications?.length === 0 && <p className="text-center text-gray-500 py-4">No applicants yet.</p>}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto w-full">
                <Table className="w-full">
                    <TableCaption>A list of your recent applied users</TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-700">Full Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Email</TableHead>
                            <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                            <TableHead className="font-semibold text-gray-700">Resume</TableHead>
                            <TableHead className="font-semibold text-gray-700">Date</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            applicants && applicants?.applications?.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium text-gray-900">{item?.applicant?.fullname}</TableCell>
                                    <TableCell className="text-gray-600">{item?.applicant?.email}</TableCell>
                                    <TableCell className="text-gray-600">{item?.applicant?.phoneNumber}</TableCell>
                                    <TableCell >
                                        {
                                            item.applicant?.profile?.resume ? <a className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-1 w-fit" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                <span className="truncate max-w-[150px] inline-block align-bottom">{item?.applicant?.profile?.resumeOriginalName}</span>
                                            </a> : <span className="text-gray-400 italic">NA</span>
                                        }
                                    </TableCell>
                                    <TableCell className="text-gray-600">{item?.applicant?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex">
                                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 p-2 rounded-xl shadow-lg border-gray-100">
                                            <p className="text-xs font-semibold text-gray-400 px-2 pb-1 uppercase tracking-wider mb-1 border-b border-gray-100">Update Status</p>
                                                {
                                                    shortlistingStatus.map((status, index) => {
                                                        const isAccepted = status === "Accepted";
                                                        return (
                                                            <div onClick={() => statusHandler(status, item?._id)} key={index} className={`flex w-full items-center p-2 rounded-lg cursor-pointer transition-colors ${isAccepted ? 'hover:bg-green-50 hover:text-green-700' : 'hover:bg-red-50 hover:text-red-700'}`}>
                                                                <span className="font-medium">{status}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </tr>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ApplicantsTable