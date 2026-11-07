import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff,
  Share2, MessageSquare, FileText, Activity, Plus, Trash2,
  CheckCircle, AlertCircle, Send, User, Clock, ShieldCheck
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { appointments, patients, dummyDoctor } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorConsultations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const aptIdFromUrl = searchParams.get('aptId');
  const patientIdFromUrl = searchParams.get('patientId');

  // Match appointment or default to first confirmed one
  const matchedApt = appointments.find(
    (a) => a.id === aptIdFromUrl || a.patientId === patientIdFromUrl
  ) || appointments[0];

  const matchedPatient = patients.find(
    (p) => p.id === matchedApt?.patientId || p.name === matchedApt?.patientName
  ) || patients[0];

  // Active state
  const [currentApt, setCurrentApt] = useState(matchedApt);
  const [currentPatient, setCurrentPatient] = useState(matchedPatient);

  // Video call controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [callSeconds, setCallSeconds] = useState(542); // 9:02 start
  const [activeTab, setActiveTab] = useState('prescription'); // 'prescription', 'chat', 'vitals'

  // Prescription Form state
  const [diagnosis, setDiagnosis] = useState('Acute Upper Respiratory Tract Infection with Fever');
  const [clinicalNotes, setClinicalNotes] = useState('Patient throat congested, chest clear, temperature 99.1F.');
  const [dietAdvice, setDietAdvice] = useState('Drink warm water, saline gargling twice daily, rest.');
  const [medications, setMedications] = useState([
    { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'Thrice daily', duration: '3 days', instruction: 'After food' },
    { name: 'Levocetirizine 5mg', dosage: '1 tablet', frequency: 'Once daily at night', duration: '5 days', instruction: 'Bedtime' },
  ]);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'doctor', text: `Hello ${matchedPatient.name}, Dr. Priya Nair here. How are you feeling today?`, time: '10:01 AM' },
    { sender: 'patient', text: `Good morning Doctor, I have had a continuous headache and fever since yesterday evening.`, time: '10:02 AM' },
    { sender: 'doctor', text: `Understood. Have you checked your temperature this morning?`, time: '10:03 AM' },
    { sender: 'patient', text: `Yes doctor, it was 99.1 °F around 8:00 AM.`, time: '10:04 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Call timer effect
  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'doctor',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
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

  const handleFinishConsultation = () => {
    setIsCallActive(false);
    setIsCompletedModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Telemedicine Consultation Room"
        subtitle={`Live encrypted consultation session with patient: ${currentPatient.name}`}
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>Patient Switcher:</span>
            <select
              className="input-field"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '12px' }}
              value={currentApt?.id}
              onChange={(e) => {
                const apt = appointments.find((a) => a.id === e.target.value);
                if (apt) {
                  setCurrentApt(apt);
                  const p = patients.find((p) => p.id === apt.patientId || p.name === apt.patientName);
                  if (p) setCurrentPatient(p);
                }
              }}
            >
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.patientName} &mdash; {a.time} ({a.type})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Consultation Main Workspace */}
      <div className="consultation-room-container">
        {/* Left Video Area */}
        <div className="video-section">
          <div className="video-screen">
            {/* Live Indicator */}
            {isCallActive ? (
              <div className="live-badge">
                <span className="live-pulse" /> LIVE TELE-CONSULTATION
              </div>
            ) : (
              <div className="live-badge" style={{ background: '#7f8c8d' }}>
                SESSION ENDED
              </div>
            )}

            {/* Timer */}
            <div className="call-timer">
              <Clock size={13} /> {formatTimer(callSeconds)}
            </div>

            {/* Patient Video Stream View */}
            <div className="patient-video-stream">
              <div className="patient-video-avatar">
                {currentPatient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{currentPatient.name}</h3>
              <p style={{ fontSize: '12.5px', opacity: '0.8', marginTop: '4px' }}>
                {currentPatient.age} yrs &bull; {currentPatient.gender} &bull; Blood: {currentPatient.bloodGroup}
              </p>
              <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '14px', fontSize: '11.5px' }}>
                <ShieldCheck size={14} color="#27ae60" /> End-to-End HIPAA Encrypted Audio/Video
              </div>
            </div>

            {/* Doctor PIP Mini Feed */}
            <div className="pip-doctor-video">
              {isVideoOff ? (
                <div style={{ color: '#aaa', fontSize: '10px' }}>Camera Off</div>
              ) : (
                <>
                  <div className="pip-avatar">
                    <User size={18} />
                  </div>
                  <div>You (Dr. Priya)</div>
                </>
              )}
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="video-controls-bar">
            <button
              className={`control-btn${isMuted ? ' muted' : ''}`}
              onClick={() => setIsMuted((v) => !v)}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              className={`control-btn${isVideoOff ? ' off' : ''}`}
              onClick={() => setIsVideoOff((v) => !v)}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff size={18} /> : <VideoIcon size={18} />}
            </button>

            <button
              className="control-btn"
              onClick={() => alert('Screen share simulated: presentation active.')}
              title="Share Screen"
            >
              <Share2 size={18} />
            </button>

            {isCallActive ? (
              <button
                className="control-btn end-call"
                onClick={handleFinishConsultation}
                title="End Consultation"
              >
                <PhoneOff size={20} />
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsCallActive(true);
                  setCallSeconds(0);
                }}
              >
                Reconnect Call
              </button>
            )}
          </div>
        </div>

        {/* Right Side Consultation Panel */}
        <div className="consultation-panel">
          <div className="panel-tabs-header">
            <button
              className={`panel-tab-btn${activeTab === 'prescription' ? ' active' : ''}`}
              onClick={() => setActiveTab('prescription')}
            >
              <FileText size={14} style={{ display: 'inline', marginRight: 4 }} />
              Prescription & Notes
            </button>
            <button
              className={`panel-tab-btn${activeTab === 'chat' ? ' active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={14} style={{ display: 'inline', marginRight: 4 }} />
              In-Call Chat
            </button>
            <button
              className={`panel-tab-btn${activeTab === 'vitals' ? ' active' : ''}`}
              onClick={() => setActiveTab('vitals')}
            >
              <Activity size={14} style={{ display: 'inline', marginRight: 4 }} />
              Vitals & History
            </button>
          </div>

          {/* TAB 1: E-Prescription & Clinical Notes */}
          {activeTab === 'prescription' && (
            <div className="panel-tab-content">
              <div>
                <label className="input-label">Chief Diagnosis *</label>
                <input
                  type="text"
                  className="input-field"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Bronchitis"
                />
              </div>

              <div>
                <label className="input-label">Clinical Observations & Examination</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Doctor's clinical findings..."
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="input-label">Prescribed Medications (Rx)</label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddMedication}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    <Plus size={12} style={{ marginRight: 2 }} /> Add Medicine
                  </button>
                </div>

                <table className="rx-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Days</th>
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
                            style={{ width: '70px' }}
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
                            <option value="SOS (As needed)">SOS (Needed)</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="rx-input"
                            style={{ width: '60px' }}
                            value={med.duration}
                            onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
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

              <div>
                <label className="input-label">Diet & Lifestyle Advice</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={dietAdvice}
                  onChange={(e) => setDietAdvice(e.target.value)}
                  placeholder="Dietary instructions, hydration, rest..."
                />
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <Button
                  variant="primary"
                  className="btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleFinishConsultation}
                >
                  <CheckCircle size={16} style={{ marginRight: 6 }} />
                  Complete Consultation & Issue Rx
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: Live In-Call Chat */}
          {activeTab === 'chat' && (
            <div className="panel-tab-content">
              <div className="chat-messages-container">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-bubble ${msg.sender === 'doctor' ? 'from-doctor' : 'from-patient'}`}
                  >
                    <div>{msg.text}</div>
                    <div className="chat-time">{msg.time}</div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => setInputMsg('Please ensure you are in a well-lit room.')}
                >
                  Lighting check
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => setInputMsg('I am generating your e-prescription now.')}
                >
                  Generating Rx
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Type message to patient..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                />
                <Button type="submit" variant="primary" size="sm">
                  <Send size={14} />
                </Button>
              </form>
            </div>
          )}

          {/* TAB 3: Vitals & Medical History */}
          {activeTab === 'vitals' && (
            <div className="panel-tab-content">
              <div className="patient-badge-row">
                <span className="badge badge-secondary">Age: {currentPatient.age}</span>
                <span className="badge badge-secondary">Gender: {currentPatient.gender}</span>
                <span className="badge badge-success">Blood: {currentPatient.bloodGroup}</span>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '4px' }}>
                  RECORDED VITALS
                </div>
                <div className="vitals-summary-chips">
                  <div className="vital-chip">
                    <span className="vital-chip-label">BP</span>
                    <span className="vital-chip-value">{currentApt?.vitals?.bp || '120/80'}</span>
                  </div>
                  <div className="vital-chip">
                    <span className="vital-chip-label">Heart Rate</span>
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

              <div style={{ background: '#fdf2f2', border: '1px solid #fecaca', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--danger)' }}>
                  DOCUMENTED ALLERGIES
                </div>
                <div style={{ fontSize: '13px', color: '#991b1b', marginTop: '2px' }}>
                  {currentPatient.allergies || 'No known allergies reported.'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '4px' }}>
                  CHRONIC HEALTH CONDITIONS
                </div>
                <div style={{ fontSize: '13px', background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                  {currentPatient.chronicConditions || 'None reported.'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '4px' }}>
                  REPORTED SYMPTOMS
                </div>
                <div style={{ fontSize: '13px', background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                  {currentApt?.symptoms || 'General wellness check'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Summary & Prescription Issue Modal */}
      {isCompletedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                  Consultation Concluded &mdash; E-Prescription Issued
                </h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  Reference #{currentApt?.id || 'APT001'} &bull; Digital Signature Verified
                </p>
              </div>
            </div>

            <div className="modal-body">
              <div className="prescription-paper">
                <div className="rx-pad-header">
                  <div>
                    <div className="rx-clinic-name">MEDCONSULT CLINICAL SERVICES</div>
                    <div className="rx-clinic-sub">Department of General Medicine & Telehealth</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{dummyDoctor.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--secondary)' }}>{dummyDoctor.qualification}</div>
                    <div style={{ fontSize: '11px', color: 'var(--secondary)' }}>Reg. {dummyDoctor.regNumber}</div>
                  </div>
                </div>

                <div className="rx-patient-meta-grid">
                  <div><strong>Patient:</strong> {currentPatient.name}</div>
                  <div><strong>Age/Gender:</strong> {currentPatient.age}y / {currentPatient.gender}</div>
                  <div><strong>Date:</strong> 2026-11-07</div>
                  <div><strong>Blood Group:</strong> {currentPatient.bloodGroup}</div>
                  <div><strong>Diagnosis:</strong> {diagnosis}</div>
                  <div><strong>Consultation:</strong> Online Tele-Health</div>
                </div>

                <div className="rx-symbol">&#8478;</div>

                <table className="rx-table" style={{ marginTop: '4px' }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Medication & Strength</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((m, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{m.name || 'Prescribed Medicine'}</td>
                        <td>{m.dosage}</td>
                        <td>{m.frequency}</td>
                        <td>{m.duration}</td>
                        <td>{m.instruction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: '16px', fontSize: '12.5px' }}>
                  <strong>Diet / Special Instructions:</strong> {dietAdvice}
                </div>

                <div className="rx-pad-footer">
                  <div style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                    Digitally generated via MedConsult Tele-Health. Valid per Medical Council regulations.
                  </div>
                  <div className="doctor-sign-block">
                    <div className="doctor-signature-line">Priya Nair, MD</div>
                    <div style={{ fontSize: '11px', fontWeight: 600 }}>Authorized Signatory</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  navigate('/doctor/records');
                }}
              >
                Go to Records
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
