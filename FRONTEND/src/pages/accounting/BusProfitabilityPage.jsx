/**
 * SMART ROUTE — Bus Profitability Rankings Page
 * Module 9: Separate rankings for Total Profit vs Avg Profit Per Trip, Loss-making buses spotlight
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import accountingApi from '../../services/accountingService.js';
import {
  Bus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  Download,
  AlertTriangle,
  ArrowRight,
  Sliders,
} from 'lucide-react';

export default function BusProfitabilityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  const [dateRange, setDateRange] = useState('all');
  const [rankingMode, setRankingMode] = useState('total_profit'); // 'total_profit' | 'avg_profit_per_trip' | 'loss_making' | 'occupancy'
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (amt) => {
    const val = Number(amt) || 0;
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const sortBy = rankingMode === 'avg_profit_per_trip' ? 'avg_profit_per_trip' : (rankingMode === 'occupancy' ? 'occupancy' : 'total_profit');
      const sortOrder = 'desc';

      const res = await accountingApi.getBusesAccounting({ dateRange, sortBy, sortOrder });
      if (res.success) {
        let list = res.data || [];
        if (rankingMode === 'loss_making') {
          list = list.filter((b) => b.is_loss_making);
        }
        setBuses(list);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bus profitability rankings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [dateRange, rankingMode]);

  const handleExport = async () => {
    try {
      await accountingApi.downloadExport('bus_profitability', { dateRange });
    } catch (err) {
      alert(`Export error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto', color: '#24152D' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#24152D' }}>
            Bus-wise Profitability & Operational Rankings
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6E5D73' }}>
            Distinct rankings: Total cumulative profit vs Average profit per operated trip (Module 9 Compliance)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Date Filter */}
          <div style={{ display: 'flex', background: '#FFF', border: '1px solid #E7D7E0', borderRadius: 8, padding: 2 }}>
            {['all', 'today', 'this_week', 'this_month', 'this_year'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setDateRange(p)}
                style={{
                  border: 'none',
                  background: dateRange === p ? 'var(--sr-primary, #C13D78)' : 'transparent',
                  color: dateRange === p ? '#FFF' : '#6E5D73',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {p.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExport}
            style={{
              border: 'none',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFF',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Download size={15} /> Export Buses CSV
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs (Module 9: Distinct Total Profit vs Avg Profit Per Trip) */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { id: 'total_profit', label: '🏆 Rank by Total Profit', desc: 'Highest cumulative net operating profit' },
          { id: 'avg_profit_per_trip', label: '⚡ Rank by Avg Profit / Trip', desc: 'Highest efficiency per operated journey' },
          { id: 'loss_making', label: '⚠️ Loss-Making Buses', desc: 'Buses with negative operating margins' },
          { id: 'occupancy', label: '👥 Rank by Seat Occupancy', desc: 'Highest passenger load factor' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setRankingMode(tab.id)}
            style={{
              border: rankingMode === tab.id ? '1px solid #C13D78' : '1px solid #E7D7E0',
              background: rankingMode === tab.id ? '#FFF1F6' : '#FFFFFF',
              color: rankingMode === tab.id ? '#C13D78' : '#6E5D73',
              borderRadius: 8,
              padding: '10px 16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>{tab.label}</div>
            <div style={{ fontSize: 11, color: '#8A7A8F', marginTop: 2 }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E7D7E0',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E7D7E0', color: '#8A7A8F', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>Rank & Registration</th>
              <th style={{ padding: '12px 8px' }}>Carrier</th>
              <th style={{ padding: '12px 8px' }}>Trips Operated</th>
              <th style={{ padding: '12px 8px' }}>Net Revenue</th>
              <th style={{ padding: '12px 8px' }}>Total Expenses</th>
              <th style={{ padding: '12px 8px' }}>Total Profit / Loss</th>
              <th style={{ padding: '12px 8px' }}>Avg Profit / Trip</th>
              <th style={{ padding: '12px 8px' }}>Occupancy</th>
              <th style={{ padding: '12px 8px' }}>Rating</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '30px', textAlign: 'center', color: '#8A7A8F' }}>
                  No buses found matching the current ranking criteria.
                </td>
              </tr>
            ) : (
              buses.map((bus, idx) => (
                <tr key={bus.bus_id} style={{ borderBottom: '1px solid #F4ECF0' }} className="clickable-row">
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#8A7A8F', fontSize: 11, fontWeight: 700 }}>#{idx + 1}</span>
                      <span style={{ fontWeight: 700, color: '#24152D' }}>{bus.registration_number}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#8A7A8F' }}>{bus.name}</div>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#6E5D73' }}>{bus.travel_name}</td>
                  <td style={{ padding: '12px 8px' }}>{bus.trips_operated}</td>
                  <td style={{ padding: '12px 8px', color: '#10B981', fontWeight: 600 }}>
                    {formatCurrency(bus.net_ticket_revenue)}
                  </td>
                  <td style={{ padding: '12px 8px', color: '#EF4444' }}>
                    {formatCurrency(bus.total_operating_expenses)}
                  </td>
                  <td
                    style={{
                      padding: '12px 8px',
                      fontWeight: 700,
                      color: bus.operating_profit_loss >= 0 ? '#10B981' : '#DC2626',
                    }}
                  >
                    {formatCurrency(bus.operating_profit_loss)}
                  </td>
                  <td
                    style={{
                      padding: '12px 8px',
                      fontWeight: 700,
                      color: bus.avg_profit_per_trip >= 0 ? '#10B981' : '#DC2626',
                    }}
                  >
                    {formatCurrency(bus.avg_profit_per_trip)}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: '#10B981' }}>
                    {bus.occupancy_percentage}%
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {bus.average_rating ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#D97706', fontWeight: 700 }}>
                        <Star size={12} fill="#D97706" /> {bus.average_rating} ({bus.review_count})
                      </span>
                    ) : (
                      <span style={{ color: '#8A7A8F' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => navigate(isSuperAdmin ? `/admin/accounting/buses/${bus.bus_id}` : `/operator/accounting/buses/${bus.bus_id}`)}
                      style={{
                        border: '1px solid #C13D78',
                        background: '#FFF1F6',
                        color: '#C13D78',
                        borderRadius: 6,
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Ledger
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
