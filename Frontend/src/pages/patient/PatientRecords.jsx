import { useState, useMemo } from 'react';
import {
  FileText, Search, Printer, Download, Eye, Calendar,
  Upload, CheckCircle, X, Shield, Activity, Clock
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { dummyPrescriptions, patientLabReports, dummyPatient, dummyDoctor } from '../../data/dummyData';
import '../../styles/patient.css';

function PatientRecords() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);
  const [selectedLabReport, setSelectedLabReport] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  // New report form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Blood Test');
  const [reportDoctor, setReportDoctor] = useState('Dr. Priya Nair');

  // Filtered prescriptions for this patient
  const myPrescriptions = dummyPrescriptions.filter(
    (rx) => rx.patientId === dummyPatient.id || rx.patientName === dummyPatient.name
  );

  const filteredPrescriptions = useMemo(() => {
    return myPrescriptions.filter((rx) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rx.doctorName.toLowerCase().includes(q) ||
          rx.diagnosis.toLowerCase().includes(q) ||
          rx.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [myPrescriptions, searchQuery]);

  const filteredLabReports = useMemo(() => {
    return patientLabReports.filter((report) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          report.testName.toLowerCase().includes(q) ||
          report.labName.toLowerCase().includes(q) ||
          report.findings.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setIsUploadModalOpen(false);
    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 3500);
    setReportTitle('');
  };

  return (
    <div>
      <PageHeader
        title="My Medical Records & Prescriptions"
        subtitle="Access your validated e-prescriptions, laboratory reports, and clinical consultation documents."
        actions={
          <Button variant="primary" onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={15} style={{ marginRight: 6 }} />
            Upload Medical Report
          </Button>
        }
      />

      {uploadSuccessToast && (
        <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #a7d0c3', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={18} /> Medical document successfully uploaded and linked to your health record!
        </div>
      )}

      {/* Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab${activeTab === 'all' ? ' active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Records ({filteredPrescriptions.length + filteredLabReports.length})
        </button>
        <button
          className={`filter-tab${activeTab === 'prescriptions' ? ' active' : ''}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          Doctor Prescriptions ({filteredPrescriptions.length})
        </button>
        <button
          className={`filter-tab${activeTab === 'labs' ? ' active' : ''}`}
          onClick={() => setActiveTab('labs')}
        >
          Lab & Diagnostic Reports ({filteredLabReports.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input-field has-icon"
              placeholder="Search by doctor, diagnosis, test name, or Rx ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── SECTION 1: E-PRESCRIPTIONS ── */}
      {(activeTab === 'all' || activeTab === 'prescriptions') && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Digital E-Prescriptions</div>
              <div className="card-subtitle">Issued by verified attending physicians</div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Prescription ID</th>
                  <th>Date</th>
                  <th>Prescribed By</th>
                  <th>Clinical Diagnosis</th>
                  <th>Medications</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((rx) => (
                  <tr key={rx.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{rx.id}</span>
                    </td>
                    <td>{rx.date}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rx.doctorName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>{rx.department}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{rx.diagnosis}</td>
                    <td>
                      <span className="badge badge-secondary">{rx.medicines.length} medicines</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Signed & Valid</span>
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedRx(rx)}
                      >
                        <Eye size={13} style={{ marginRight: 4 }} />
                        View Rx Pad
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SECTION 2: LAB REPORTS ── */}
      {(activeTab === 'all' || activeTab === 'labs') && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Laboratory & Diagnostic Reports</div>
              <div className="card-subtitle">Pathology, radiology, and blood investigations</div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Test Name</th>
                  <th>Date</th>
                  <th>Referred By</th>
                  <th>Laboratory</th>
                  <th>Result Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabReports.map((lab) => (
                  <tr key={lab.id}>
                    <td><strong>{lab.id}</strong></td>
                    <td style={{ fontWeight: 600 }}>{lab.testName}</td>
                    <td>{lab.date}</td>
                    <td>{lab.doctorName}</td>
                    <td>{lab.labName}</td>
                    <td>
                      <Badge
                        status={lab.status === 'Normal' ? 'confirmed' : 'pending'}
                        label={lab.status}
                      />
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedLabReport(lab)}
                      >
                        View Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRESCRIPTION PAD MODAL ── */}
      {selectedRx && (
        <div className="modal-overlay" onClick={() => setSelectedRx(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Medical Prescription &bull; {selectedRx.id}</h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Issued by {selectedRx.doctorName}</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRx(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="prescription-paper">
                <div className="rx-pad-header">
                  <div>
                    <div className="rx-clinic-name">MEDCONSULT CLINICAL SERVICES</div>
                    <div className="rx-clinic-sub">Department of General Medicine &bull; Online Telehealth Center</div>
                    <div className="rx-clinic-sub">14, MG Road, Bangalore &bull; Tel: +91 80 2345 6789</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{selectedRx.doctorName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>{dummyDoctor.qualification}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>License #{dummyDoctor.regNumber}</div>
                  </div>
                </div>

                <div className="rx-patient-meta-grid">
                  <div><strong>Patient:</strong> {dummyPatient.name}</div>
                  <div><strong>Age / Gender:</strong> {dummyPatient.age}y / {dummyPatient.gender}</div>
                  <div><strong>Date:</strong> {selectedRx.date}</div>
                  <div><strong>Blood Group:</strong> {dummyPatient.bloodGroup}</div>
                  <div><strong>Rx ID:</strong> {selectedRx.id}</div>
                  <div><strong>Department:</strong> {selectedRx.department}</div>
                </div>

                <div style={{ marginBottom: '14px', fontSize: '13px' }}>
                  <strong>Provisional / Final Diagnosis:</strong> {selectedRx.diagnosis}
                </div>

                <div className="rx-symbol">&#8478;</div>

                <table className="rx-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Medicine Name</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRx.medicines?.map((m, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                        <td>{m.dosage}</td>
                        <td>{m.frequency}</td>
                        <td>{m.duration}</td>
                        <td>{m.notes || m.instruction || 'After meals'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {selectedRx.dietAdvice && (
                  <div style={{ marginTop: '16px', fontSize: '12.5px', background: 'var(--bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Dietary / General Advice:</strong> {selectedRx.dietAdvice}
                  </div>
                )}

                <div className="rx-pad-footer">
                  <div style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                    Digitally generated & authenticated under National Telemedicine Guidelines.
                  </div>
                  <div className="doctor-sign-block">
                    <div className="doctor-signature-line">Dr. Priya Nair, MD</div>
                    <div style={{ fontSize: '11px', fontWeight: 600 }}>Attending Physician</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => window.print ? window.print() : alert('Print triggered')}
              >
                <Printer size={14} style={{ marginRight: 6 }} />
                Print / Download Rx
              </Button>
              <Button variant="primary" onClick={() => setSelectedRx(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── LAB REPORT MODAL ── */}
      {selectedLabReport && (
        <div className="modal-overlay" onClick={() => setSelectedLabReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{selectedLabReport.testName}</h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>ID: {selectedLabReport.id} &bull; {selectedLabReport.date}</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedLabReport(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <div><strong>Referring Doctor:</strong> {selectedLabReport.doctorName}</div>
                <div><strong>Laboratory:</strong> {selectedLabReport.labName}</div>
                <div><strong>Status:</strong> {selectedLabReport.status}</div>
                <div><strong>Patient:</strong> {dummyPatient.name}</div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', marginBottom: 4 }}>
                  CLINICAL FINDINGS & VALUES
                </div>
                <div style={{ fontSize: 13.5, background: '#fafbfa', border: '1px solid var(--border)', padding: 14, borderRadius: 'var(--radius-sm)', lineHeight: 1.6 }}>
                  {selectedLabReport.findings}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="primary" onClick={() => setSelectedLabReport(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD DOCUMENT MODAL ── */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleUploadSubmit}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Upload Health Document</h3>
                  <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Attach test results or external health records</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div>
                  <label className="input-label">Report or Document Title *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Thyroid Profile Test"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="input-label">Document Category</label>
                    <select
                      className="input-field"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="Blood Test">Blood Investigation</option>
                      <option value="Radiology">X-Ray / MRI / Scan</option>
                      <option value="Prescription">External Prescription</option>
                      <option value="Discharge">Hospital Discharge</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Consulting Doctor</label>
                    <input
                      type="text"
                      className="input-field"
                      value={reportDoctor}
                      onChange={(e) => setReportDoctor(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Select File (PDF, PNG, JPG)</label>
                  <input
                    type="file"
                    className="input-field"
                    style={{ padding: '6px' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Upload & Save to Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientRecords;
