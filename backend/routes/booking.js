const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Route to create a new booking
router.post('/bookings', async (req, res) => {
    console.log("Received booking:", req.body);
try {
    const { name, age, phone, doctor, date, time } = req.body;
    if (!name || !age || !phone || !doctor || !date || !time) {
    return res.status(400).json({ error: 'All fields are required.' });
    }
    const booking = new Booking({ name, age, phone, doctor, date, time });
    await booking.save();
    res.status(201).json({ message: 'Booking saved successfully.', booking });
} catch (err) {
    console.error('Booking save error:', err);
    res.status(500).json({ error: 'Server error' });
}
});

module.exports = router;
