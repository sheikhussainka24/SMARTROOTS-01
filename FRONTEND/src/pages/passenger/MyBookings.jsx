import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import BrandLogo from '../../components/common/BrandLogo.jsx';
import PassengerReviewModal from '../../components/accounting/PassengerReviewModal.jsx';
import { Ticket, Bus, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, ChevronRight, XCircle, Printer, Radio, Star } from 'lucide-react';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings');
      const list = res.bookings || res.data?.bookings || [];
      setBookings(list);
    } catch (err) {
      setError(err.message || 'Failed to load booking history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId, pnr) => {
    if (!window.confirm(`Are you sure you want to cancel ticket with PNR ${pnr}? Cancellation charges may apply according to operator refund policy.`)) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await api.post(`/bookings/${bookingId}/cancel`, { reason: 'Passenger requested cancellation' });
      if (res.success) {
        alert('Booking cancelled successfully.');
        loadBookings();
      } else {
        alert(res.error || 'Unable to cancel booking.');
      }
    } catch (err) {
      alert(err.message || 'Cancellation request failed.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <BrandLogo variant="icon" size="lg" showText={false} />
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--sr-text-secondary)' }}>Loading your reservations & electronic tickets...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, color: 'var(--sr-text-primary)', margin: 0, fontWeight: 800 }}>
            My Passenger Bookings
          </h1>
          <p style={{ color: 'var(--sr-text-secondary)', fontSize: 13, marginTop: 4 }}>
            View your confirmed travel itineraries, electronic boarding passes, and cancellation options
          </p>
        </div>

        <Link to="/" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
          <Bus size={15} /> Book New Trip
        </Link>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', padding: 12, borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="sr-card" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <BrandLogo variant="hero" showText={false} style={{ marginBottom: 4 }} />
          <h3 style={{ fontSize: 18, color: 'var(--sr-text-primary)', margin: 0 }}>No Reservations Found</h3>
          <p style={{ color: 'var(--sr-text-secondary)', fontSize: 13, maxWidth: 420, margin: 0 }}>
            You haven't booked any bus trips yet. Discover our connected South Indian routes and reserve seats with live GPS tracking.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
            Search Available Routes
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map((b) => {
            const pnr = b.pnr_number || b.pnr || b.booking_number;
            const isConfirmed = (b.booking_status || b.status) === 'confirmed';
            const isCancelled = (b.booking_status || b.status) === 'cancelled';

            return (
              <div key={b.id || pnr} className="sr-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--sr-border-card)', paddingBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BrandLogo variant="icon" size="xs" showText={false} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--sr-text-primary)' }}>
                        {b.travel_name || b.travelName || 'SMART ROUTE Travels'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--sr-text-secondary)' }}>
                        {b.bus_name || 'TATA Capella 2+1 AC Sleeper'} &middot; Service #{b.trip?.trip_number || b.trip_number || 'SR-101'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className={`badge ${isCancelled ? 'badge-warning' : 'badge-success'}`}>
                      {isCancelled ? 'Cancelled' : 'Confirmed & Paid'}
                    </span>
                    <div style={{ background: 'var(--sr-primary-subtle)', border: '1px solid var(--sr-primary-border)', padding: '4px 10px', borderRadius: 6 }}>
                      <span style={{ fontSize: 10, color: 'var(--sr-text-secondary)', fontWeight: 700, marginRight: 4 }}>PNR:</span>
                      <strong style={{ fontSize: 13, color: 'var(--sr-primary)', letterSpacing: '0.04em' }}>{pnr}</strong>
                    </div>
                  </div>
                </div>

                {/* Journey details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--sr-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Journey Corridor
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--sr-text-primary)', marginTop: 2 }}>
                      {b.trip?.source || b.source || 'Coimbatore'} ➔ {b.trip?.destination || b.destination || 'Tenkasi'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sr-text-secondary)', marginTop: 4 }}>
                      Boarding: <strong>{b.trip?.boarding_stop_name || b.boarding_stop || 'Omni Bus Stand'}</strong>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: 'var(--sr-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Departure Schedule
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sr-text-primary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} color="var(--sr-primary)" />
                      <span>{b.trip?.departure_date || b.departure_date || 'Today'}</span>
                      <Clock size={14} color="var(--sr-primary)" style={{ marginLeft: 6 }} />
                      <span>{b.trip?.departure_time || b.departure_time || '21:15'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sr-text-secondary)', marginTop: 4 }}>
                      Dropping: <strong>{b.trip?.dropping_stop_name || b.dropping_stop || 'Central Terminal'}</strong>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: 'var(--sr-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Fare Paid
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--sr-primary)', marginTop: 2 }}>
                      ₹{b.total_fare || b.total_amount || 850}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sr-text-secondary)', marginTop: 2 }}>
                      {b.passengers?.length || b.total_passengers || 1} Passenger(s)
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, borderTop: '1px solid var(--sr-border-card)', paddingTop: 14, flexWrap: 'wrap' }}>
                  <Link to={`/booking-success/${pnr}`} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 12, gap: 6 }}>
                    <Printer size={14} /> View / Print E-Ticket
                  </Link>

                  <Link to="/track" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 12, gap: 6, borderColor: 'rgba(16, 185, 129, 0.4)', color: '#059669' }}>
                    <Radio size={14} color="#059669" /> Live Bus Radar
                  </Link>

                  {isConfirmed && (
                    <button
                      type="button"
                      onClick={() => setReviewingBooking(b)}
                      className="btn btn-outline"
                      style={{ padding: '6px 14px', fontSize: 12, gap: 6, borderColor: '#F59E0B', color: '#D97706', fontWeight: 700 }}
                    >
                      <Star size={14} fill="#D97706" /> Rate Journey
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      type="button"
                      onClick={() => handleCancel(b.id, pnr)}
                      disabled={cancellingId === b.id}
                      className="btn btn-outline"
                      style={{ padding: '6px 14px', fontSize: 12, borderColor: 'rgba(239, 68, 68, 0.3)', color: '#DC2626' }}
                    >
                      <XCircle size={14} /> {cancellingId === b.id ? 'Processing...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewingBooking && (
        <PassengerReviewModal
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
          onSuccess={() => {
            alert('Thank you! Your verified rating and feedback have been published.');
            setReviewingBooking(null);
          }}
        />
      )}
    </div>
  );
}
