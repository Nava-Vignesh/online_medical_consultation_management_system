import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { appointments, patients, dummyDoctor } from '../../data/dummyData';

function DoctorDashboard() {
  return (
    <div>
      <PageHeader
        title={`Good morning, ${dummyDoctor.name}`}
        subtitle={`${dummyDoctor.specialization} · ${dummyDoctor.department}`}
        actions={<Badge status="available" label="Available" />}
      />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Today's Appointments"
          value="8"
          meta="3 completed · 5 remaining"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Total Patients"
          value={dummyDoctor.patients}
          meta="Active caseload"
          icon={<Users size={18} />}
        />
        <StatCard
          label="Completed This Week"
          value="31"
          meta="Up from 24 last week"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Pending Reviews"
          value="4"
          meta="Lab results awaiting"
          icon={<Clock size={18} />}
        />
      </div>

      <div className="dashboard-grid">
        {/* Appointments */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Schedule</div>
              <div className="card-subtitle">Appointments for 7 November 2026</div>
            </div>
            <Button variant="secondary" size="sm">View All</Button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.patientName}</td>
                    <td>{apt.time}</td>
                    <td>{apt.type}</td>
                    <td><Badge status={apt.status} label={apt.status.charAt(0).toUpperCase() + apt.status.slice(1)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient list */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Patients</div>
          </div>
          <div>
            {patients.map((p) => (
              <div key={p.id} className="info-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13.5 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>Age {p.age} · Last visit: {p.lastVisit}</div>
                </div>
                <Badge status={p.status} label={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
