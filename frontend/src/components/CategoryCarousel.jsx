import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Delivery Partner",       // Swiggy/Zomato/Local delivery
    "Retail & Sales",         // Dukan/Showroom jobs
    "Office Admin",           // Receptionist/Computer Operator
    "Telecalling / BPO",      // Call center jobs
    "Hotel & Restaurant",     // Waiter/Chef/Manager
    "Home Tutor",             // Tuition padhana
    "Technician / Repair"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                                <Button onClick={() => searchJobHandler(cat)} variant="outline" className="rounded-full bg-white border-gray-200 text-gray-700 hover:scale-[1.02] transition-all duration-300 hover:bg-violet-600 hover:text-white hover:border-violet-600 hover:shadow-lg w-full h-auto py-3 text-xs sm:text-sm font-medium whitespace-normal leading-tight mx-1 flex-wrap break-words">{cat}</Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel