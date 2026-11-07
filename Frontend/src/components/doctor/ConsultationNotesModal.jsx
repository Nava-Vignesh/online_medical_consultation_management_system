import { useState } from 'react';
import { X, CheckCircle, Plus, Trash2, Stethoscope, FileText, Activity } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

function ConsultationNotesModal({
  appointment,
  patient,
  doctor,
  isOpen,
  onClose,
  onCompleteConsultation,
}) {
  const [diagnosis, setDiagnosis] = useState('Acute Upper Respiratory Tract Infection with Fever');
  const [clinicalNotes, setClinicalNotes] = useState('Chest clear on auscultation. Mild congestion in pharynx. Normal pulse and blood pressure.');
  const [dietAdvice, setDietAdvice] = useState('Drink adequate warm fluids, maintain steam inhalation, rest for 2-3 days.');
  const [followUpDate, setFollowUpDate] = useState('2026-11-14');
  const [medications, setMedications] = useState([
    { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'Thrice daily', duration: '3 days', instruction: 'After food' },
    { name: 'Levocetirizine 5mg', dosage: '1 tablet', frequency: 'Once daily at night', duration: '5 days', instruction: 'Bedtime' },
  ]);

  if (!isOpen || !appointment) return null;

  const currentPatient = patient || {
    name: appointment.patientName,
    age: appointment.patientAge,
    gender: appointment.patientGender,
    id: appointment.patientId,
  };

  const handleAddMedication = () => {
    setMedications((prev) => [
      ...prev,
      { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instruction: 'After meals' },
    ]);
  };

  const handleRemoveMedication = (index) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    setMedications((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (onCompleteConsultation) {
      onCompleteConsultation({
        appointmentId: appointment.id,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        diagnosis,
        clinicalNotes,
        dietAdvice,
        followUpDate,
        medications,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleFinish}>
          <div className="modal-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Stethoscope size={18} color="var(--primary)" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>In-Person Consultation Notes &amp; Rx</h3>
              </div>
              <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                Patient: {currentPatient.name} ({currentPatient.age}y, {currentPatient.gender}) &bull; Apt ID: {appointment.id}
              </p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            {/* Vitals Summary */}
            {appointment.vitals && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary)', marginBottom: 6 }}>
                  PATIENT VITALS RECORDED AT CHECK-IN
                </div>
                <div className="vitals-summary-chips">
                  <div className="vital-chip">
                    <span className="vital-chip-label">BP</span>
                    <span className="vital-chip-value">{appointment.vitals.bp || '120/80'}</span>
                  </div>
                  <div className="vital-chip">
                    <span className="vital-chip-label">Pulse</span>
                    <span className="vital-chip-value">{appointment.vitals.pulse || '76 bpm'}</span>
                  </div>
                  <div className="vital-chip">
                    <span className="vital-chip-label">Temp</span>
                    <span className="vital-chip-value">{appointment.vitals.temp || '98.6 °F'}</span>
                  </div>
                  <div className="vital-chip">
                    <span className="vital-chip-label">Weight</span>
                    <span className="vital-chip-value">{appointment.vitals.weight || '70 kg'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chief Complaint */}
            <div style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary)' }}>Reported Symptoms: </span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{appointment.symptoms || 'General consultation'}</span>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="input-label" htmlFor="consult-diagnosis">Clinical Diagnosis *</label>
              <input
                id="consult-diagnosis"
                type="text"
                className="input-field"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Bronchitis, Type 2 Diabetes review"
              />
            </div>

            {/* Clinical Observations */}
            <div>
              <label className="input-label" htmlFor="consult-notes">Doctor's Clinical Observations &amp; Physical Examination</label>
              <textarea
                id="consult-notes"
                className="input-field"
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Details of physical examination, heart/lung sounds, palpation, etc."
              />
            </div>

            {/* Prescription items */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="input-label" style={{ margin: 0 }}>Prescribed Medications (Rx)</label>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddMedication}
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                >
                  <Plus size={12} style={{ marginRight: 3 }} /> Add Medication
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
                  {medications.map((m, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="rx-input"
                          required
                          placeholder="Medicine name"
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
                          <option value="SOS (As needed)">SOS (As needed)</option>
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
                          value={m.instruction}
                          onChange={(e) => handleMedChange(idx, 'instruction', e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)', padding: 2 }}
                          onClick={() => handleRemoveMedication(idx)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Diet & Follow-up */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div>
                <label className="input-label" htmlFor="consult-diet">Diet &amp; Lifestyle Advice</label>
                <input
                  id="consult-diet"
                  type="text"
                  className="input-field"
                  value={dietAdvice}
                  onChange={(e) => setDietAdvice(e.target.value)}
                  placeholder="Diet recommendations, hydration, rest"
                />
              </div>
              <div>
                <label className="input-label" htmlFor="consult-followup">Follow-up Date</label>
                <input
                  id="consult-followup"
                  type="date"
                  className="input-field"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <CheckCircle size={15} style={{ marginRight: 6 }} />
              Complete Consultation &amp; Save Rx
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConsultationNotesModal;

