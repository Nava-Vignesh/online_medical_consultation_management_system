import { useState } from 'react';
import {
  Award, FileText, Plus, Eye, X, CheckCircle,
  Printer, Calendar, User
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import { dummyCertificates, dummyDoctor, patients } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorCertificates() {
  const [certificates, setCertificates] = useState(dummyCertificates);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New certificate form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [certType, setCertType] = useState('Sick Leave Certificate');
  const [diagnosis, setDiagnosis] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const activeCount = certificates.filter((c) => c.status === 'active').length;
  const expiredCount = certificates.filter((c) => c.status === 'expired').length;

  const handleCreateCertificate = (e) => {
    e.preventDefault();
    const p = patients.find((pat) => pat.id === patientId) || patients[0];
    const newCert = {
      id: `CERT-2026-00${certificates.length + 1}`,
      patientId: p.id,
      patientName: p.name,
      patientAge: p.age,
      patientGender: p.gender,
      type: certType,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: validUntil || '2026-11-20',
      diagnosis: diagnosis || 'General illness recovery',
      recommendation: recommendation || 'Recommended rest from work or physical duties.',
      doctorName: dummyDoctor.name,
      status: 'active',
    };

    setCertificates([newCert, ...certificates]);
    setIsNewModalOpen(false);
    setSelectedCert(newCert);
    setDiagnosis('');
    setValidUntil('');
    setRecommendation('');
  };

  return (
    <div>
      <PageHeader
        title="Medical Certificates"
        subtitle="Issue, authenticate, and manage patient medical certificates and fitness clearances."
        actions={
          <Button variant="primary" onClick={() => setIsNewModalOpen(true)}>
            <Plus size={15} style={{ marginRight: 6 }} />
            Issue New Certificate
          </Button>
        }
      />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Issued Certificates"
          value={certificates.length.toString()}
          meta="All verified medical documents"
          icon={<Award size={18} />}
        />
        <StatCard
          label="Active Certificates"
          value={activeCount.toString()}
          meta="Currently valid leave/fitness"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Expired / Archival"
          value={expiredCount.toString()}
          meta="Past validity records"
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Issuing Practitioner"
          value="Dr. Priya Nair"
          meta={dummyDoctor.regNumber}
          icon={<User size={18} />}
        />
      </div>

      {/* Certificates Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Issued Medical Certificates Registry</div>
            <div className="card-subtitle">Showing {certificates.length} official clinical certificates</div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Patient</th>
                <th>Certificate Type</th>
                <th>Issue Date</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{cert.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{cert.patientName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                      {cert.patientAge}y &bull; {cert.patientGender}
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{cert.type}</td>
                  <td>{cert.issueDate}</td>
                  <td>{cert.validUntil}</td>
                  <td>
                    <Badge
                      status={cert.status === 'active' ? 'active' : 'inactive'}
                      label={cert.status.toUpperCase()}
                    />
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedCert(cert)}
                    >
                      <Eye size={13} style={{ marginRight: 4 }} />
                      View Certificate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Certificate Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Medical Certificate &mdash; {selectedCert.id}</h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>{selectedCert.type}</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCert(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="prescription-paper" style={{ padding: '28px' }}>
                <div className="rx-pad-header">
                  <div>
                    <div className="rx-clinic-name">MEDCONSULT CLINICAL SERVICES</div>
                    <div className="rx-clinic-sub">Department of General Medicine &bull; Outpatient Clinic</div>
                    <div className="rx-clinic-sub">14, MG Road, Bangalore &bull; Registration: {dummyDoctor.regNumber}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary)' }}>
                      OFFICIAL MEDICAL CERTIFICATE
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>Cert ID: {selectedCert.id}</div>
                  </div>
                </div>

                <div style={{ margin: '24px 0', fontSize: '14px', lineHeight: 1.8 }}>
                  <p>
                    This is to formally certify that <strong>{selectedCert.patientName}</strong>, aged{' '}
                    <strong>{selectedCert.patientAge} years</strong>, was examined in-person at MedConsult Outpatient
                    Consultation Wing on <strong>{selectedCert.issueDate}</strong>.
                  </p>
                  <p style={{ marginTop: '12px' }}>
                    <strong>Clinical Diagnosis:</strong> {selectedCert.diagnosis}
                  </p>
                  <p style={{ marginTop: '12px' }}>
                    <strong>Medical Advice &amp; Recommendation:</strong> {selectedCert.recommendation}
                  </p>
                  <p style={{ marginTop: '12px' }}>
                    This certificate is valid until <strong>{selectedCert.validUntil}</strong>.
                  </p>
                </div>

                <div className="rx-pad-footer">
                  <div style={{ fontSize: '11px', color: 'var(--secondary)', maxWidth: '60%' }}>
                    This document is an authenticated clinical certificate issued under the Medical Council of India guidelines.
                  </div>
                  <div className="doctor-sign-block">
                    <div className="doctor-signature-line">{selectedCert.doctorName || dummyDoctor.name}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600 }}>Attending Physician</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => window.print()}>
                <Printer size={14} style={{ marginRight: 6 }} />
                Print Certificate
              </Button>
              <Button variant="primary" onClick={() => setSelectedCert(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Certificate Modal */}
      {isNewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateCertificate}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Issue Medical Certificate</h3>
                  <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Generate official medical certificate for patient</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsNewModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div>
                  <label className="input-label">Select Patient *</label>
                  <select
                    className="input-field"
                    required
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.gender}, {p.age}y &bull; Blood: {p.bloodGroup})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Certificate Type *</label>
                  <select
                    className="input-field"
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                  >
                    <option value="Sick Leave Certificate">Sick Leave Certificate</option>
                    <option value="Medical Fitness Certificate">Medical Fitness Certificate</option>
                    <option value="Workplace Exemption Letter">Workplace Exemption Letter</option>
                    <option value="Travel Medical Clearance">Travel Medical Clearance</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Clinical Diagnosis *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Acute Viral Pharyngitis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>

                <div>
                  <label className="input-label">Valid Until *</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>

                <div>
                  <label className="input-label">Medical Recommendations &amp; Advice *</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    required
                    placeholder="Specify rest period, activity restrictions, or fitness confirmation..."
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Issue &amp; Authenticate Certificate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorCertificates;

