import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom' // 👈 Navigate add kiya
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ForgotPassword from './components/auth/ForgotPassword'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'

import InteractiveBackground from './components/shared/InteractiveBackground'
import PageTransition from './components/shared/PageTransition'

// 👈 Apna NotFound page yahan import karein (agar pages folder me banaya hai toh path check kar lein)
import NotFound from './components/NotFound'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <PageTransition><Home /></PageTransition>
  },
  {
    path: '/login',
    element: <PageTransition><Login /></PageTransition>
  },
  {
    path: '/signup',
    element: <PageTransition><Signup /></PageTransition>
  },
  {
    path: "/forgot-password",
    element: <PageTransition><ForgotPassword /></PageTransition>
  },
  {
    path: "/jobs",
    element: <PageTransition><Jobs /></PageTransition>
  },
  {
    path: "/description/:id",
    element: <PageTransition><JobDescription /></PageTransition>
  },
  {
    path: "/browse",
    element: <PageTransition><Browse /></PageTransition>
  },
  {
    path: "/profile",
    element: <PageTransition><Profile /></PageTransition>
  },
  // admin ke liye yha se start hoga
  {
    path: "/admin/companies",
    element: <ProtectedRoute><PageTransition><Companies /></PageTransition></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><PageTransition><CompanyCreate /></PageTransition></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><PageTransition><CompanySetup /></PageTransition></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><PageTransition><AdminJobs /></PageTransition></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PageTransition><PostJob /></PageTransition></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id",
    element: <ProtectedRoute><PageTransition><PostJob /></PageTransition></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><PageTransition><Applicants /></PageTransition></ProtectedRoute>
  },

  // 👇 NAYE ROUTES YAHAN ADD KIYE GAYE HAIN 👇

  // 1. Agar koi direct /admin likhega, toh wo automatically /admin/companies par chala jayega
  {
    path: "/admin",
    element: <Navigate to="/admin/companies" replace />
  },

  // 2. Catch-all route (404 Page). Agar upar me se koi URL match nahi hua, toh ye page dikhega
  {
    path: "*",
    element: <PageTransition><NotFound /></PageTransition>
  }
])

function App() {
  return (
    <div className='relative'>
      <InteractiveBackground />
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
