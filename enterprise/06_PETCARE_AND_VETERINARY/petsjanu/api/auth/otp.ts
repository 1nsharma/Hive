import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, phone, otp } = req.body;

  if (action === 'send') {
    if (!phone || phone.length < 8) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }
    // Mock OTP dispatch
    return res.status(200).json({
      success: true,
      message: 'OTP sent via SMS successfully',
      demoOtp: '1234'
    });
  }

  if (action === 'verify') {
    if (otp === '1234' || otp?.length === 4) {
      return res.status(200).json({
        success: true,
        user: {
          id: 'usr-' + Date.now(),
          phone: phone || '+91 63937 41171',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Date.now()
      });
    }
    return res.status(400).json({ error: 'Invalid OTP code. Use 1234 for demo.' });
  }

  return res.status(400).json({ error: 'Invalid action parameter' });
}
