import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, FileText,
  MessageSquare, User, LogOut
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import { dummyDoctor } from '../data/dummyData';
import '../styles/layout.css';

const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    section: 'Practice',
    items: [
      { path: '/doctor/appointments', label: 'Appointments', icon: <Calendar size={16} /> },
      { path: '/doctor/patients', label: 'My Patients', icon: <Users size={16} /> },
      { path: '/doctor/consultations', label: 'Consultations', icon: <MessageSquare size={16} /> },
      { path: '/doctor/records', label: 'Records', icon: <FileText size={16} /> },
    ],
  },
  {
    section: 'Account',
    items: [
      { path: '/doctor/profile', label: 'My Profile', icon: <User size={16} /> },
    ],
  },
];

function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <Sidebar
          portalLabel="Doctor Portal"
          navItems={NAV_ITEMS}
          onClose={() => setSidebarOpen(false)}
          bottomItems={[
            {
              label: 'Sign Out',
              icon: <LogOut size={16} />,
              onClick: handleLogout,
            },
          ]}
        />
      </div>

      <div className="main-area">
        <Topbar
          title="Doctor Portal"
          user={{ name: dummyDoctor.name, role: dummyDoctor.specialization }}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DoctorLayout;
