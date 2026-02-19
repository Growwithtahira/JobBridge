import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50'>
      <Navbar />
      <div className='max-w-6xl mx-auto py-10 px-4'>
        <div className='flex items-center justify-between mb-8'>
          <Input
            className="w-full max-w-sm bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl shadow-sm"
            placeholder="Filter jobs by name or role..."
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all"
          >
            Post New Job
          </Button>
        </div>
        <div className='bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden p-6'>
          <AdminJobsTable />
        </div>
      </div>
    </div>
  )
}

export default AdminJobs