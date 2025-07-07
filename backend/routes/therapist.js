const express = require('express');
const multer = require('multer');
const Therapist = require('../models/Therapist');
const Booking = require('../models/Booking');
const Client = require('../models/Client');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Register therapist
router.post('/', upload.single('credentials'), async (req, res) => {
  try {
    const { name, email, password, license, expertise, years, institution } = req.body;
    const credentialsUrl = req.file ? req.file.path : '';
    const therapist = new Therapist({
      name,
      email,
      password,
      license,
      expertise: Array.isArray(expertise) ? expertise : [expertise],
      years,
      institution,
      credentialsUrl,
    });
    await therapist.save();
    res.status(201).json({ message: 'Therapist registered', therapist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/therapist/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const therapistId = req.user && req.user.id;
    if (!therapistId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const therapist = await Therapist.findById(therapistId).select('name email role status');
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    res.json({
      name: therapist.name,
      email: therapist.email,
      role: therapist.role || "Licensed Therapist",
      status: therapist.status || "Available"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/therapist/profile (update profile)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const therapistId = req.user && req.user.id;
    if (!therapistId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { name, role, status } = req.body;
    await Therapist.findByIdAndUpdate(therapistId, { name, role, status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/therapist/bookings
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const therapistId = req.user && req.user.id;
    if (!therapistId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const bookings = await Booking.find({ doctor: therapistId }).populate('client');
    res.json(bookings.map(b => ({
      time: b.time,
      client: b.client ? b.client.name : 'Unknown',
      status: b.status,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/therapist/clients
router.get('/clients', authMiddleware, async (req, res) => {
  try {
    const therapistId = req.user && req.user.id;
    if (!therapistId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const bookings = await Booking.find({ doctor: therapistId }).populate('client');
    // Get unique client names
    const clients = [
      ...new Set(
        bookings
          .filter(b => b.client && b.client.name)
          .map(b => b.client.name)
      ),
    ];
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// const express = require('express');
// const multer = require('multer');
// const Therapist = require('../models/Therapist');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'backend/uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// router.post('/', upload.single('credentials'), async (req, res) => {
//   try {
//     const {name, email, password, license, expertise, years, institution } = req.body;
//     const credentialsUrl = req.file ? req.file.path : '';
//     const therapist = new Therapist({
//       name,
//       email,
//       password,
//       license,
//       expertise: Array.isArray(expertise) ? expertise : [expertise],
//       years,
//       institution,
//       credentialsUrl,
//     });
//     await therapist.save();
//     res.status(201).json({ message: 'Therapist registered', therapist });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // GET /api/therapist/profile
// router.get('/profile', authMiddleware, async (req, res) => {
//   try {
//     const therapistId = req.user && req.user.id;
//     if (!therapistId) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }
//     const therapist = await Therapist.findById(therapistId).select('name email role status');
//     if (!therapist) {
//       return res.status(404).json({ error: "Therapist not found" });
//     }
//     res.json({
//       name: therapist.name,
//       email: therapist.email,
//       role: therapist.role || "Licensed Therapist",
//       status: therapist.status || "Available"
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// module.exports = router;
