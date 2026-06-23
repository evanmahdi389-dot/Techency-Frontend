import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiVideo, FiTag, FiUsers, FiLink2,
  FiUpload, FiLogOut, FiMenu, FiX, FiChevronRight, FiChevronDown, FiBell, FiFolder, FiLayers
} from 'react-icons/fi';

import logo from "../../../public/logo.png";

const navItems = [
  { to: '/dashboard/admin', label: 'Overview', icon: FiGrid, end: true },
    { to: '/dashboard/admin/videos', label: 'Videos', icon: FiVideo },
  { to: '/dashboard/admin/upload', label: 'Upload', icon: FiUpload },
  {
    label: 'Category', icon: FiTag,
    subItems: [
      { to: '/dashboard/admin/categories?tab=main', tab: 'main', label: 'Main Category', icon: FiFolder },
      { to: '/dashboard/admin/categories?tab=sub', tab: 'sub', label: 'Sub Category', icon: FiLayers }
    ]
  },
  { to: '/dashboard/admin/users', label: 'Users', icon: FiUsers },
  { to: '/dashboard/admin/demo-links', label: 'Demo Links', icon: FiLink2 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'main';
  
  // Determine if we are currently inside a category route to default open the dropdown
  const isCategoryActive = location.pathname.includes('/categories');
  const [categoryOpen, setCategoryOpen] = useState(isCategoryActive);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-[#0e0e0e] border-r border-white/5 flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className='w-[150px]' />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end, subItems }) => (
            subItems ? (
              <div key={label} className="space-y-1 mb-2">
                <div 
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[5px] text-sm font-medium cursor-pointer transition-colors ${
                    isCategoryActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isCategoryActive ? 'text-red-400' : ''}`} />
                  {label}
                  <FiChevronDown className={`w-3 h-3 ml-auto transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
                </div>
                
                <div className={`pl-4 space-y-1 mt-1 overflow-hidden transition-all duration-300 ${categoryOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {subItems.map(sub => {
                    const isSubActive = location.pathname === '/dashboard/admin/categories' && currentTab === sub.tab;
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-[5px] text-sm font-medium transition-all ${isSubActive
                          ? 'bg-red-600/15 text-red-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        {sub.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ) : (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-[5px] text-sm font-medium transition-all group ${isActive
                    ? 'bg-red-600/15 text-red-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                <FiChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            )
          ))}
        </nav>


      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-white/5 bg-[#0e0e0e] z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
              <FiMenu className="w-6 h-6" />
            </button>
            <p className="text-white font-semibold text-sm lg:hidden">Admin Panel</p>
            <div className="hidden lg:block">
              <h1 className="text-white font-semibold text-lg">Welcome, {user?.name || 'Admin'} 👋</h1>
              <p className="text-gray-400 text-sm">Here's what's happening with your platform today.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <div 
                className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              </div>
              
              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
