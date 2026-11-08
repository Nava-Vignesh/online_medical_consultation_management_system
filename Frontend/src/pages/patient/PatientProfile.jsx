import { useState } from 'react';
import {
  User, Mail, Phone, Heart, Shield, AlertCircle,
  Save, CheckCircle, Home, Calendar
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { dummyPatient } from '../../data/dummyData';
import '../../styles/patient.css';

function PatientProfile() {
  const [profile, setProfile] = useState({
    name: dummyPatient.name,
    age: dummyPatient.age,
    gender: dummyPatient.gender,
    dateOfBirth: dummyPatient.dateOfBirth || '1994-05-14',
    bloodGroup: dummyPatient.bloodGroup,
    email: dummyPatient.email,
    phone: dummyPatient.phone,
    address: dummyPatient.address,
    allergies: dummyPatient.allergies,
    chronicConditions: dummyPatient.chronicConditions,
    emergencyContact: dummyPatient.emergencyContact,
    insuranceProvider: dummyPatient.insuranceProvider || 'Star Health Care (#POL-891024)',
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Patient Profile & Health Details"
        subtitle="Manage your personal information, emergency contacts, and medical history."
        actions={
          savedToast ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600 }}>
              <CheckCircle size={18} /> Profile Saved Successfully
            </div>
          ) : (
            <Button variant="primary" onClick={handleSave}>
              <Save size={15} style={{ marginRight: 6 }} />
              Save Profile
            </Button>
          )
        }
      />

      <div className="dashboard-grid">
        {/* Left Column: Personal Information Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Personal Information</div>
                <div className="card-subtitle">Verified patient identity & contact details</div>
              </div>
              <Badge status="active" label="Active Patient" />
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
                  <label className="input-label">Date of Birth</label>
                  <input
                    type="date"
                    className="input-field"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Gender</label>
                  <select
                    className="input-field"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Blood Group</label>
                  <select
                    className="input-field"
                    value={profile.bloodGroup}
                    onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-wrapper">
                  <label className="input-label">Email Address</label>
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
                <label className="input-label">Residential Address</label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">Insurance Provider & Policy Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.insuranceProvider}
                  onChange={(e) => setProfile({ ...profile, insuranceProvider: e.target.value })}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Medical Background & Emergency Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Medical Background & Alerts</div>
                <div className="card-subtitle">Critical medical history for consulting doctors</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-wrapper">
                <label className="input-label" style={{ color: 'var(--danger)' }}>
                  Known Drug & Food Allergies *
                </label>
                <input
                  type="text"
                  className="input-field"
                  style={{ borderColor: '#fca5a5', background: '#fdf2f2', color: '#991b1b', fontWeight: 600 }}
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Peanuts..."
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">Chronic Health Conditions</label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.chronicConditions}
                  onChange={(e) => setProfile({ ...profile, chronicConditions: e.target.value })}
                  placeholder="e.g. Hypertension, Diabetes..."
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">Emergency Contact Information *</label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.emergencyContact}
                  onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                  placeholder="Name, Relation & Phone Number"
                />
              </div>

              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--secondary)' }}>
                Your emergency contact and allergies are automatically displayed to doctors during online telemedicine consultations.
              </div>

              <Button variant="primary" onClick={handleSave}>
                Save Health Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
