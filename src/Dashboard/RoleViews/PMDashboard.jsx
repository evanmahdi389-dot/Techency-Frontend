import React, { useState } from 'react';
import {
  FiSearch, FiBell, FiChevronDown, FiVideo, FiClock, FiCheckCircle,
  FiUsers, FiActivity, FiArrowUpRight, FiLayers
} from 'react-icons/fi';

// Mock Data
const SUMMARY_STATS = [
  { label: 'Total Orders', value: '124', icon: FiVideo, bg: 'bg-[#002546]/10 text-[#002546]' },
  { label: 'Active Projects', value: '45', icon: FiActivity, bg: 'bg-indigo-50 text-indigo-600' },
  { label: 'Pending Orders', value: '12', icon: FiClock, bg: 'bg-amber-50 text-amber-500' },
  { label: 'Delivered', value: '984', icon: FiCheckCircle, bg: 'bg-emerald-50 text-emerald-500' },
  { label: 'Total Clients', value: '156', icon: FiUsers, bg: 'bg-purple-50 text-purple-500' },
  { label: 'Team Members', value: '24', icon: FiUsers, bg: 'bg-cyan-50 text-cyan-500' },
  { label: 'New Inquiries', value: '18', icon: FiBell, bg: 'bg-[#002546]/10 text-[#002546]' },
  { label: 'Categories', value: '15', icon: FiLayers, bg: 'bg-rose-50 text-rose-500' },
];

const ACTIVE_PROJECTS = [
  { id: 1, client: 'MD Apu', business: 'Growsin market', progress: 65, status: 'Shooting', date: 'Oct 24, 2026', gradient: 'from-[#002546] to-[#00478A]' },
  { id: 2, client: 'John Doe', business: 'TechFlow Inc.', progress: 30, status: 'Scripting', date: 'Oct 28, 2026', gradient: 'from-amber-400 to-orange-500' },
  { id: 3, client: 'Jane Smith', business: 'Global Media', progress: 85, status: 'Editing', date: 'Oct 20, 2026', gradient: 'from-purple-500 to-pink-500' },
  { id: 4, client: 'Stark Ind.', business: 'Acme Corp', progress: 95, status: 'Edit Review', date: 'Oct 18, 2026', gradient: 'from-emerald-400 to-teal-500' },
];

export default function PMDashboard() {
  const [date] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  return (
    <div className="min-h-screen bg-[#EAEFF5] font-sans text-[#002546] p-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-br from-[#002546] to-[#00478A] rounded-[6px] p-8 shadow-[0px_18px_40px_rgba(0,37,70,0.2)] flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFB547]/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="relative z-10">
            <h2 className="text-white/80 font-medium uppercase tracking-widest text-sm mb-2">Project Manager Overview</h2>
            <div className="text-white text-3xl font-bold tracking-tight">Monitor projects and track progress</div>
            <p className="text-white/70 mt-2 text-sm">{date}</p>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {SUMMARY_STATS.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-[6px] p-6 border border-white shadow-[0px_12px_28px_rgba(0,37,70,0.08)] hover:shadow-[0px_18px_40px_rgba(0,37,70,0.12)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
              <div className={`w-14 h-14 rounded-[16px] ${stat.bg} flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}>
                <stat.icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="relative z-10">
                <p className="text-[#A3AED0] text-sm font-bold">{stat.label}</p>
                <h3 className="text-2xl font-black text-[#002546] tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* PRODUCTION PIPELINE */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-[#002546]">Production Pipeline</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Elegant Bar Chart Box */}
            <div className="bg-white rounded-[20px] p-7 border border-white shadow-[0px_12px_28px_rgba(0,37,70,0.08)] flex flex-col h-[320px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-bold text-[#002546]">Orders By Stage</h3>
                <span className="text-[#002546] bg-[#002546]/10 px-3 py-1 rounded-lg text-xs font-bold">This Week</span>
              </div>
              <div className="flex-1 flex items-end justify-between px-4 relative z-10">
                {[
                  { label: 'Script', h: 35, gradient: 'from-[#FFB547] to-[#FF8E2B]', shadow: 'shadow-[0_4px_12px_rgba(255,142,43,0.3)]' },
                  { label: 'Shoot', h: 65, gradient: 'from-[#002546] to-[#00478A]', shadow: 'shadow-[0_4px_12px_rgba(0,37,70,0.3)]' },
                  { label: 'Edit', h: 90, gradient: 'from-[#A15BF0] to-[#C991FF]', shadow: 'shadow-[0_4px_12px_rgba(161,91,240,0.3)]' },
                  { label: 'Done', h: 100, gradient: 'from-[#01B574] to-[#4CE5B1]', shadow: 'shadow-[0_4px_12px_rgba(1,181,116,0.3)]' }
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 w-12 group cursor-pointer">
                    <div className="w-full h-[180px] bg-[#F4F7FE] rounded-full relative overflow-hidden flex items-end p-1 border border-white shadow-inner">
                      <div className={`w-full rounded-full bg-gradient-to-t ${bar.gradient} ${bar.shadow} group-hover:scale-y-105 origin-bottom transition-transform duration-300`} style={{ height: `${bar.h}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-[#A3AED0]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Elegant Donut Chart Box */}
            <div className="bg-white rounded-[20px] p-7 border border-white shadow-[0px_12px_28px_rgba(0,37,70,0.08)] flex flex-col h-[320px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
              <div className="flex justify-between items-center mb-2 relative z-10">
                <h3 className="text-lg font-bold text-[#002546]">Project Distribution</h3>
                <span className="text-[#002546] bg-[#002546]/10 px-3 py-1 rounded-lg text-xs font-bold">All Time</span>
              </div>
              <div className="flex-1 w-full relative flex flex-col items-center justify-center pt-2 z-10">

                <div className="relative w-[170px] h-[170px]">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_4px_8px_rgba(0,37,70,0.1)]">
                    <circle cx="50" cy="50" r="35" stroke="#F4F7FE" strokeWidth="12" fill="none" />
                    <circle cx="50" cy="50" r="35" stroke="#002546" strokeWidth="12" fill="none" strokeDasharray="99 220" strokeDashoffset="0" className="hover:stroke-width-14 transition-all duration-300 cursor-pointer" />
                    <circle cx="50" cy="50" r="35" stroke="#4318FF" strokeWidth="12" fill="none" strokeDasharray="77 220" strokeDashoffset="-99" className="hover:stroke-width-14 transition-all duration-300 cursor-pointer" />
                    <circle cx="50" cy="50" r="35" stroke="#FFB547" strokeWidth="12" fill="none" strokeDasharray="44 220" strokeDashoffset="-176" className="hover:stroke-width-14 transition-all duration-300 cursor-pointer" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-[#002546]">124</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3AED0]">Total</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-6 w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#002546] shadow-sm"></div>
                    <span className="text-xs font-bold text-[#A3AED0]">Corporate (45%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4318FF] shadow-sm"></div>
                    <span className="text-xs font-bold text-[#A3AED0]">Ads (35%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFB547] shadow-sm"></div>
                    <span className="text-xs font-bold text-[#A3AED0]">Events (20%)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ACTIVE PROJECT TABLE */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[22px] font-bold text-[#002546]">Active Project</h2>
          </div>
          <div className="bg-white rounded-[6px] border border-white shadow-[0px_12px_28px_rgba(0,37,70,0.08)] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className=' bg-[#1a3b59]'>
                    <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Client name</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Business Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Progress</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE] text-right">Delivery Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVE_PROJECTS.map((project, index) => (
                    <tr key={project.id} className="hover:bg-[#F4F7FE]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#002546]">{project.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#A3AED0] font-bold">{project.business}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 w-40">
                          <span className="text-sm font-bold text-[#002546] w-8">{project.progress}%</span>
                          <div className="w-full bg-[#F4F7FE] rounded-full h-2.5 overflow-hidden shadow-inner border border-[#EAEFF5]/50">
                            <div className={`h-full rounded-full bg-gradient-to-r ${project.gradient} relative group-hover:scale-y-110 transition-transform`} style={{ width: `${project.progress}%` }}>
                              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r ${project.gradient} bg-opacity-10 text-transparent bg-clip-text shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-white`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#A3AED0] font-bold text-right">
                        {project.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
