import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{ 
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])
    return (
        <div>
            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {
                    filterJobs?.map((job) => (
                        <div key={job._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{job?.company?.name}</h3>
                                    <p className="text-gray-600 font-medium">{job?.title}</p>
                                </div>
                                <Popover>
                                    <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5 text-gray-500" /></PopoverTrigger>
                                    <PopoverContent className="w-36 p-2 rounded-xl shadow-lg border-gray-100">
                                        <div onClick={()=> navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-3 w-full p-2 hover:bg-violet-50 hover:text-violet-700 rounded-lg cursor-pointer transition-colors'>
                                            <Edit2 className='w-4 h-4' />
                                            <span className="font-medium">Edit</span>
                                        </div>
                                        <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-full gap-3 p-2 hover:bg-violet-50 hover:text-violet-700 rounded-lg cursor-pointer transition-colors mt-1'>
                                            <Eye className='w-4 h-4'/>
                                            <span className="font-medium">Applicants</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="font-medium">Date: </span>
                                <span className="ml-2">{job?.createdAt.split("T")[0]}</span>
                            </div>
                        </div>
                    ))
                }
                {filterJobs?.length === 0 && <p className="text-center text-gray-500 py-4">No jobs found.</p>}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableCaption>A list of your recent posted jobs</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filterJobs?.map((job) => (
                                <tr key={job._id}>
                                    <TableCell>{job?.company?.name}</TableCell>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5 text-gray-500" /></PopoverTrigger>
                                            <PopoverContent className="w-36 p-2 rounded-xl shadow-lg border-gray-100">
                                                <div onClick={()=> navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-3 w-full p-2 hover:bg-violet-50 hover:text-violet-700 rounded-lg cursor-pointer transition-colors'>
                                                    <Edit2 className='w-4 h-4' />
                                                    <span className="font-medium">Edit</span>
                                                </div>
                                                <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-full gap-3 p-2 hover:bg-violet-50 hover:text-violet-700 rounded-lg cursor-pointer transition-colors mt-1'>
                                                    <Eye className='w-4 h-4'/>
                                                    <span className="font-medium">Applicants</span>
                                                </div>
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

export default AdminJobsTable