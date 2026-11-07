import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText, Activity, Plus, Trash2,
  CheckCircle, AlertCircle, User, Clock, Stethoscope,
  ClipboardList, Calendar, Printer
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import PrescriptionPad from '../../components/doctor/PrescriptionPad';
import { appointments, patients, dummyDoctor, consultationRecords } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorConsultations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const aptIdFromUrl = searchParams.get('aptId');
  const patientIdFromUrl = searchParams.get('patientId');

  const matchedApt = appointments.find(
    (a) => a.id === aptIdFromUrl || a.patientId === patientIdFromUrl
  ) || appointments[0];

  const matchedPatient = patients.find(
    (p) => p.id === matchedApt?.patientId || p.name === matchedApt?.patientName
  ) || patients[0];

  const [currentApt, setCurrentApt] = useState(matchedApt);
  const [currentPatient, setCurrentPatient] = useState(matchedPatient);
  const [activeTab, setActiveTab] = useState('prescription'); // 'prescription', 'notes', 'history'

  // Consultation state
  const [diagnosis, setDiagnosis] = useState('Acute Upper Respiratory Tract Infection with Fever');
  const [clinicalNotes, setClinicalNotes] = useState('Patient presented with 2-day sore throat and low-grade pyrexia. Chest clear on auscultation. Pharyngeal erythema present without tonsillar exudates.');
  const [dietAdvice, setDietAdvice] = useState('Drink warm saline water, maintain hydration, rest for 3 days, avoid chilled items.');
  const [followUpDate, setFollowUpDate] = useState('2026-11-14');
  const [consultationStatus, setConsultationStatus] = useState('in-progress');

  const [medications, setMedications] = useState([
    { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'Thrice daily', duration: '3 days', instruction: 'After meals' },
    { name: 'Levocetirizine 5mg', dosage: '1 tablet', frequency: 'Once daily at night', duration: '5 days', instruction: 'At bedtime' },
    { name: 'Vitamin C 500mg', dosage: '1 tablet', frequency: 'Once daily', duration: '10 days', instruction: 'Morning chewable' },
  ]);

  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [completedRx, setCompletedRx] = useState(null);

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

  const handleFinishConsultation = () => {
    const rx = {
      id: `RX-${Math.floor(2000 + Math.random() * 8000)}`,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientAge: currentPatient.age,
      patientGender: currentPatient.gender,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      doctorName: dummyDoctor.name,
      department: dummyDoctor.department,
      medicines: medications,
      dietAdvice,
    };
    setCompletedRx(rx);
    setConsultationStatus('completed');
    setIsCompletedModalOpen(true);
  };

  // Past consultations for current patient
  const patientPastRecords = consultationRecords.filter(
    (r) => r.patientId === currentPatient.id || r.patientName === currentPatient.name
  );

  return (
    <div>
      <PageHeader
        title="In-Person Consultation Workspace"
        subtitle={`Clinical examination and diagnostic notes for: ${currentPatient.name}`}
        actions={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>Patient Switcher:</span>
            <select
              className="input-field"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '12.5px' }}
              value={currentApt?.id}
              onChange={(e) => {
                const apt = appointments.find((a) => a.id === e.target.value);
                if (apt) {
                  setCurrentApt(apt);
                  const p = patients.find((pat) => pat.id === apt.patientId || pat.name === apt.patientName);
                  if (p) setCurrentPatient(p);
                }
              }}
            >
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.patientName} &mdash; {a.time} ({a.room || 'Room 3B'})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Main Workspace Two-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Patient Record, Vitals & Clinical Findings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Patient Card */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{currentPatient.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  Patient ID: {currentPatient.id} &bull; Room: {currentApt?.room || 'Room 3B'}
                </p>
              </div>
              <Badge
                status={consultationStatus === 'completed' ? 'completed' : 'confirmed'}
                label={consultationStatus === 'completed' ? 'Completed' : 'In Consultation'}
              />
            </div>

            <div className="patient-badge-row" style={{ marginBottom: 12 }}>
              <span className="badge badge-secondary">{currentPatient.gender}, {currentPatient.age} yrs</span>
              <span className="badge badge-success">Blood: {currentPatient.bloodGroup}</span>
              <span className="badge badge-warning">{currentPatient.totalVisits || 1} Total Visits</span>
            </div>

            {/* Vitals */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--secondary)', marginBottom: 6 }}>
                CLINIC CHECK-IN VITALS
              </div>
              <div className="vitals-summary-chips">
                <div className="vital-chip">
                  <span className="vital-chip-label">BP</span>
                  <span className="vital-chip-value">{currentApt?.vitals?.bp || '120/80'}</span>
                </div>
                <div className="vital-chip">
                  <span className="vital-chip-label">Pulse</span>
                  <span className="vital-chip-value">{currentApt?.vitals?.pulse || '76 bpm'}</span>
                </div>
                <div className="vital-chip">
                  <span className="vital-chip-label">Temp</span>
                  <span className="vital-chip-value">{currentApt?.vitals?.temp || '98.6 °F'}</span>
                </div>
                <div className="vital-chip">
                  <span className="vital-chip-label">Weight</span>
                  <span className="vital-chip-value">{currentApt?.vitals?.weight || '72 kg'}</span>
                </div>
              </div>
            </div>

            {/* Allergies Notice */}
            <div
              style={{
                background: currentPatient.allergies && currentPatient.allergies !== 'None' ? '#fdf2f2' : 'var(--bg)',
                border: `1px solid ${currentPatient.allergies && currentPatient.allergies !== 'None' ? '#fca5a5' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={13} /> KNOWN DRUG ALLERGIES
              </div>
              <div style={{ fontSize: 13, color: '#991b1b', fontWeight: 500, marginTop: 2 }}>
                {currentPatient.allergies || 'No documented allergies.'}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--secondary)', marginBottom: 4 }}>
                CHRONIC CONDITIONS
              </div>
              <div style={{ fontSize: 13, background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                {currentPatient.chronicConditions || 'None reported.'}
              </div>
            </div>

            {/* Chief Complaint */}
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--secondary)', marginBottom: 4 }}>
                PRESENTING SYMPTOMS / CHIEF COMPLAINT
              </div>
              <div style={{ fontSize: 13, background: '#fdfdfd', borderLeft: '3px solid var(--primary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                {currentApt?.symptoms || 'General clinical review'}
              </div>
            </div>
          </div>

          {/* Clinical Examination Input */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header" style={{ marginBottom: 10 }}>
              <div className="card-title">Doctor's Physical Examination &amp; Notes</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="input-label">Clinical Diagnosis *</label>
                <input
                  type="text"
                  className="input-field"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Pharyngitis"
                />
              </div>

              <div>
                <label className="input-label">Physical Examination Observations</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Auscultation, palpation, lymphadenopathy, general condition..."
                />
              </div>

              <div>
                <label className="input-label">Follow-up Consultation Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prescription Builder, Notes & History Tabs */}
        <div className="consultation-panel">
          <div className="panel-tabs-header">
            <button
              className={`panel-tab-btn${activeTab === 'prescription' ? ' active' : ''}`}
              onClick={() => setActiveTab('prescription')}
            >
              <FileText size={14} style={{ display: 'inline', marginRight: 4 }} />
              Prescription (Rx)
            </button>
            <button
              className={`panel-tab-btn${activeTab === 'notes' ? ' active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <ClipboardList size={14} style={{ display: 'inline', marginRight: 4 }} />
              Diet &amp; Lifestyle
            </button>
            <button
              className={`panel-tab-btn${activeTab === 'history' ? ' active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Activity size={14} style={{ display: 'inline', marginRight: 4 }} />
              Medical History ({patientPastRecords.length})
            </button>
          </div>

          {/* TAB 1: Prescription Builder */}
          {activeTab === 'prescription' && (
            <div className="panel-tab-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Prescribed Medications ({medications.length})</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddMedication}
                  style={{ fontSize: 11.5 }}
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
                    <th>Days</th>
                    <th>Instructions</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="rx-input"
                          placeholder="Medicine name"
                          value={med.name}
                          onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="rx-input"
                          style={{ width: '65px' }}
                          value={med.dosage}
                          onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="rx-input"
                          value={med.frequency}
                          onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        >
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Thrice daily">Thrice daily</option>
                          <option value="SOS (Needed)">SOS (Needed)</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="rx-input"
                          style={{ width: '55px' }}
                          value={med.duration}
                          onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="rx-input"
                          placeholder="Instructions"
                          value={med.instruction}
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

              <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                <Button
                  variant="primary"
                  className="btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleFinishConsultation}
                >
                  <CheckCircle size={16} style={{ marginRight: 6 }} />
                  Complete In-Person Consultation &amp; Issue Rx
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: Diet & Advice */}
          {activeTab === 'notes' && (
            <div className="panel-tab-content">
              <div>
                <label className="input-label">Dietary &amp; Hydration Guidance</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={dietAdvice}
                  onChange={(e) => setDietAdvice(e.target.value)}
                  placeholder="Specify dietary instructions, fluid intake, and restrictions..."
                />
              </div>

              <div>
                <label className="input-label">Clinical Discharge Remarks</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Patient counseled on alarm symptoms. In case of worsening fever or chest discomfort, report immediately to ER."
                />
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                <Button
                  variant="primary"
                  className="btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleFinishConsultation}
                >
                  <CheckCircle size={16} style={{ marginRight: 6 }} />
                  Complete Consultation &amp; Issue Rx
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: Medical History */}
          {activeTab === 'history' && (
            <div className="panel-tab-content">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Previous Consultations for {currentPatient.name}
              </div>

              {patientPastRecords.length === 0 ? (
                <div style={{ color: 'var(--secondary)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                  No prior consultation records on file for this patient.
                </div>
              ) : (
                patientPastRecords.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 12,
                      background: '#fafbfa',
                      fontSize: 13,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: 4 }}>
                      <span style={{ color: 'var(--primary)' }}>{rec.diagnosis}</span>
                      <span style={{ color: 'var(--secondary)', fontSize: 12 }}>{rec.date}</span>
                    </div>
                    <div style={{ color: 'var(--text)', fontSize: 12.5, marginBottom: 6 }}>
                      {rec.clinicalNotes}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                      Follow-up: {rec.followUp} &bull; Attending: {rec.doctorName}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {isCompletedModalOpen && completedRx && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                  In-Person Consultation Completed &mdash; Prescription Issued
                </h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  Reference #{currentApt?.id} &bull; Verified by {dummyDoctor.name}
                </p>
              </div>
            </div>

            <div className="modal-body">
              <PrescriptionPad rx={completedRx} doctor={dummyDoctor} />
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => window.print()}
              >
                <Printer size={14} style={{ marginRight: 6 }} />
                Print Prescription
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  navigate('/doctor/prescriptions');
                }}
              >
                View Prescriptions
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  navigate('/doctor/dashboard');
                }}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorConsultations;
