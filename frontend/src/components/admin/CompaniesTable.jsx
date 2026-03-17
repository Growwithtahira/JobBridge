import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    useEffect(()=>{
        const filteredCompany = companies.length >= 0 && companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])
    return (
        <div>
            {/* Mobile Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {
                    filterCompany?.map((company) => (
                        <div key={company._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border border-gray-100 shadow-sm">
                                        <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
                                        <p className="text-gray-500 text-sm font-medium">Registered: {company.createdAt.split("T")[0]}</p>
                                    </div>
                                </div>
                                <Popover>
                                    <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5 text-gray-500" /></PopoverTrigger>
                                    <PopoverContent className="w-36 p-2 rounded-xl shadow-lg border-gray-100">
                                        <div onClick={()=> navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-3 w-full p-2 hover:bg-violet-50 hover:text-violet-700 rounded-lg cursor-pointer transition-colors'>
                                            <Edit2 className='w-4 h-4' />
                                            <span className="font-medium">Edit</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    ))
                }
                {filterCompany?.length === 0 && <p className="text-center text-gray-500 py-4">No companies found.</p>}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableCaption>A list of your recent registered companies</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filterCompany?.map((company) => (
                                <tr key={company._id}>
                                    <TableCell>
                                        <Avatar className="w-10 h-10 border border-gray-100 shadow-sm">
                                            <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">{company.name}</TableCell>
                                    <TableCell className="text-gray-600">{company.createdAt.split("T")[0]}</TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5 text-gray-500" /></PopoverTrigger>
                                            <PopoverContent className="w-36 p-2 rounded-xl shadow-lg border-gray-100">
                                                <div onClick={()=> navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-3 w-full p-2 hover:bg-violet-50 hover:text-violet-700 rounded-lg cursor-pointer transition-colors'>
                                                    <Edit2 className='w-4 h-4' />
                                                    <span className="font-medium">Edit</span>
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

export default CompaniesTable