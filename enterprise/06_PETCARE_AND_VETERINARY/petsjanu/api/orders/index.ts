import type { Request, Response } from 'express';
import { SEEDED_ORDERS, SEEDED_BOOKINGS } from '../../src/lib/mockData';

let orders = [...SEEDED_ORDERS];
let bookings = [...SEEDED_BOOKINGS];

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    return res.status(200).json({ orders, bookings });
  }

  if (req.method === 'POST') {
    const { type, payload } = req.body;

    if (type === 'order') {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        petName: payload.petName || 'Buddy',
        items: payload.items || [],
        totalPrice: payload.totalPrice || '₹499',
        shippingAddress: payload.shippingAddress || '12-A Green Park, New Delhi',
        phone: payload.phone || '+91 63937 41171',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Processing' as const,
        paymentId: `pay_${Math.random().toString(36).substring(2, 11)}`
      };
      orders.unshift(newOrder);
      return res.status(201).json({ success: true, order: newOrder });
    }

    if (type === 'booking') {
      const newBooking = {
        id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceId: payload.serviceId,
        serviceName: payload.serviceName,
        petId: payload.petId,
        petName: payload.petName,
        date: payload.date,
        timeSlot: payload.timeSlot,
        address: payload.address,
        notes: payload.notes || '',
        priceFormatted: payload.priceFormatted,
        status: 'Confirmed' as const,
        createdAt: new Date().toISOString()
      };
      bookings.unshift(newBooking);
      return res.status(201).json({ success: true, booking: newBooking });
    }

    return res.status(400).json({ error: 'Invalid order type' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
