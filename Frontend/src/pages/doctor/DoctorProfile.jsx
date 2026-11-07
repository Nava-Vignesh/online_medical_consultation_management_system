import { useState } from 'react';
import {
  User, Mail, Phone, Award, Shield, Clock,
  Calendar, DollarSign, CheckCircle, Save
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { dummyDoctor } from '../../data/dummyData';
import '../../styles/doctor.css';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function DoctorProfile() {
  const [profile, setProfile] = useState({
    name: dummyDoctor.name,
    specialization: dummyDoctor.specialization,
    department: dummyDoctor.department,
    qualification: dummyDoctor.qualification || 'MBBS, MD (General Medicine)',
    regNumber: dummyDoctor.regNumber || 'MCI-2014-89211',
    email: dummyDoctor.email,
    phone: dummyDoctor.phone,
    experience: dummyDoctor.experience,
    bio: dummyDoctor.bio || 'Consultant Physician with expertise in outpatient management and in-person clinical care.',
    consultationFee: dummyDoctor.consultationFee || '₹500',
    availableHours: dummyDoctor.availableHours || '09:00 AM - 05:00 PM',
    slotDuration: dummyDoctor.slotDuration || '30 mins',
  });

  const [availableDays, setAvailableDays] = useState(
    dummyDoctor.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  );

  const [savedToast, setSavedToast] = useState(false);

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Doctor Profile & Practice Settings"
        subtitle="Manage your professional credentials, consultation fees, and weekly schedule availability."
        actions={
          savedToast ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600 }}>
              <CheckCircle size={18} /> Settings Updated Successfully
            </div>
          ) : (
            <Button variant="primary" onClick={handleSave}>
              <Save size={15} style={{ marginRight: 6 }} />
              Save Profile Changes
            </Button>
          )
        }
      />

      <div className="dashboard-grid">
        {/* Left Column: Profile Information Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Professional Identity & Credentials</div>
                <div className="card-subtitle">Verified medical practitioner data</div>
              </div>
              <Badge status="available" label="Active & Verified" />
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Specialization</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Hospital Department</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Clinical Experience</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Qualifications</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.qualification}
                    onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                  />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Medical Registration / License #</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.regNumber}
                    onChange={(e) => setProfile({ ...profile, regNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Official Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Contact Phone</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Practitioner Biography</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Availability & Slot Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Consultation Slots & Availability</div>
                <div className="card-subtitle">Define working hours and days</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>
                  Available Working Days
                </label>
                <div className="schedule-days-grid">
                  {ALL_DAYS.map((day) => {
                    const isSelected = availableDays.includes(day);
                    return (
                      <div
                        key={day}
                        className={`schedule-day-box${isSelected ? ' selected' : ''}`}
                        onClick={() => toggleDay(day)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span style={{ fontSize: 12 }}>{day.slice(0, 3)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Daily Consultation Hours</label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.availableHours}
                  onChange={(e) => setProfile({ ...profile, availableHours: e.target.value })}
                  placeholder="09:00 AM - 05:00 PM"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="input-wrapper">
                  <label className="input-label">Slot Duration</label>
                  <select
                    className="input-field"
                    value={profile.slotDuration}
                    onChange={(e) => setProfile({ ...profile, slotDuration: e.target.value })}
                  >
                    <option value="15 mins">15 mins</option>
                    <option value="20 mins">20 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                  </select>
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Consultation Fee</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.consultationFee}
                    onChange={(e) => setProfile({ ...profile, consultationFee: e.target.value })}
                    placeholder="₹500"
                  />
                </div>
              </div>

              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  In-Person Practice Settings Summary
                </div>
                <div style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.5 }}>
                  Active {availableDays.length} days/week &bull; {profile.availableHours} &bull; {profile.slotDuration} slots &bull; Fee {profile.consultationFee}
                </div>
              </div>

              <Button variant="primary" onClick={handleSave}>
                Save Availability Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
