import React, { useEffect, useState } from 'react';
import { FiVideo, FiClock, FiCheckCircle, FiXCircle, FiUsers, FiLink2 } from 'react-icons/fi';
import api from '../../../services/api';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`bg-[#111] border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:border-white/10 transition-all`}>
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-0.5">{value ?? '—'}</p>
    </div>
  </div>
);

export default function AdminOverview() {
  const [videoStats, setVideoStats] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [demoCount, setDemoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vRes, uRes, dRes] = await Promise.all([
          api.get('/videos/stats'),
          api.get('/users/stats'),
          api.get('/demo/all'),
        ]);
        setVideoStats(vRes.data.data);
        setUserStats(uRes.data.data);
        setDemoCount(dRes.data.data?.length || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getUserCount = (role) => userStats.find(s => s._id === role)?.count || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Techency Video Agency — Admin Control Center</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FiVideo} label="Total Videos" value={videoStats?.total} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard icon={FiClock} label="Pending Approval" value={videoStats?.pending} color="text-yellow-400" bg="bg-yellow-500/10" />
        <StatCard icon={FiCheckCircle} label="Approved" value={videoStats?.approved} color="text-green-400" bg="bg-green-500/10" />
        <StatCard icon={FiXCircle} label="Rejected" value={videoStats?.rejected} color="text-red-400" bg="bg-red-500/10" />
        <StatCard icon={FiUsers} label="Total Users" value={getUserCount('admin') + getUserCount('editor') + getUserCount('sales')} color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard icon={FiLink2} label="Demo Links Created" value={demoCount} color="text-orange-400" bg="bg-orange-500/10" />
      </div>

      {/* User breakdown */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Team Breakdown</h2>
        <div className="space-y-3">
          {[
            { role: 'admin', label: 'Admins', color: 'bg-red-500' },
            { role: 'editor', label: 'Editors', color: 'bg-blue-500' },
            { role: 'sales', label: 'Sales Executives', color: 'bg-green-500' },
          ].map(({ role, label, color }) => {
            const count = getUserCount(role);
            const total = getUserCount('admin') + getUserCount('editor') + getUserCount('sales') || 1;
            return (
              <div key={role} className="flex items-center gap-3">
                <div className="w-24 text-gray-400 text-sm">{label}</div>
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <div className="w-6 text-right text-white text-sm font-medium">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
