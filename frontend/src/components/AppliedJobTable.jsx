import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    return (
        <div>
            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden pb-4">
                {
                    allAppliedJobs.length <= 0 ? <span className="text-gray-500">You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                        <div key={appliedJob._id} className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-md flex flex-col gap-3 relative overflow-hidden">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{appliedJob.job?.title}</h3>
                                    <p className="text-sm text-gray-600 font-medium mt-1">{appliedJob.job?.company?.name}</p>
                                </div>
                                <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-100 text-red-600 border-red-200' : appliedJob.status === 'pending' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-100 text-green-600 border-green-200'} border shrink-0`} variant="outline">
                                    {appliedJob.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 font-medium mt-1">
                                <span className="uppercase tracking-wider">Applied On:</span>
                                <span className="ml-2">{appliedJob?.createdAt?.split("T")[0]}</span>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto w-full">
                <Table>
                    <TableCaption>A list of your applied jobs</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Job Role</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                                <TableRow key={appliedJob._id}>
                                    <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell>{appliedJob.job?.title}</TableCell>
                                    <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                    <TableCell className="text-right"><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-100 text-red-600 border-red-200' : appliedJob.status === 'pending' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-100 text-green-600 border-green-200'} border`} variant="outline">{appliedJob.status.toUpperCase()}</Badge></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default AppliedJobTable