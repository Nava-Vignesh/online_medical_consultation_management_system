import { useState, useMemo } from 'react';
import {
  Receipt, CheckCircle, Clock, Search,
  Eye, X, Printer, DollarSign
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import { dummyInvoices, dummyDoctor } from '../../data/dummyData';
import '../../styles/doctor.css';

function DoctorInvoices() {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const totalRevenue = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + parseInt(inv.fee.replace(/[^\d]/g, '') || 0, 10), 0);
  }, [invoices]);

  const paidCount = invoices.filter((i) => i.status === 'paid').length;
  const pendingCount = invoices.filter((i) => i.status === 'pending').length;

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (activeTab === 'paid' && inv.status !== 'paid') return false;
      if (activeTab === 'pending' && inv.status !== 'pending') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inv.id.toLowerCase().includes(q) ||
          inv.patientName.toLowerCase().includes(q) ||
          inv.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [invoices, activeTab, searchQuery]);

  const handleMarkPaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid', paymentMethod: 'Counter Settlement' } : inv))
    );
  };

  return (
    <div>
      <PageHeader
        title="Consultation Invoices &amp; Billing"
        subtitle="Manage in-person consultation charges, receipts, and counter payment settlements."
      />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Collected Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          meta="Current month billing"
          icon={<DollarSign size={18} />}
        />
        <StatCard
          label="Paid Invoices"
          value={paidCount.toString()}
          meta="Settled consultation fees"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Pending Payments"
          value={pendingCount.toString()}
          meta="Awaiting counter clearance"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Standard Consultation Fee"
          value={dummyDoctor.consultationFee || '₹500'}
          meta="Per in-person visit"
          icon={<Receipt size={18} />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab${activeTab === 'all' ? ' active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Invoices <span className="tab-badge">{invoices.length}</span>
        </button>
        <button
          className={`filter-tab${activeTab === 'paid' ? ' active' : ''}`}
          onClick={() => setActiveTab('paid')}
        >
          Paid <span className="tab-badge">{paidCount}</span>
        </button>
        <button
          className={`filter-tab${activeTab === 'pending' ? ' active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending <span className="tab-badge">{pendingCount}</span>
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
              placeholder="Search by invoice ID, patient name, or visit type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Consultation Invoices Registry</div>
            <div className="card-subtitle">Showing {filteredInvoices.length} billing records</div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Consultation Type</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{inv.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.patientName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--secondary)' }}>ID: {inv.patientId}</div>
                  </td>
                  <td>{inv.date}</td>
                  <td>{inv.type}</td>
                  <td style={{ fontWeight: 700 }}>{inv.fee}</td>
                  <td style={{ fontSize: 12.5 }}>{inv.paymentMethod}</td>
                  <td>
                    <Badge
                      status={inv.status === 'paid' ? 'confirmed' : 'pending'}
                      label={inv.status.toUpperCase()}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <Eye size={13} style={{ marginRight: 4 }} />
                        View
                      </Button>
                      {inv.status === 'pending' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleMarkPaid(inv.id)}
                        >
                          <CheckCircle size={13} style={{ marginRight: 4 }} />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Consultation Bill &mdash; {selectedInvoice.id}</h3>
                <p style={{ fontSize: 12, color: 'var(--secondary)' }}>MedConsult Clinical Outpatient Services</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedInvoice(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--secondary)', fontSize: 12.5 }}>Patient Name</span>
                  <span style={{ fontWeight: 600 }}>{selectedInvoice.patientName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--secondary)', fontSize: 12.5 }}>Date of Visit</span>
                  <span>{selectedInvoice.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--secondary)', fontSize: 12.5 }}>Consulting Physician</span>
                  <span>{dummyDoctor.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary)', fontSize: 12.5 }}>Payment Mode</span>
                  <span style={{ fontWeight: 500 }}>{selectedInvoice.paymentMethod}</span>
                </div>
              </div>

              <div className="divider" style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span>{selectedInvoice.type}</span>
                <span>{selectedInvoice.fee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--secondary)' }}>
                <span>Clinic Facility &amp; Admin Surcharge</span>
                <span>₹0</span>
              </div>

              <div className="divider" style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>{selectedInvoice.total || selectedInvoice.fee}</span>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={() => window.print()}>
                <Printer size={14} style={{ marginRight: 6 }} />
                Print Receipt
              </Button>
              <Button variant="primary" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorInvoices;

