import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import HowItWorks from './HowItWorks'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ScrollReveal from './shared/ScrollReveal'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <HeroSection />
      
      <HowItWorks />

      <ScrollReveal>
        <CategoryCarousel />
      </ScrollReveal>

      <ScrollReveal>
        <LatestJobs />
      </ScrollReveal>

      <Footer />
    </div>
  )
}

export default Home