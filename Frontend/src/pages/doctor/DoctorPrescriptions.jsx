import { useState, useMemo } from 'react';
import {
  FileText, Search, Plus, Printer, Eye,
  CheckCircle, X, Shield, Stethoscope
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import PrescriptionPad from '../../components/doctor/PrescriptionPad';
import { dummyPrescriptions, dummyDoctor, patients } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorPrescriptions() {
  const [prescriptionsList, setPrescriptionsList] = useState(dummyPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);
  const [isNewRxModalOpen, setIsNewRxModalOpen] = useState(false);

  // New Rx form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newDiet, setNewDiet] = useState('');
  const [meds, setMeds] = useState([
    { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instruction: 'After food' },
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
      { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instruction: 'After food' },
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
      dietAdvice: newDiet || 'Maintain hydration and standard nutritious diet.',
    };

    setPrescriptionsList((prev) => [newRx, ...prev]);
    setIsNewRxModalOpen(false);
    setSelectedRx(newRx);
    setNewDiagnosis('');
    setNewDiet('');
    setMeds([{ name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instruction: 'After meals' }]);
  };

  return (
    <div>
      <PageHeader
        title="Prescription Management"
        subtitle="Issue, review, and manage in-person clinical prescriptions and treatment orders."
        actions={
          <Button variant="primary" onClick={() => setIsNewRxModalOpen(true)}>
            <Plus size={15} style={{ marginRight: 6 }} />
            New Prescription
          </Button>
        }
      />

      {/* Search Toolbar */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="input-field has-icon"
              placeholder="Search prescriptions by patient name, diagnosis, or Rx ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Issued Prescriptions &amp; Treatment Orders</div>
            <div className="card-subtitle">Showing {filteredRecords.length} clinical prescriptions</div>
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
                <th>Prescribed Medicines</th>
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
                        {rx.medicines?.length || 0} medications
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">Signed &amp; Valid</span>
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
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Issued by {selectedRx.doctorName || dummyDoctor.name}</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRx(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <PrescriptionPad rx={selectedRx} doctor={dummyDoctor} />
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => window.print()}
              >
                <Printer size={14} style={{ marginRight: 6 }} />
                Print Prescription
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
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Issue New In-Person Prescription</h3>
                  <p style={{ fontSize: 12, color: 'var(--secondary)' }}>Create clinical prescription for outpatient visit</p>
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
                    placeholder="e.g. Acute Allergic Rhinitis, Seasonal Pharyngitis"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="input-label">Prescribed Medications</label>
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
                              placeholder="e.g. Amoxicillin 500mg"
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
                  <label className="input-label">Diet &amp; Special Clinical Advice</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Hydration advice, lifestyle precautions, dietary restrictions..."
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
                  Sign &amp; Issue Prescription
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorPrescriptions;

