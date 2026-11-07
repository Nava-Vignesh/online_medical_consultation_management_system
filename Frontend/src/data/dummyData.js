// ─── Dummy Data ───────────────────────────────────────────────────
// Used as placeholder data for all three portals.

export const dummyPatient = {
  id: 'P001',
  name: 'Arjun Sharma',
  age: 32,
  gender: 'Male',
  bloodGroup: 'O+',
  email: 'arjun.sharma@example.com',
  phone: '+91 98765 43210',
  address: '14, MG Road, Bangalore, KA 560001',
};

export const dummyDoctor = {
  id: 'D001',
  name: 'Dr. Priya Nair',
  specialization: 'General Physician',
  department: 'General Medicine',
  email: 'priya.nair@hospital.com',
  phone: '+91 94321 56789',
  experience: '12 years',
  status: 'available',
};

export const dummyAdmin = {
  id: 'A001',
  name: 'Rahul Verma',
  role: 'System Administrator',
  email: 'rahul.verma@admin.com',
};

export const appointments = [
  {
    id: 'APT001',
    patientName: 'Arjun Sharma',
    doctorName: 'Dr. Priya Nair',
    date: '2026-11-10',
    time: '10:00 AM',
    type: 'General Checkup',
    status: 'confirmed',
  },
  {
    id: 'APT002',
    patientName: 'Meena Pillai',
    doctorName: 'Dr. Suresh Babu',
    date: '2026-11-11',
    time: '11:30 AM',
    type: 'Follow-up',
    status: 'pending',
  },
  {
    id: 'APT003',
    patientName: 'Ravi Kumar',
    doctorName: 'Dr. Anjali Mehta',
    date: '2026-11-09',
    time: '09:00 AM',
    type: 'Consultation',
    status: 'completed',
  },
  {
    id: 'APT004',
    patientName: 'Sita Devi',
    doctorName: 'Dr. Priya Nair',
    date: '2026-11-12',
    time: '03:00 PM',
    type: 'General Checkup',
    status: 'cancelled',
  },
];

export const doctors = [
  { id: 'D001', name: 'Dr. Priya Nair', specialization: 'General Physician', status: 'available', patients: 24 },
  { id: 'D002', name: 'Dr. Suresh Babu', specialization: 'Cardiologist', status: 'busy', patients: 18 },
  { id: 'D003', name: 'Dr. Anjali Mehta', specialization: 'Dermatologist', status: 'available', patients: 31 },
  { id: 'D004', name: 'Dr. Kiran Rao', specialization: 'Orthopedic', status: 'off-duty', patients: 15 },
];

export const patients = [
  { id: 'P001', name: 'Arjun Sharma', age: 32, lastVisit: '2026-10-28', status: 'active' },
  { id: 'P002', name: 'Meena Pillai', age: 45, lastVisit: '2026-11-01', status: 'active' },
  { id: 'P003', name: 'Ravi Kumar', age: 28, lastVisit: '2026-09-15', status: 'inactive' },
  { id: 'P004', name: 'Sita Devi', age: 60, lastVisit: '2026-10-05', status: 'active' },
];

export const stats = {
  totalPatients: 1284,
  totalDoctors: 42,
  appointmentsToday: 78,
  pendingApprovals: 5,
};
