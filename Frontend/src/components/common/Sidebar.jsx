import { NavLink } from 'react-router-dom';
import { Activity } from 'lucide-react';
import '../../styles/layout.css';

function Sidebar({ portalLabel, navItems, bottomItems, onClose }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">
          <Activity size={20} />
        </span>
        <div>
          <div className="sidebar-brand-name">MedConsult</div>
          <div className="sidebar-brand-portal">{portalLabel}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            {section.section && (
              <div className="sidebar-section-label">{section.section}</div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-item${isActive ? ' active' : ''}`
                }
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {bottomItems && (
        <div className="sidebar-footer">
          {bottomItems.map((item) => (
            <button key={item.label} className="sidebar-nav-item" onClick={item.onClick}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
