import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLayout, FiLogOut, FiMenu, FiChevronRight, FiBell, FiVideo, FiLink2, FiUpload, FiUser } from 'react-icons/fi';

const logo = "/logo.png";

const navItems = [
  { to: '/dashboard/pm', label: 'Overview', icon: FiLayout, end: true },
  { to: '/dashboard/pm/upload', label: 'Upload Video', icon: FiUpload },
  { to: '/dashboard/pm/videos', label: 'Video Management', icon: FiVideo },
  { to: '/dashboard/pm/demo-links', label: 'Demo Links', icon: FiLink2 },
];

export default function PMLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-[#002546] border-r border-white/5 flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className='w-[150px]' />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[5px] text-sm font-medium transition-all group ${isActive ? 'bg-white text-[#013f77]' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              <FiChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 lg:px-4 py-2 lg:py-3 border-b border-gray-200 bg-white z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-black">
              <FiMenu className="w-6 h-6" />
            </button>
            <p className="text-black font-semibold text-sm lg:hidden">PM Panel</p>
            <div className="hidden lg:block">
              <h1 className="text-black font-semibold text-lg">Welcome, {user?.name || 'Project Manager'} 👋</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-black transition-colors">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#013f77] rounded-full"></span>
            </button>
            <div className="relative">
              <div
                className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-black text-sm font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#013f77] to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  <NavLink
                    to="profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#013f77] hover:bg-blue-50 transition-all"
                  >
                    <FiUser className="w-4 h-4" />
                    My Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-4 bg-[#EAEFF5]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
