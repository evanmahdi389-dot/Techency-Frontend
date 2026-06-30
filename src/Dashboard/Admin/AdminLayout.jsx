import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiVideo, FiTag, FiUsers, FiLink2,
  FiUpload, FiLogOut, FiMenu, FiX, FiChevronRight, FiChevronDown, FiBell, FiFolder, FiLayers, FiActivity, FiShare2, FiBox,
  FiUser
} from 'react-icons/fi';

const logo = "/logo.png";

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
  { to: '/dashboard/admin/roles', label: 'Role Management', icon: FiUsers },
  { to: '/dashboard/admin/demo-links', label: 'Demo Links', icon: FiLink2 },
  { to: '/dashboard/admin/order-sources', label: 'Order Sources', icon: FiShare2 },
  { to: '/dashboard/admin/service-types', label: 'Service Types', icon: FiBox },
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
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-[#002546] border-r border-white/5 flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className='w-[150px]' />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(({ to, label, icon: Icon, end, subItems }) => (
            subItems ? (
              <div key={label} className="space-y-1 mb-2">
                <div
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[5px] text-sm font-medium cursor-pointer transition-colors ${isCategoryActive ? 'bg-white text-[#013f77]' : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0`} />
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
                          ? 'bg-white text-[#013f77]'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
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
                    ? 'bg-white text-[#013f77]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                <FiChevronRight className={`w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity`} />
              </NavLink>
            )
          ))}
        </nav>


      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 lg:px-4 py-2 lg:py-3 border-b border-gray-200 bg-white z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-black">
              <FiMenu className="w-6 h-6" />
            </button>
            <p className="text-black font-semibold text-sm lg:hidden">Admin Panel</p>
            <div className="hidden lg:block">
              <h1 className="text-black font-semibold text-lg">Welcome, {user?.name || 'Admin'} 👋</h1>
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
