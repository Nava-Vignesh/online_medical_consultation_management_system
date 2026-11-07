import { Users, UserCheck, Calendar, AlertCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { appointments, doctors, patients, stats } from '../../data/dummyData';

function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="System Overview"
        subtitle="Platform health and activity summary — 7 November 2026"
        actions={<Button variant="secondary" size="sm">Export Report</Button>}
      />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          meta="Registered accounts"
          icon={<Users size={18} />}
        />
        <StatCard
          label="Active Doctors"
          value={stats.totalDoctors}
          meta="Across all departments"
          icon={<UserCheck size={18} />}
        />
        <StatCard
          label="Appointments Today"
          value={stats.appointmentsToday}
          meta="Scheduled for today"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pendingApprovals}
          meta="Require admin action"
          icon={<AlertCircle size={18} />}
        />
      </div>

      <div className="dashboard-grid">
        {/* Appointments table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Appointments</div>
              <div className="card-subtitle">System-wide appointment activity</div>
            </div>
            <Button variant="secondary" size="sm">View All</Button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{apt.id}</td>
                    <td>{apt.patientName}</td>
                    <td>{apt.doctorName}</td>
                    <td>{apt.date}</td>
                    <td><Badge status={apt.status} label={apt.status.charAt(0).toUpperCase() + apt.status.slice(1)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor roster */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Doctor Roster</div>
            <Button variant="secondary" size="sm">Manage</Button>
          </div>
          <div>
            {doctors.map((d) => (
              <div key={d.id} className="info-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13.5 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{d.specialization} · {d.patients} patients</div>
                </div>
                <Badge status={d.status} label={d.status.charAt(0).toUpperCase() + d.status.slice(1)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
