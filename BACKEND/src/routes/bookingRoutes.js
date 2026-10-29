import { Router } from 'express';
import {
  createBooking,
  getBookingByPNR,
  getBookingTracking,
  getPassengerBookings,
  cancelBooking,
  verifyTicketQR,
  downloadBookingTicketPdf,
} from '../controllers/bookingController.js';
import { authenticate, authenticateOptional, authorizeRole } from '../middleware/auth.js';
import { ROLES } from '../permissions/roles.js';

const router = Router();

// Create booking (Authenticated or Guest with contact info)
router.post('/', authenticateOptional, createBooking);

// Download Single-Page E-Ticket PDF
router.get('/pnr/:pnr/pdf', downloadBookingTicketPdf);
router.get('/pnr/:pnr/download-ticket', downloadBookingTicketPdf);
router.get('/:pnr/pdf', downloadBookingTicketPdf);
router.get('/:pnr/download-ticket', downloadBookingTicketPdf);

// Retrieve booking by PNR (Public with matching contact, or Authenticated owner)
router.get('/pnr/:pnr/tracking', getBookingTracking);
router.get('/pnr/:pnr', getBookingByPNR);
router.get('/:pnr', getBookingByPNR);

// Passenger bookings history
router.get('/my-bookings', authenticate, getPassengerBookings);

// Cancel booking
router.post('/:bookingId/cancel', authenticate, cancelBooking);

// QR Ticket verification (Driver, Staff, Manager)
router.post(
  '/verify-qr',
  authenticate,
  authorizeRole(ROLES.DRIVER, ROLES.STAFF, ROLES.MANAGER, ROLES.TRAVEL_OWNER),
  verifyTicketQR
);

export default router;
