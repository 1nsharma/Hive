const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// ============================================
// PET MANAGEMENT
// ============================================

// Create Pet Profile
exports.createPet = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { name, breed, age, ownerId, photo } = req.body;
    
    try {
      const petRef = db.collection('pets');
      const pet = await petRef.add({
        name,
        breed,
        age,
        ownerId,
        photo: photo || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
        isLost: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ success: true, petId: pet.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Get Pet Profile (Public)
exports.getPet = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { petId } = req.query;
    
    try {
      const petDoc = await db.collection('pets').doc(petId).get();
      if (!petDoc.exists) {
        return res.status(404).json({ error: 'Pet not found' });
      }
      
      const pet = petDoc.data();
      res.json({
        id: petDoc.id,
        name: pet.name,
        breed: pet.breed,
        age: pet.age,
        isLost: pet.isLost,
        photo: pet.photo
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Toggle Lost Status
exports.toggleLost = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { petId, ownerId, isLost } = req.body;
    
    try {
      const petDoc = await db.collection('pets').doc(petId).get();
      if (!petDoc.exists) {
        return res.status(404).json({ error: 'Pet not found' });
      }
      
      const pet = petDoc.data();
      if (pet.ownerId !== ownerId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      await petDoc.ref.update({ isLost });
      res.json({ success: true, isLost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ============================================
// MARKETPLACE
// ============================================

// Create Order
exports.createOrder = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { userId, items, total, paymentId } = req.body;
    
    try {
      const orderRef = db.collection('orders');
      const order = await orderRef.add({
        userId,
        items,
        total,
        paymentId,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ success: true, orderId: order.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Get User Orders
exports.getUserOrders = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { userId } = req.query;
    
    try {
      const snapshot = await db.collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ============================================
// SERVICES
// ============================================

// Create Booking
exports.createBooking = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { userId, serviceId, serviceName, date, time, price } = req.body;
    
    try {
      const bookingRef = db.collection('bookings');
      const booking = await bookingRef.add({
        userId,
        serviceId,
        serviceName,
        date,
        time,
        price,
        status: 'confirmed',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ success: true, bookingId: booking.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Get User Bookings
exports.getUserBookings = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { userId } = req.query;
    
    try {
      const snapshot = await db.collection('bookings')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
      
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ============================================
// SUBSCRIPTIONS
// ============================================

// Create/Update Subscription
exports.updateSubscription = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { userId, productId, purchaseToken, status, expiryTime } = req.body;
    
    try {
      await db.collection('subscriptions').doc(userId).set({
        productId,
        purchaseToken,
        status,
        expiryTime: new Date(expiryTime),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Check Subscription Status
exports.checkSubscription = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { userId } = req.query;
    
    try {
      const subDoc = await db.collection('subscriptions').doc(userId).get();
      
      if (!subDoc.exists) {
        return res.json({ success: true, isPremium: false });
      }
      
      const sub = subDoc.data();
      const isPremium = sub.status === 'active' && 
        new Date(sub.expiryTime) > new Date();
      
      res.json({ success: true, isPremium, subscription: sub });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ============================================
// ANALYTICS
// ============================================

// Track Event
exports.trackEvent = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { event, data, userId } = req.body;
    
    try {
      await db.collection('analytics').add({
        event,
        data,
        userId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});
