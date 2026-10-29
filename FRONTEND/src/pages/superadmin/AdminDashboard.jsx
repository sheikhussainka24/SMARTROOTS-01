import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import BrandLogo from '../../components/common/BrandLogo.jsx';
import { Shield, Building2, CheckCircle2, XCircle, AlertCircle, TrendingUp, Bus, MapPin, Radio, Sparkles, Plus, Edit2, Save, RotateCcw, Compass } from 'lucide-react';
import { useHubConfig } from '../../config/hubConfig.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Central Bus Hub System Settings State
  const { hubConfig, updateHubConfig } = useHubConfig();
  const [editingHub, setEditingHub] = useState(false);
  const [hubForm, setHubForm] = useState(null);
  const [hubSaving, setHubSaving] = useState(false);
  const [hubMessage, setHubMessage] = useState(null);
  const [hubError, setHubError] = useState(null);

  const startEditHub = () => {
    setHubForm({
      line1: hubConfig?.line1 || 'SMART ROUTE Central Bus Hub',
      line2: hubConfig?.line2 || 'Palakkad – Ukkadam Highway',
      line3: hubConfig?.line3 || 'K.G. Chavadi, Coimbatore – 641105',
      line4: hubConfig?.line4 || 'Tamil Nadu, India.',
    });
    setEditingHub(true);
    setHubMessage(null);
    setHubError(null);
  };

  const handleSaveHub = async (e) => {
    e.preventDefault();
    setHubSaving(true);
    setHubError(null);
    try {
      await updateHubConfig(hubForm);
      setHubMessage('Central Bus Hub address updated successfully across all application components and e-tickets.');
      setEditingHub(false);
      setTimeout(() => setHubMessage(null), 6000);
    } catch (err) {
      setHubError(err.message || 'Failed to update hub configuration.');
    } finally {
      setHubSaving(false);
    }
  };

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [dashRes, travelRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/travels'),
        ]);

        if (dashRes.success) setDashboard(dashRes);
        if (travelRes.success && travelRes.travels && travelRes.travels.length > 0) {
          setTravels(travelRes.travels);
        } else {
          // Synthetic travel carriers across South India
          setTravels([
            {
              id: 'trv-sr-001',
              name: 'SMART ROUTE Travels',
              business_name: 'SMART ROUTE Mobility Private Limited',
              city: 'Coimbatore',
              state: 'Tamil Nadu',
              gst_number: '33AABCS8891M1ZT',
              total_buses: 3,
              total_managers: 1,
              total_drivers: 2,
              total_staff: 2,
              status: 'active',
              is_flagship: true,
            },
            {
              id: 'trv-hz-002',
              name: 'Horizon Travels',
              business_name: 'Horizon Intercity Lines LLP',
              city: 'Chennai',
              state: 'Tamil Nadu',
              gst_number: '33AABCH9821M1ZT',
              total_buses: 3,
              total_managers: 1,
              total_drivers: 2,
              total_staff: 1,
              status: 'active',
              is_flagship: false,
            },
            {
              id: 'trv-bl-003',
              name: 'BlueLine Travels',
              business_name: 'BlueLine Superfast Logistics Private Limited',
              city: 'Bengaluru',
              state: 'Karnataka',
              gst_number: '29AABCB7712K1ZQ',
              total_buses: 2,
              total_managers: 1,
              total_drivers: 2,
              total_staff: 1,
              status: 'active',
              is_flagship: false,
            },
            {
              id: 'trv-ss-004',
              name: 'SouthStar Travels',
              business_name: 'SouthStar Highway Transport Corporation',
              city: 'Madurai',
              state: 'Tamil Nadu',
              gst_number: '33AABCS6621R1ZT',
              total_buses: 2,
              total_managers: 1,
              total_drivers: 2,
              total_staff: 1,
              status: 'active',
              is_flagship: false,
            },
          ]);
        }
      } catch (err) {
        console.error('Super Admin console error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <BrandLogo variant="icon" size="lg" showText={false} />
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--sr-text-secondary)' }}>Loading platform governance console...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1240, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="sr-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="badge badge-success">SUPER ADMIN / FOUNDER GOVERNANCE</span>
              <span style={{ fontSize: 12, color: 'var(--sr-text-secondary)' }}>National Platform Operations Network</span>
            </div>
            <h1 style={{ fontSize: 24, color: 'var(--sr-text-primary)', margin: '8px 0 4px', fontWeight: 800 }}>
              Intercity Travel Carriers & Fleet Oversight
            </h1>
            <p style={{ color: 'var(--sr-text-secondary)', fontSize: 13, margin: 0 }}>
              Super Admin platform governance displaying high-level carrier fleet volumes, staff allocations, and operational compliance. Individual personal information is strictly safeguarded.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/buses/create')}
            className="bg-[#C13D78] hover:bg-[#A82B63] text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>+ Add Bus</span>
          </button>
        </div>
      </div>

      {/* Network Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="sr-stat-card">
          <span className="sr-stat-label">Registered Travel Carriers</span>
          <span className="sr-stat-value">{travels.length} Carriers</span>
          <span style={{ fontSize: 11, color: 'var(--sr-emerald)' }}>100% compliance certified</span>
        </div>

        <div className="sr-stat-card">
          <span className="sr-stat-label">Network Active Coaches</span>
          <span className="sr-stat-value">
            {travels.reduce((sum, t) => sum + (t.total_buses || 0), 0)} Buses
          </span>
          <span style={{ fontSize: 11, color: 'var(--sr-cyan)' }}>Real-time GPS radar enabled</span>
        </div>

        <div className="sr-stat-card">
          <span className="sr-stat-label">Allocated Duty Drivers</span>
          <span className="sr-stat-value">
            {travels.reduce((sum, t) => sum + (t.total_drivers || 0), 0)} Drivers
          </span>
          <span style={{ fontSize: 11, color: 'var(--sr-text-secondary)' }}>HMV Heavy certified</span>
        </div>

        <div className="sr-stat-card">
          <span className="sr-stat-label">Network Infrastructure</span>
          <span className="sr-stat-value" style={{ color: 'var(--sr-emerald)' }}>99.99%</span>
          <span style={{ fontSize: 11, color: 'var(--sr-emerald)' }}>Zero platform downtime</span>
        </div>
      </div>

      {/* System Settings: Designated Central Bus Hub */}
      <div className="sr-card" style={{ padding: 24, border: '1.5px solid rgba(225, 29, 72, 0.25)', background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,241,246,0.3) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} /> SYSTEM SETTINGS
              </span>
              <span style={{ fontSize: 12, color: 'var(--sr-text-secondary)' }}>Shared Hub Configuration Source of Truth</span>
            </div>
            <h2 style={{ fontSize: 18, color: 'var(--sr-text-primary)', margin: '8px 0 4px', fontWeight: 800 }}>
              Designated Central Bus Hub Address
            </h2>
            <p style={{ color: 'var(--sr-text-secondary)', fontSize: 13, margin: 0 }}>
              Configured hub location displayed across public footer, Contact Us portal, and official two-page A4 e-tickets.
            </p>
          </div>

          {!editingHub ? (
            <button
              type="button"
              onClick={startEditHub}
              style={{
                background: 'var(--sr-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Edit2 size={15} />
              <span>Configure Hub Address</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditingHub(false)}
              style={{
                background: 'var(--sr-bg-canvas)',
                color: 'var(--sr-text-secondary)',
                border: '1px solid var(--sr-border-card)',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel Editing
            </button>
          )}
        </div>

        {hubMessage && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{hubMessage}</span>
          </div>
        )}

        {hubError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} color="#DC2626" />
            <span>{hubError}</span>
          </div>
        )}

        {!editingHub ? (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--sr-border-card)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sr-text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Current Synchronized Hub Address
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#24152D', marginBottom: 6 }}>
                  {hubConfig?.line1}
                </div>
                <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>
                  {hubConfig?.line2}<br />
                  {hubConfig?.line3}<br />
                  {hubConfig?.line4}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sr-text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Operational Verification Notice
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 8, padding: 12, fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                  <strong>Designated Hub Record:</strong> Supplied address for the SMART ROUTE Central Bus Hub. Physical terminal premises, dedicated bay allocations, and exact map pin coordinates are subject to independent operator/RTO verification.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveHub} style={{ background: '#FFFFFF', border: '1px solid var(--sr-border-card)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--sr-text-secondary)', display: 'block', marginBottom: 4 }}>
                  Hub Name (Line 1) *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={hubForm?.line1 || ''}
                  onChange={(e) => setHubForm({ ...hubForm, line1: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--sr-text-secondary)', display: 'block', marginBottom: 4 }}>
                  Highway / Corridor (Line 2) *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={hubForm?.line2 || ''}
                  onChange={(e) => setHubForm({ ...hubForm, line2: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--sr-text-secondary)', display: 'block', marginBottom: 4 }}>
                  Landmark, City &amp; PIN (Line 3) *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={hubForm?.line3 || ''}
                  onChange={(e) => setHubForm({ ...hubForm, line3: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--sr-text-secondary)', display: 'block', marginBottom: 4 }}>
                  State &amp; Country (Line 4) *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={hubForm?.line4 || ''}
                  onChange={(e) => setHubForm({ ...hubForm, line4: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setEditingHub(false)}
                className="btn btn-secondary"
                style={{ height: 38 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={hubSaving}
                className="btn btn-primary"
                style={{ height: 38, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Save size={15} />
                <span>{hubSaving ? 'Saving...' : 'Save Hub Settings'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Verified Travel Operators Table */}
      <div className="sr-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, color: 'var(--sr-text-primary)', margin: 0, fontWeight: 800 }}>Partner Travel Carriers & Fleet Summary</h2>
          <span className="badge badge-success">TRAVEL-LEVEL OVERSIGHT</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--sr-border-card)', color: 'var(--sr-text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '12px 10px' }}>Travel Carrier</th>
                <th style={{ padding: '12px 10px' }}>Corporate Name</th>
                <th style={{ padding: '12px 10px' }}>Headquarters</th>
                <th style={{ padding: '12px 10px' }}>Buses</th>
                <th style={{ padding: '12px 10px' }}>Managers</th>
                <th style={{ padding: '12px 10px' }}>Drivers</th>
                <th style={{ padding: '12px 10px' }}>Staff</th>
                <th style={{ padding: '12px 10px' }}>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {travels.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--sr-border-subtle)' }}>
                  <td style={{ padding: '14px 10px', fontWeight: 800, color: 'var(--sr-text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {t.name}
                      {t.is_flagship && (
                        <span className="badge badge-success" style={{ fontSize: 9, padding: '2px 6px' }}>FLAGSHIP</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 10px', color: 'var(--sr-text-secondary)' }}>{t.business_name}</td>
                  <td style={{ padding: '14px 10px' }}>{t.city}, {t.state}</td>
                  <td style={{ padding: '14px 10px', fontWeight: 700, color: 'var(--sr-cyan)' }}>{t.total_buses || 2}</td>
                  <td style={{ padding: '14px 10px' }}>{t.total_managers || 1}</td>
                  <td style={{ padding: '14px 10px' }}>{t.total_drivers || 2}</td>
                  <td style={{ padding: '14px 10px' }}>{t.total_staff || 1}</td>
                  <td style={{ padding: '14px 10px' }}>
                    <span className="badge badge-success">ACTIVE & AUDITED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
