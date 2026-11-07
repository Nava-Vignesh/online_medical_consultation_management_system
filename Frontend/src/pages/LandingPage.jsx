import { useNavigate } from 'react-router-dom';
import { Activity, User, Stethoscope, Shield, ArrowRight } from 'lucide-react';
import '../styles/landing.css';

const roles = [
  {
    id: 'patient',
    icon: <User size={22} />,
    title: 'Patient Portal',
    desc: 'Book appointments, view your medical records, and consult with doctors online.',
    path: '/patient/dashboard',
  },
  {
    id: 'doctor',
    icon: <Stethoscope size={22} />,
    title: 'Doctor Portal',
    desc: 'Manage your schedule, review patient records, and conduct online consultations.',
    path: '/doctor/dashboard',
  },
  {
    id: 'admin',
    icon: <Shield size={22} />,
    title: 'Admin Panel',
    desc: 'Oversee system operations, manage users, and monitor platform activity.',
    path: '/admin/dashboard',
  },
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      {/* Top bar */}
      <header className="landing-topbar">
        <div className="landing-topbar-logo">
          <Activity size={22} />
          <div>
            <div className="landing-topbar-logo-text">MedConsult</div>
            <div className="landing-topbar-logo-sub">Online Medical Consultation System</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-eyebrow">
          <Activity size={11} />
          Medical Consultation Platform
        </div>

        <h1 className="landing-title">
          Your Health,<br />
          <span>Managed Digitally</span>
        </h1>

        <p className="landing-subtitle">
          A unified platform for patients, doctors, and administrators to streamline
          medical consultations and healthcare management.
        </p>

        <div className="landing-cards">
          {roles.map((role) => (
            <button
              key={role.id}
              className="role-card"
              onClick={() => navigate(role.path)}
            >
              <div className="role-card-icon">{role.icon}</div>
              <div className="role-card-title">{role.title}</div>
              <p className="role-card-desc">{role.desc}</p>
              <div className="role-card-action">
                Enter Portal
                <ArrowRight size={14} className="role-card-arrow" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        Online Medical Consultation and Management System &mdash; Software Engineering Project &copy; 2026
      </footer>
    </div>
  );
}

export default LandingPage;
