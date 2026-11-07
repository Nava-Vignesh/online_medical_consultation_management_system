import { Printer } from 'lucide-react';
import Button from '../common/Button';

function PrescriptionPad({ rx, doctor, onPrint }) {
  if (!rx) return null;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="prescription-paper">
      <div className="rx-pad-header">
        <div>
          <div className="rx-clinic-name">MEDCONSULT CLINICAL SERVICES</div>
          <div className="rx-clinic-sub">Department of General Medicine &bull; Outpatient Consultation Centre</div>
          <div className="rx-clinic-sub">14, MG Road, Bangalore &bull; Tel: +91 80 2345 6789</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{rx.doctorName || doctor?.name}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>{doctor?.qualification || 'MBBS, MD (General Medicine)'}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--secondary)' }}>Reg. #{doctor?.regNumber || 'MCI-2014-89211'}</div>
        </div>
      </div>

      <div className="rx-patient-meta-grid">
        <div><strong>Patient:</strong> {rx.patientName}</div>
        <div><strong>Age / Gender:</strong> {rx.patientAge}y / {rx.patientGender}</div>
        <div><strong>Date:</strong> {rx.date}</div>
        <div><strong>Rx ID:</strong> {rx.id}</div>
        <div><strong>Consultation:</strong> In-Person Clinical Visit</div>
        <div><strong>Department:</strong> {rx.department || doctor?.department || 'General Medicine'}</div>
      </div>

      <div style={{ marginBottom: '14px', fontSize: '13px' }}>
        <strong>Clinical Diagnosis:</strong> {rx.diagnosis}
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
          {rx.medicines?.map((m, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td style={{ fontWeight: 600 }}>{m.name}</td>
              <td>{m.dosage}</td>
              <td>{m.frequency}</td>
              <td>{m.duration}</td>
              <td>{m.instruction || m.notes || 'After meals'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {rx.dietAdvice && (
        <div style={{ marginTop: '16px', fontSize: '12.5px', background: 'var(--bg)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
          <strong>Dietary & Lifestyle Advice:</strong> {rx.dietAdvice}
        </div>
      )}

      <div className="rx-pad-footer">
        <div style={{ fontSize: '11px', color: 'var(--secondary)', maxWidth: '65%' }}>
          Digitally generated via MedConsult Clinical Outpatient Management System. Compliant with Medical Council of India (MCI) standards.
        </div>
        <div className="doctor-sign-block">
          <div className="doctor-signature-line">{rx.doctorName || doctor?.name}</div>
          <div style={{ fontSize: '11px', fontWeight: 600 }}>Authorized Medical Practitioner</div>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionPad;

