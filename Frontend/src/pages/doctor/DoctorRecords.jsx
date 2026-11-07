import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Search, Plus, Printer, Download, Eye,
  Calendar, User, CheckCircle, X, Shield
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { dummyPrescriptions, dummyDoctor, patients } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorRecords() {
  const navigate = useNavigate();
  const [prescriptionsList, setPrescriptionsList] = useState(dummyPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);
  const [isNewRxModalOpen, setIsNewRxModalOpen] = useState(false);

  // New Rx form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newDiet, setNewDiet] = useState('');
  const [meds, setMeds] = useState([
    { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', notes: 'After meals' },
  ]);

  const filteredRecords = useMemo(() => {
    return prescriptionsList.filter((rx) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rx.patientName.toLowerCase().includes(q) ||
          rx.id.toLowerCase().includes(q) ||
          rx.diagnosis.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [prescriptionsList, searchQuery]);

  const handleAddMedRow = () => {
    setMeds((prev) => [
      ...prev,
      { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', notes: 'After food' },
    ]);
  };

  const handleRemoveMedRow = (idx) => {
    setMeds((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMedChange = (index, field, val) => {
    setMeds((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: val } : m)));
  };

  const handleCreateRx = (e) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === patientId) || patients[0];
    const newRx = {
      id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientAge: patientObj.age,
      patientGender: patientObj.gender,
      date: new Date().toISOString().split('T')[0],
      diagnosis: newDiagnosis,
      doctorName: dummyDoctor.name,
      department: dummyDoctor.department,
      medicines: meds,
      dietAdvice: newDiet || 'Maintain hydration and standard diet.',
    };

    setPrescriptionsList((prev) => [newRx, ...prev]);
    setIsNewRxModalOpen(false);
    setSelectedRx(newRx);
    // Reset
    setNewDiagnosis('');
    setNewDiet('');
    setMeds([{ name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', notes: 'After meals' }]);
  };

  return (
    <div>
      <PageHeader
        title="Medical Records & Prescriptions"
        subtitle="Manage official e-prescriptions, clinical notes, and patient consultation archives."
        actions={
          <Button variant="primary" onClick={() => setIsNewRxModalOpen(true)}>
            <Plus size={15} style={{ marginRight: 6 }} />
            Create New Prescription
          </Button>
        }
      />

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
              placeholder="Search records by patient name, diagnosis, or Rx ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Issued Prescriptions & Clinical Documents</div>
            <div className="card-subtitle">Showing {filteredRecords.length} validated records</div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rx ID</th>
                <th>Patient</th>
                <th>Issued Date</th>
                <th>Clinical Diagnosis</th>
                <th>Medications Count</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ color: 'var(--secondary)' }}>No prescriptions match your query.</div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rx) => (
                  <tr key={rx.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{rx.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rx.patientName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                        {rx.patientAge}y &bull; {rx.patientGender}
                      </div>
                    </td>
                    <td>{rx.date}</td>
                    <td style={{ maxWidth: '240px', fontWeight: 500 }}>{rx.diagnosis}</td>
                    <td>
                      <span className="badge badge-secondary">
                        {rx.medicines?.length || 0} drugs prescribed
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">Signed & Valid</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedRx(rx)}
                        >
                          <Eye size={13} style={{ marginRight: 4 }} />
                          View Rx
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Pad View Modal */}
      {selectedRx && (
        <div className="modal-overlay" onClick={() => setSelectedRx(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Medical Prescription &mdash; {selectedRx.id}</h3>
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
                    <div className="rx-clinic-sub">Department of General Medicine &bull; Outpatient Consultation Centre</div>
                    <div className="rx-clinic-sub">14, MG Road, Bangalore &bull; Tel: +91 80 2345 6789</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{dummyDoctor.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>{dummyDoctor.qualification}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>License #{dummyDoctor.regNumber}</div>
                  </div>
                </div>

                <div className="rx-patient-meta-grid">
                  <div><strong>Patient:</strong> {selectedRx.patientName}</div>
                  <div><strong>Age / Gender:</strong> {selectedRx.patientAge}y / {selectedRx.patientGender}</div>
                  <div><strong>Date:</strong> {selectedRx.date}</div>
                  <div><strong>Rx ID:</strong> {selectedRx.id}</div>
                  <div><strong>Doctor:</strong> {selectedRx.doctorName}</div>
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
                    Digitally signed & authorized under Medical Council of India (MCI) guidelines.
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
                onClick={() => window.print ? window.print() : alert('Print simulated')}
              >
                <Printer size={14} style={{ marginRight: 6 }} />
                Print Rx
              </Button>
              <Button variant="primary" onClick={() => setSelectedRx(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Prescription Creator Modal */}
      {isNewRxModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewRxModalOpen(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateRx}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Issue New E-Prescription</h3>
                  <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Draft digital prescription and medications</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsNewRxModalOpen(false)}
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
                  <label className="input-label">Clinical Diagnosis *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Acute Allergic Rhinitis"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="input-label">Prescribed Medicines</label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddMedRow}
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      <Plus size={12} style={{ marginRight: 3 }} /> Add Row
                    </button>
                  </div>

                  <table className="rx-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th>Instructions</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {meds.map((m, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              className="rx-input"
                              placeholder="e.g. Azithromycin 500mg"
                              required
                              value={m.name}
                              onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="rx-input"
                              style={{ width: '70px' }}
                              value={m.dosage}
                              onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              className="rx-input"
                              value={m.frequency}
                              onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                            >
                              <option value="Once daily">Once daily</option>
                              <option value="Twice daily">Twice daily</option>
                              <option value="Thrice daily">Thrice daily</option>
                              <option value="SOS (As needed)">SOS</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="rx-input"
                              style={{ width: '60px' }}
                              value={m.duration}
                              onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="rx-input"
                              placeholder="After meals"
                              value={m.notes}
                              onChange={(e) => handleMedChange(idx, 'notes', e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--danger)', padding: 2 }}
                              onClick={() => handleRemoveMedRow(idx)}
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <label className="input-label">Diet & Special Instructions</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Hydration advice, lifestyle precautions..."
                    value={newDiet}
                    onChange={(e) => setNewDiet(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setIsNewRxModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Sign & Issue Prescription
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorRecords;
