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
    // 1. State ko Object banaya hai taaki multiple selections hold ho sakein
    const [selectedFilters, setSelectedFilters] = useState({
        "Location": "",
        "Job Role": "",
        "Monthly Salary": ""
    });

    const dispatch = useDispatch();

    // 2. Specific category ki value update karne ke liye handler
    const changeHandler = (category, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: value
        }));
    }

    // 3. Clear all filters logic
    const clearFilters = () => {
        setSelectedFilters({
            "Location": "",
            "Job Role": "",
            "Monthly Salary": ""
        });
    }

    // 4. Jab bhi koi filter change ho, sabko combine karke Redux mein bhejo
    useEffect(() => {
        // Sirf wahi values pick kar rahe hain jo empty nahi hain
        const combinedQuery = Object.values(selectedFilters)
            .filter(val => val !== "")
            .join(" ");

        dispatch(setSearchedQuery(combinedQuery));
    }, [selectedFilters, dispatch]);

    return (
        <div className='w-full bg-white p-5 rounded-2xl shadow-lg border border-gray-100 md:sticky md:top-20'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl text-gray-900'>Filter Jobs</h1>
                <span
                    onClick={clearFilters}
                    className='text-xs text-primary font-medium cursor-pointer hover:underline hover:text-red-500 transition-colors'
                >
                    Clear All
                </span>
            </div>
            <hr className='my-4 border-gray-100' />

            {/* Filter Categories */}
            {
                filterData.map((data, index) => (
                    <div key={index} className='mb-6'>
                        <h1 className='font-bold text-lg text-gray-800 mb-3'>{data.filterType}</h1>

                        {/* 5. Har Category ka apna RadioGroup hai */}
                        <RadioGroup
                            value={selectedFilters[data.filterType]}
                            onValueChange={(value) => changeHandler(data.filterType, value)}
                        >
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div key={itemId} className='flex items-center space-x-3 my-2 group'>
                                            <RadioGroupItem
                                                value={item}
                                                id={itemId}
                                                className="text-primary border-gray-300 data-[state=checked]:border-primary data-[state=checked]:text-primary"
                                            />
                                            <Label
                                                htmlFor={itemId}
                                                className='text-gray-600 group-hover:text-primary cursor-pointer transition-colors text-sm font-medium'
                                            >
                                                {item}
                                            </Label>
                                        </div>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                ))
            }
        </div>
    )
}

export default FilterCard;