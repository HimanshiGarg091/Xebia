import React,{ useState, useEffect } from "react";
import "./App.css";
import "./TherapistForm.css";


function TherapistForm({ onClose, onSubmit }) {
    const [therapists, setTherapists] = useState([]);

useEffect(() => {
    fetch("http://localhost:5000/api/therapists")
    .then(res => res.json())
    .then(data => setTherapists(data))
    .catch(() => setTherapists([]));
}, []);
const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(e.target);
    const booking = {
    name: formData.get("name"),
    age: formData.get("age"),
    phone: formData.get("phone"),
    doctor: formData.get("doctor"),
    date: formData.get("date"),
    time: formData.get("time"),
    };

    try {
    const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
    });
    const data = await res.json();
    if (res.ok) {
        alert("Appointment booked successfully!");
        if (onSubmit) onSubmit();
        onClose();
    } else {
        alert(data.error || "Booking failed");
    }
    } catch (err) {
    alert("Server error");
    }
};

return (
    <div className="form-popup">
    <form  onSubmit={handleSubmit}>
        <h2>Book a Therapist Appointment</h2>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="age">Age</label>
        <input type="number" id="age" name="age" min="1" required />

        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" required />

        <label htmlFor="doctor">Choose Doctor</label>
        <select id="doctor" name="doctor" required>
        <option value="">Select a doctor</option>
        {therapists.map(t => (
            <option key={t._id} value={t._id}>
            {t.name ? t.name : t.email}
            </option>
        ))}
        </select>

        <label htmlFor="date">Date</label>
        <input type="date" id="date" name="date" required />

        <label htmlFor="time">Time Slot</label>
        <input type="time" id="time" name="time" required />

        <button type="submit" className="btn">Book Appointment</button>
        <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
    </form>
    </div>
);
}

export default TherapistForm;
