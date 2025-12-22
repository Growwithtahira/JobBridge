import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: [
            "Remote/Hybrid",
            "Civil Lines",
            "D.D. Puram",
            "Rajendra Nagar",
            "Kutubkhana / Market",
            "Parsakhera (Ind.)",
            "Bareilly Cantt"
        ]
    },
    {
        filterType: "Job Role",
        array: [
            "Data Entry / Office",
            "Delivery / Field",
            "Teaching / Tutor",
            "Web Dev / IT",
            "Social Media / Design",
            "Hotel / Reception",
            "Technician / Repair"
        ]
    },
    {
        filterType: "Monthly Salary",
        array: [
            "0 - 10k (Intern/Part-time)",
            "10k - 25k (Entry Level)",
            "25k+ (Experienced)"
        ]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
    // bg-white ki jagah bg-[#111827] (Dark Gray)
    <div className='w-full bg-[#111827] p-5 rounded-xl shadow-lg border border-gray-800 sticky top-20'>
        <div className='flex items-center justify-between'>
            <h1 className='font-bold text-xl text-white'>Filter Jobs</h1>
            <span className='text-xs text-primary cursor-pointer hover:underline'>Clear</span>
        </div>
        <hr className='my-4 border-gray-700' />
        
        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
            {
                filterData.map((data, index) => (
                    <div key={index} className='mb-6'>
                        <h1 className='font-semibold text-md text-gray-300 mb-3'>{data.filterType}</h1>
                        {
                            data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`
                                return (
                                    <div key={itemId} className='flex items-center space-x-3 my-2 group'>
                                        {/* Radio Button Yellow */}
                                        <RadioGroupItem value={item} id={itemId} className="text-primary border-gray-500" />
                                        <Label htmlFor={itemId} className='text-gray-400 group-hover:text-primary cursor-pointer transition-colors text-sm'>
                                            {item}
                                        </Label>
                                    </div>
                                )
                            })
                        }
                    </div>
                ))
            }
        </RadioGroup>
    </div>
)
}

export default FilterCard