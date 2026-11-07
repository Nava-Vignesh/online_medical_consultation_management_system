import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Clock, Plus, Settings, CheckCircle, AlertCircle,
  Users, Stethoscope, FileText, ArrowRight
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import CalendarMonthView from '../../components/doctor/CalendarMonthView';
import CalendarWeekView from '../../components/doctor/CalendarWeekView';
import CalendarDayView from '../../components/doctor/CalendarDayView';
import ManageAvailabilityModal from '../../components/doctor/ManageAvailabilityModal';
import BookAppointmentModal from '../../components/doctor/BookAppointmentModal';
import AppointmentDetailModal from '../../components/doctor/AppointmentDetailModal';
import { appointments as initialAppointments, dummyDoctor, dummyAvailabilitySettings } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorCalendar() {
  const navigate = useNavigate();

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date('2026-11-07')); // anchor date in demonstration
  const [selectedDate, setSelectedDate] = useState('2026-11-07');
  const [activeView, setActiveView] = useState('month'); // 'month', 'week', 'day'
  const [appointmentsList, setAppointmentsList] = useState(initialAppointments);
  const [availability, setAvailability] = useState(dummyAvailabilitySettings);

  // Modals state
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookingTimeSlot, setBookingTimeSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Navigation handlers
  const handlePrev = () => {
    if (activeView === 'month') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (activeView === 'week') {
      const prevWeek = new Date(selectedDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      const key = `${prevWeek.getFullYear()}-${String(prevWeek.getMonth() + 1).padStart(2, '0')}-${String(prevWeek.getDate()).padStart(2, '0')}`;
      setSelectedDate(key);
      setCurrentDate(prevWeek);
    } else {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      const key = `${prevDay.getFullYear()}-${String(prevDay.getMonth() + 1).padStart(2, '0')}-${String(prevDay.getDate()).padStart(2, '0')}`;
      setSelectedDate(key);
      setCurrentDate(prevDay);
    }
  };

  const handleNext = () => {
    if (activeView === 'month') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (activeView === 'week') {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const key = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;
      setSelectedDate(key);
      setCurrentDate(nextWeek);
    } else {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const key = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
      setSelectedDate(key);
      setCurrentDate(nextDay);
    }
  };

  const handleToday = () => {
    const today = new Date('2026-11-07');
    setCurrentDate(today);
    setSelectedDate('2026-11-07');
  };

  // Heading label
  const headingText = useMemo(() => {
    if (activeView === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (activeView === 'week') {
      const d = new Date(selectedDate);
      const day = d.getDay();
      const start = new Date(d);
      start.setDate(d.getDate() - day);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [activeView, currentDate, selectedDate]);

  // Selected date appointments
  const selectedDateAppointments = useMemo(() => {
    return appointmentsList.filter((a) => a.date === selectedDate);
  }, [appointmentsList, selectedDate]);

  // Selected date metrics (Summary Section Requirement 8)
  const totalForDate = selectedDateAppointments.length;
  const confirmedForDate = selectedDateAppointments.filter((a) => a.status === 'confirmed').length;
  const pendingForDate = selectedDateAppointments.filter((a) => a.status === 'pending').length;

  // Calculate available slots count on selected date
  const availableSlotsCount = useMemo(() => {
    const isBlackout = availability?.unavailableDates?.some((u) => u.date === selectedDate);
    const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const isWorking = availability?.workingDays?.includes(dayName);

    if (isBlackout || !isWorking) return 0;

    // Approximate total daily slots based on hours and duration
    const totalDailyCapacity = 16; // e.g. 8 hours * 2 slots/hr
    const bookedCount = selectedDateAppointments.filter((a) => a.status !== 'cancelled').length;
    return Math.max(0, totalDailyCapacity - bookedCount);
  }, [availability, selectedDate, selectedDateAppointments]);

  // Appointment Status change handler
  const handleStatusChange = (id, newStatus) => {
    setAppointmentsList((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Appointment status updated to ${newStatus}.`);
  };

  // Add new appointment (with overlap prevention confirmation)
  const handleBookAppointment = (newApt) => {
    setAppointmentsList((prev) => [newApt, ...prev]);
    showToast(`In-person appointment booked for ${newApt.patientName} at ${newApt.time}.`);
  };

  // Open booking modal for a specific slot
  const handleOpenBookSlot = (date, slotTime) => {
    if (date) setSelectedDate(date);
    setBookingTimeSlot(slotTime || '10:00 AM');
    setIsBookModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Interactive Appointment Calendar"
        subtitle="Manage in-person consultation schedules, weekly working availability, and outpatient bookings."
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={() => setIsAvailabilityOpen(true)}
            >
              <Settings size={15} style={{ marginRight: 6 }} />
              Manage Availability
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setBookingTimeSlot('10:00 AM');
                setIsBookModalOpen(true);
              }}
            >
              <Plus size={15} style={{ marginRight: 6 }} />
              Book Appointment
            </Button>
          </div>
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            background: 'var(--primary-dark)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <CheckCircle size={16} color="#4ade80" />
          {toastMessage}
        </div>
      )}

      {/* SUMMARY SECTION (Requirement 8) */}
      <div className="stats-grid">
        <StatCard
          label="Total Visits (Selected Date)"
          value={totalForDate.toString()}
          meta={new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          icon={<CalendarIcon size={18} />}
        />
        <StatCard
          label="Confirmed Consultations"
          value={confirmedForDate.toString()}
          meta="Patient checked-in or verified"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Pending Approval"
          value={pendingForDate.toString()}
          meta="Awaiting doctor slot approval"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Available Time Slots"
          value={availableSlotsCount.toString()}
          meta={`Slot length: ${availability.slotDuration} minutes`}
          icon={<Stethoscope size={18} />}
        />
      </div>

      {/* Main Calendar Card */}
      <div className="calendar-card">
        {/* Navigation Toolbar */}
        <div className="calendar-header-toolbar">
          <div className="calendar-nav-group">
            <h2 className="calendar-title-heading">{headingText}</h2>

            <Button variant="secondary" size="sm" onClick={handlePrev} aria-label="Previous">
              <ChevronLeft size={16} />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="secondary" size="sm" onClick={handleNext} aria-label="Next">
              <ChevronRight size={16} />
            </Button>
          </div>

          {/* View Mode Switcher */}
          <div className="calendar-view-toggle">
            <button
              type="button"
              className={`calendar-view-btn${activeView === 'month' ? ' active' : ''}`}
              onClick={() => setActiveView('month')}
            >
              Month View
            </button>
            <button
              type="button"
              className={`calendar-view-btn${activeView === 'week' ? ' active' : ''}`}
              onClick={() => setActiveView('week')}
            >
              Week View
            </button>
            <button
              type="button"
              className={`calendar-view-btn${activeView === 'day' ? ' active' : ''}`}
              onClick={() => setActiveView('day')}
            >
              Day View
            </button>
          </div>
        </div>

        {/* Selected View Rendering */}
        {activeView === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={(dt) => setSelectedDate(dt)}
            appointments={appointmentsList}
            onOpenAppointment={(apt) => setSelectedAppointment(apt)}
            availability={availability}
          />
        )}

        {activeView === 'week' && (
          <CalendarWeekView
            selectedDate={selectedDate}
            onSelectDate={(dt) => setSelectedDate(dt)}
            appointments={appointmentsList}
            onOpenAppointment={(apt) => setSelectedAppointment(apt)}
            onBookSlot={(dt, time) => handleOpenBookSlot(dt, time)}
            availability={availability}
          />
        )}

        {activeView === 'day' && (
          <CalendarDayView
            selectedDate={selectedDate}
            appointments={appointmentsList}
            onOpenAppointment={(apt) => setSelectedAppointment(apt)}
            onBookSlot={(dt, time) => handleOpenBookSlot(dt, time)}
            availability={availability}
          />
        )}

        {/* Calendar Color Legend */}
        <div className="calendar-legend">
          <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>Legend:</span>
          <div className="legend-item">
            <span className="legend-dot confirmed" />
            <span>Confirmed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot pending" />
            <span>Pending</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot completed" />
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot cancelled" />
            <span>Cancelled</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot unavailable" />
            <span>Unavailable / Leave</span>
          </div>
        </div>
      </div>

      {/* Selected Date Appointments Drawer / Details List (Requirement 5) */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="card-subtitle">
              {selectedDateAppointments.length} scheduled in-person consultations
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenBookSlot(selectedDate, '10:00 AM')}
          >
            <Plus size={13} style={{ marginRight: 4 }} />
            Add Appointment to Date
          </Button>
        </div>

        {selectedDateAppointments.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 16px' }}>
            <CalendarIcon size={36} />
            <div className="empty-state-title">No appointments scheduled for this date</div>
            <div className="empty-state-desc">
              All time slots are open for in-person consultations on {selectedDate}.
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Appointment Time</th>
                  <th>Consultation Type &amp; Room</th>
                  <th>Chief Complaint</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedDateAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.patientName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
                        {apt.patientAge}y &bull; {apt.patientGender}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4, color: 'var(--secondary)' }} />
                      {apt.time}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5 }}>
                        <Stethoscope size={13} color="var(--primary)" />
                        {apt.room || apt.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220 }} className="truncate">
                      {apt.symptoms}
                    </td>
                    <td>
                      <Badge
                        status={apt.status}
                        label={apt.status.toUpperCase()}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          Details
                        </Button>
                        {apt.status === 'confirmed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/doctor/consultations?aptId=${apt.id}`)}
                          >
                            Consult
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ManageAvailabilityModal
        isOpen={isAvailabilityOpen}
        onClose={() => setIsAvailabilityOpen(false)}
        availability={availability}
        onSave={(newSettings) => {
          setAvailability(newSettings);
          showToast('Clinic availability & blackout dates updated.');
        }}
      />

      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        initialDate={selectedDate}
        initialTime={bookingTimeSlot}
        appointmentsList={appointmentsList}
        onBook={handleBookAppointment}
        doctor={dummyDoctor}
      />

      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatusChange}
        onStartConsultation={(apt) => navigate(`/doctor/consultations?aptId=${apt.id}`)}
      />
    </div>
  );
}

export default DoctorCalendar;

