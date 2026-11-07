import '../../styles/components.css';

function Badge({ status, label }) {
  const text = label || status;
  const cls = `badge badge-${status}`;
  return <span className={cls}>{text}</span>;
}

export default Badge;
