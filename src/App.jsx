import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPhone, FiPlayCircle, FiMessageSquare,
  FiCamera, FiVideo, FiEdit3, FiUser,
  FiMail, FiMapPin, FiFacebook, FiInstagram, FiYoutube
} from 'react-icons/fi';

const logo = "/logo.png";
const bannerImage = "/banner1.png";

import Navbar from './Pages/Navber/Navber';
import Banner from './Pages/Banner/Banner';
import About from './Pages/About/About';
import Brands from './Pages/Brands/Brands';
import Footer from './Pages/Footer/Footer';

// Pages & Components
import Login from './Pages/Login/Login';
import DemoPage from './Pages/Demo/DemoPage';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboards
import AdminLayout from './Dashboard/Admin/AdminLayout';
import AdminOverview from './Dashboard/Admin/pages/AdminOverview';
import VideoManagement from './Dashboard/Admin/pages/VideoManagement';
import CategoryManagement from './Dashboard/Admin/pages/CategoryManagement';
import UserManagement from './Dashboard/Admin/pages/UserManagement';
import DemoLinksMonitor from './Dashboard/Admin/pages/DemoLinksMonitor';
import AdminUpload from './Dashboard/Admin/pages/AdminUpload';

import OrderSourceManagement from './Dashboard/Admin/pages/OrderSourceManagement';
import ServiceTypeManagement from './Dashboard/Admin/pages/ServiceTypeManagement';
import RoleManagement from './Dashboard/Admin/pages/RoleManagement';
import EditorLayout from './Dashboard/Editor/EditorLayout';
import UploadVideo from './Dashboard/Editor/pages/UploadVideo';
import MyUploads from './Dashboard/Editor/pages/MyUploads';
import EditorDashboard from './Dashboard/RoleViews/EditorDashboard';

import SalesLayout from './Dashboard/SalesExecutive/SalesLayout';
import BrowseVideos from './Dashboard/SalesExecutive/pages/BrowseVideos';
import MyDemoLinks from './Dashboard/SalesExecutive/pages/MyDemoLinks';

import PMLayout from './Dashboard/ProjectManager/PMLayout';
import PMDashboard from './Dashboard/RoleViews/PMDashboard';

import WriterLayout from './Dashboard/Writer/WriterLayout';
import WriterDashboard from './Dashboard/RoleViews/WriterDashboard';
import SalesBookingForm from './Dashboard/SalesExecutive/pages/SalesBookingForm';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/demo/:linkId" element={<DemoPage />} />

      {/* Admin Dashboard */}
      <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminOverview />} />

        <Route path="videos" element={<VideoManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="demo-links" element={<DemoLinksMonitor />} />
        <Route path="upload" element={<AdminUpload />} />
        <Route path="order-sources" element={<OrderSourceManagement />} />
        <Route path="service-types" element={<ServiceTypeManagement />} />
        <Route path="roles" element={<RoleManagement />} />
      </Route>

      {/* Editor Dashboard */}
      <Route path="/dashboard/editor" element={<ProtectedRoute allowedRoles={['editor', 'admin']}><EditorLayout /></ProtectedRoute>}>
        <Route index element={<UploadVideo />} />
        <Route path="queue" element={<EditorDashboard />} />
        <Route path="my-uploads" element={<MyUploads />} />
      </Route>

      {/* Sales Dashboard */}
      <Route path="/dashboard/sales" element={<ProtectedRoute allowedRoles={['sales', 'admin']}><SalesLayout /></ProtectedRoute>}>
        <Route index element={<BrowseVideos />} />
        <Route path="book-order" element={<SalesBookingForm />} />
        <Route path="demo-links" element={<MyDemoLinks />} />
      </Route>

      {/* Project Manager Dashboard */}
      <Route path="/dashboard/pm" element={<ProtectedRoute allowedRoles={['pm', 'admin']}><PMLayout /></ProtectedRoute>}>
        <Route index element={<PMDashboard />} />
      </Route>

      {/* Writer Dashboard */}
      <Route path="/dashboard/writer" element={<ProtectedRoute allowedRoles={['writer', 'admin']}><WriterLayout /></ProtectedRoute>}>
        <Route index element={<WriterDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar />
      <main>
        <Banner />
        <About />
        <Brands />
        <Services />
        <Team />
        <RecentWork />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}




function Services() {
  const services = [
    { id: 1, title: 'Script', icon: <FiEdit3 className="w-8 h-8" />, offset: 'mt-0' },
    { id: 2, title: 'Model', icon: <FiUser className="w-8 h-8" />, offset: 'mt-12' },
    { id: 3, title: 'Shoot', icon: <FiCamera className="w-8 h-8" />, offset: 'mt-0' },
    { id: 4, title: 'Editing', icon: <FiVideo className="w-8 h-8" />, offset: 'mt-12' },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-16">Our Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
        {/* Connecting Line (Decorative) */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500/20 -z-10 hidden md:block"></div>

        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-red-500/50 hover:bg-[#151515] transition-all duration-300 group ${service.offset}`}
          >
            <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            <h3 className="font-semibold text-lg">{service.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}



function Team() {
  return (
    <section className="py-20 px-4 relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Meet Our <span className="text-red-500">Expert Team</span></h2>

        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full bg-gray-800 mb-6 border-4 border-[#1a1a1a] shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <img src="https://ui-avatars.com/api/?name=Md+Fakhrul+Islam&background=random" alt="Founder" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold">Md Fakhrul Islam</h3>
          <p className="text-red-500 text-sm font-semibold mb-4">Founder & CEO</p>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            Helping brands dominate the digital space through cinematic storytelling, strategic video marketing, and high-impact visual experiences.
          </p>
        </div>
      </div>
    </section>
  );
}

function RecentWork() {
  const works = [
    { id: 1, type: 'Service Video', img: 'bg-gray-800' },
    { id: 2, type: 'Product Video', img: 'bg-gray-700' },
    { id: 3, type: 'Promotion Video', img: 'bg-gray-800' },
    { id: 4, type: 'Service Video', img: 'bg-gray-700' },
  ];

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Our Recent <span className="text-red-500">Work</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {works.map((work) => (
          <div key={work.id} className="group relative rounded-xl overflow-hidden cursor-pointer">
            <div className={`aspect-[9/16] w-full ${work.img} transition-transform duration-500 group-hover:scale-105`}>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 w-full p-4">
              <span className="bg-red-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                {work.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a href="#" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          See All Work <FiPlayCircle />
        </a>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto  ">
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Let's Start with a <span className="text-red-500">Hello!</span></h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-md">
            Whether you've got a big idea, a rough sketch, or just want to say hey, we're here. No pressure, no weird forms. Just send us a message and let's see where it goes.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/5 p-3 rounded-full text-red-500">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">+88 01646-057717</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/5 p-3 rounded-full text-red-500">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">officialtechency@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/5 p-3 rounded-full text-red-500">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-sm">House- 31 Road-2, 5th Floor, Block- C,<br />Banasree, Rampura, Dhaka, 1219</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#111] p-8 rounded-2xl border border-white/5">
          <form className="space-y-4">
            <div>
              <input type="text" placeholder="Your Name" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <div>
              <input type="email" placeholder="Your Email" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <div>
              <textarea placeholder="Your Message" rows="4" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"></textarea>
            </div>
            <button type="button" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-[6px] rounded-full font-semibold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 w-full ">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
