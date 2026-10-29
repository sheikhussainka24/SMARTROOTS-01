/**
 * SMART ROUTE — Route-wise Profitability Analysis Page
 * Module 8: Route rankings, scheduled vs operated trips, profit per trip, occupancy
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import accountingApi from '../../services/accountingService.js';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Filter,
  Star,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export default function RouteProfitabilityPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('total_profit');
  const [sortOrder, setSortOrder] = useState('desc');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (amt) => {
    const val = Number(amt) || 0;
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await accountingApi.getRoutesAccounting({ dateRange, sortBy, sortOrder });
      if (res.success) {
        setRoutes(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load route profitability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [dateRange, sortBy, sortOrder]);

  const handleExport = async () => {
    try {
      await accountingApi.downloadExport('route_profitability', { dateRange });
    } catch (err) {
      alert(`Export error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto', color: '#24152D' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#24152D' }}>
            Route-wise Profitability & Corridors Performance
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6E5D73' }}>
            Rank routes by total profit, average profit per trip, or seat occupancy across operated corridors
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

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '7px 12px',
              border: '1px solid #E7D7E0',
              borderRadius: 8,
              fontSize: 13,
              background: '#FFF',
              color: '#24152D',
              outline: 'none',
              fontWeight: 600,
            }}
          >
            <option value="total_profit">Rank by Total Profit</option>
            <option value="avg_profit_per_trip">Rank by Avg Profit / Trip</option>
            <option value="occupancy">Rank by Seat Occupancy</option>
            <option value="revenue">Rank by Net Revenue</option>
          </select>

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
            <Download size={15} /> Export Routes CSV
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Routes Table */}
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
              <th style={{ padding: '12px 8px' }}>Route Corridor</th>
              <th style={{ padding: '12px 8px' }}>Carrier</th>
              <th style={{ padding: '12px 8px' }}>Distance</th>
              <th style={{ padding: '12px 8px' }}>Trips (Sched / Oper)</th>
              <th style={{ padding: '12px 8px' }}>Net Revenue</th>
              <th style={{ padding: '12px 8px' }}>Expenses</th>
              <th style={{ padding: '12px 8px' }}>Total Profit / Loss</th>
              <th style={{ padding: '12px 8px' }}>Avg / Trip</th>
              <th style={{ padding: '12px 8px' }}>Occupancy</th>
              <th style={{ padding: '12px 8px' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r, idx) => (
              <tr key={r.route_id} style={{ borderBottom: '1px solid #F4ECF0' }}>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#8A7A8F', fontSize: 11, fontWeight: 700 }}>#{idx + 1}</span>
                    <span style={{ fontWeight: 700, color: '#24152D' }}>{r.source} ➔ {r.destination}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#8A7A8F' }}>{r.name}</div>
                </td>
                <td style={{ padding: '12px 8px', color: '#6E5D73' }}>{r.travel_name}</td>
                <td style={{ padding: '12px 8px' }}>{r.distance_km} km</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ fontWeight: 600 }}>{r.operated_trips}</span>
                  <span style={{ color: '#8A7A8F' }}> / {r.scheduled_trips}</span>
                </td>
                <td style={{ padding: '12px 8px', color: '#10B981', fontWeight: 600 }}>
                  {formatCurrency(r.net_ticket_revenue)}
                </td>
                <td style={{ padding: '12px 8px', color: '#EF4444' }}>
                  {formatCurrency(r.total_operating_expenses)}
                </td>
                <td
                  style={{
                    padding: '12px 8px',
                    fontWeight: 700,
                    color: r.operating_profit_loss >= 0 ? '#10B981' : '#DC2626',
                  }}
                >
                  {formatCurrency(r.operating_profit_loss)}
                </td>
                <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                  {formatCurrency(r.avg_profit_per_trip)}
                </td>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: '#10B981' }}>
                  {r.occupancy_percentage}%
                </td>
                <td style={{ padding: '12px 8px' }}>
                  {r.average_rating ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#D97706', fontWeight: 700 }}>
                      <Star size={12} fill="#D97706" /> {r.average_rating} ({r.review_count})
                    </span>
                  ) : (
                    <span style={{ color: '#8A7A8F' }}>N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
