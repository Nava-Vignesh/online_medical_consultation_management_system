import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff,
  MessageSquare, FileText, Activity, CheckCircle, Send,
  User, Clock, ShieldCheck, Stethoscope, AlertCircle
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { appointments, dummyPatient, dummyDoctor, dummyPrescriptions } from '../../data/dummyData';
import '../../styles/patient.css';

function PatientConsultations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const aptIdFromUrl = searchParams.get('aptId');
  const matchedApt = appointments.find((a) => a.id === aptIdFromUrl) || appointments[0];

  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'chat', 'vitals'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [callSeconds, setCallSeconds] = useState(542);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'doctor', text: `Hello ${dummyPatient.name}, Dr. Priya Nair here. How are you feeling today?`, time: '10:01 AM' },
    { sender: 'patient', text: `Good morning Doctor, I have had a continuous headache and fever since yesterday evening.`, time: '10:02 AM' },
    { sender: 'doctor', text: `Understood. Have you checked your temperature this morning?`, time: '10:03 AM' },
    { sender: 'patient', text: `Yes doctor, it was 99.1 °F around 8:00 AM.`, time: '10:04 AM' },
    { sender: 'doctor', text: `I am reviewing your symptoms and writing your prescription now.`, time: '10:06 AM' },
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
        sender: 'patient',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
  };

  return (
    <div>
      <PageHeader
        title="Telemedicine Virtual Consultation"
        subtitle={`Live encrypted session with: ${matchedApt.doctorName} (${matchedApt.doctorSpecialty || 'General Physician'})`}
        actions={
          <Button variant="secondary" onClick={() => navigate('/patient/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />

      <div className="consultation-room-container">
        {/* Left: Video Examination Screen */}
        <div className="patient-video-section">
          <div className="patient-video-screen">
            {isCallActive ? (
              <div className="live-badge">
                <span className="live-pulse" /> LIVE TELE-CONSULTATION
              </div>
            ) : (
              <div className="live-badge" style={{ background: '#7f8c8d' }}>
                SESSION ENDED
              </div>
            )}

            <div className="call-timer">
              <Clock size={13} /> {formatTimer(callSeconds)}
            </div>

            {/* Doctor Video Stream (Doctor is main view for patient) */}
            <div className="doctor-video-feed">
              <div className="doctor-feed-avatar">
                PN
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{matchedApt.doctorName}</h3>
              <p style={{ fontSize: '12.5px', opacity: '0.85', marginTop: '4px' }}>
                {dummyDoctor.qualification} &bull; {dummyDoctor.department}
              </p>
              <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '14px', fontSize: '11.5px' }}>
                <ShieldCheck size={14} color="#27ae60" /> End-to-End HIPAA Encrypted Audio/Video
              </div>
            </div>

            {/* Patient PIP Mini Feed */}
            <div className="pip-patient-video">
              {isVideoOff ? (
                <div style={{ color: '#aaa', fontSize: '10px' }}>Camera Off</div>
              ) : (
                <>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                    <User size={16} />
                  </div>
                  <div>You (Patient)</div>
                </>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="video-controls-bar">
            <button
              className={`control-btn${isMuted ? ' muted' : ''}`}
              onClick={() => setIsMuted((v) => !v)}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
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

            {isCallActive ? (
              <button
                className="control-btn end-call"
                onClick={() => setIsCallActive(false)}
                title="Leave Consultation"
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

        {/* Right: Consultation Details & Live Chat Panel */}
        <div className="consultation-panel">
          <div className="panel-tabs-header">
            <button
              className={`panel-tab-btn${activeTab === 'notes' ? ' active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <FileText size={14} style={{ display: 'inline', marginRight: 4 }} />
              Live Prescription
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
              My Vitals
            </button>
          </div>

          {/* TAB 1: Real-Time Prescription from Doctor */}
          {activeTab === 'notes' && (
            <div className="panel-tab-content">
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)' }}>
                  DOCTOR'S PROVISIONAL DIAGNOSIS
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text)', marginTop: 4, background: 'var(--bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  Acute Upper Respiratory Tract Infection (Viral Pharyngitis)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)', marginBottom: 6 }}>
                  PRESCRIBED MEDICINES (Rx)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ border: '1px solid var(--border)', padding: '10px', borderRadius: 'var(--radius-sm)', background: '#fafbfa' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '13px' }}>1. Paracetamol 650mg</div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: 2 }}>Dosage: 1 tab &bull; Thrice daily &bull; 3 days</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>Instruction: Take after meals if temperature > 99.5F</div>
                  </div>
                  <div style={{ border: '1px solid var(--border)', padding: '10px', borderRadius: 'var(--radius-sm)', background: '#fafbfa' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '13px' }}>2. Levocetirizine 5mg</div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: 2 }}>Dosage: 1 tab &bull; Nightly &bull; 5 days</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>Instruction: Take at bedtime</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)' }}>
                  DOCTOR'S DIETARY & HEALTH ADVICE
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text)', background: 'var(--bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: 4, lineHeight: 1.5 }}>
                  Drink plenty of warm fluids, steam inhalation twice a day, avoid cold beverages, and rest.
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <Button
                  variant="primary"
                  style={{ width: '100%' }}
                  onClick={() => navigate('/patient/records')}
                >
                  <FileText size={15} style={{ marginRight: 6 }} />
                  View & Download Full Prescription
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: Live Chat */}
          {activeTab === 'chat' && (
            <div className="panel-tab-content">
              <div className="chat-messages-container">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-bubble ${msg.sender === 'patient' ? 'from-doctor' : 'from-patient'}`}
                    style={msg.sender === 'patient' ? { alignSelf: 'flex-end', background: 'var(--primary)', color: '#fff' } : {}}
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
                  onClick={() => setInputMsg('Doctor, do I need to schedule a follow-up test?')}
                >
                  Ask about follow-up
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => setInputMsg('Thank you, Doctor Priya!')}
                >
                  Thank doctor
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Type message to doctor..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                />
                <Button type="submit" variant="primary" size="sm">
                  <Send size={14} />
                </Button>
              </form>
            </div>
          )}

          {/* TAB 3: My Vitals & Symptoms */}
          {activeTab === 'vitals' && (
            <div className="panel-tab-content">
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '4px' }}>
                  RECORDED VITALS
                </div>
                <div className="vitals-summary-chips">
                  <div className="vital-chip">
                    <span className="vital-chip-label">Blood Pressure</span>
                    <span className="vital-chip-value">{matchedApt?.vitals?.bp || '125/82'}</span>
                  </div>
                  <div className="vital-chip">
                    <span className="vital-chip-label">Pulse</span>
                    <span className="vital-chip-value">{matchedApt?.vitals?.pulse || '76 bpm'}</span>
                  </div>
                  <div className="vital-chip">
                    <span className="vital-chip-label">Body Temp</span>
                    <span className="vital-chip-value">{matchedApt?.vitals?.temp || '99.1 °F'}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fdf2f2', border: '1px solid #fecaca', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--danger)' }}>
                  KNOWN DRUG ALLERGIES
                </div>
                <div style={{ fontSize: '13px', color: '#991b1b', marginTop: '2px', fontWeight: 600 }}>
                  {dummyPatient.allergies}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '4px' }}>
                  REPORTED SYMPTOMS
                </div>
                <div style={{ fontSize: '13px', background: 'var(--bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  {matchedApt?.symptoms}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientConsultations;
