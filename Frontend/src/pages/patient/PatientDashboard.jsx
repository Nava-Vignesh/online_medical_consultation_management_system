import { Calendar, FileText, MessageSquare, Clock } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { appointments, dummyPatient } from '../../data/dummyData';

// Only show appointments relevant to this patient
const myAppointments = appointments.filter(
  (a) => a.patientName === dummyPatient.name
);

function PatientDashboard() {
  return (
    <div>
      <PageHeader
        title={`Welcome, ${dummyPatient.name.split(' ')[0]}`}
        subtitle={`Here's your health summary for today, 7 November 2026.`}
        actions={<Button variant="primary">Book Appointment</Button>}
      />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Upcoming Appointments"
          value="1"
          meta="Next: Nov 10, 10:00 AM"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Medical Records"
          value="6"
          meta="Last updated Oct 28"
          icon={<FileText size={18} />}
        />
        <StatCard
          label="Consultations"
          value="3"
          meta="2 completed this month"
          icon={<MessageSquare size={18} />}
        />
        <StatCard
          label="Prescriptions Active"
          value="2"
          meta="Review due in 14 days"
          icon={<Clock size={18} />}
        />
      </div>

      <div className="dashboard-grid">
        {/* Appointments table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">My Appointments</div>
              <div className="card-subtitle">Your scheduled and past visits</div>
            </div>
            <Button variant="secondary" size="sm">View All</Button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 4).map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.date}</td>
                    <td>{apt.time}</td>
                    <td>{apt.doctorName}</td>
                    <td>{apt.type}</td>
                    <td><Badge status={apt.status} label={apt.status.charAt(0).toUpperCase() + apt.status.slice(1)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profile summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Profile</div>
          </div>
          <div>
            {[
              { label: 'Full Name', value: dummyPatient.name },
              { label: 'Age', value: `${dummyPatient.age} years` },
              { label: 'Blood Group', value: dummyPatient.bloodGroup },
              { label: 'Email', value: dummyPatient.email },
              { label: 'Phone', value: dummyPatient.phone },
            ].map((row) => (
              <div key={row.label} className="info-row">
                <span className="info-row-label">{row.label}</span>
                <span className="info-row-value">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
