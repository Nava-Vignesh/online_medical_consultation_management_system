import '../../styles/components.css';

function StatCard({ label, value, meta, icon }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {meta && <div className="stat-card-meta">{meta}</div>}
    </div>
  );
}

export default StatCard;
