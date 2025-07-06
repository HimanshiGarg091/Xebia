import React, { useEffect, useState } from "react";
import "./TherapistDashboard.css";

function TherapistDashboard() {
const [bookings, setBookings] = useState([]);
const [clients, setClients] = useState([]);
const [profile, setProfile] = useState({
    name: "",
    role: "",
    status: "",
});
const [editMode, setEditMode] = useState(false);
const [profileInput, setProfileInput] = useState(profile);

useEffect(() => {
    // Fetch therapist profile (name, role, status) with JWT token
    const token = localStorage.getItem('jwtToken');
    fetch("/api/therapist/profile", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
        setProfile({
        name: data.name || "Therapist",
        role: data.role || "Licensed Therapist",
        status: data.status || "Available"
        });
        setProfileInput({
        name: data.name || "Therapist",
        role: data.role || "Licensed Therapist",
        status: data.status || "Available"
        });
    })
    .catch(() => {
        setProfile({
        name: "Therapist",
        role: "Licensed Therapist",
        status: "Available"
        });
        setProfileInput({
        name: "Therapist",
        role: "Licensed Therapist",
        status: "Available"
        });
    });


    // Fetch bookings
    fetch("/api/therapist/bookings", { credentials: "include" })
    .then(res => res.json())
    .then(data => setBookings(data))
    .catch(() => {
        setBookings([
        { time: "10:00 AM", client: "Linda Johnson", status: "Confirm", mode: "Video" },
        { time: "1:30 PM", client: "Michelle Smith", status: "Pending", mode: "Video" },
        { time: "3:00 PM", client: "Jason Brown", status: "Confirm", mode: "In-person" }
        ]);
    });

    // Fetch clients
    fetch("/api/therapist/clients", { credentials: "include" })
    .then(res => res.json())
    .then(data => setClients(data.map(c => c.name || c.email)))
    .catch(() => {
        setClients(["Emma Wilson", "Linda Johnson", "Mark Turner", "Sarah Lee"]);
    });
}, []);

  // Handle profile editing
const handleProfileChange = e => {
    setProfileInput({ ...profileInput, [e.target.name]: e.target.value });
};

const handleProfileSave = () => {
    fetch("/api/therapist/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profileInput)
    })
    .then(res => res.json())
    .then(() => {
        setProfile(profileInput);
        setEditMode(false);
    });
};

return (
    <div className="tdb-root">
    <div className="tdb-center-wrapper">
        <div className="tdb-header">
        <div>
            <h1>Welcome back, {profile.name || "Therapist"}!</h1>
            <div className="tdb-date">
            {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
            </div>
            <div className="tdb-sub">Here’s a quick overview of your day.</div>
        </div>
        <div className="tdb-avatar" />
        </div>
        <div className="tdb-main">
        <div className="tdb-card tdb-bookings">
            <h2>My Bookings</h2>
            <table>
            <thead>
                <tr>
                <th>TIME</th>
                <th>CLIENT</th>
                <th>STATUS</th>
                <th>MODE</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map((b, i) => (
                <tr key={i}>
                    <td>{b.time}</td>
                    <td>{b.client}</td>
                    <td>{b.status}</td>
                    <td>{b.mode}</td>
                </tr>
                ))}
            </tbody>
            </table>
            <button className="tdb-btn">View All Bookings</button>
        </div>
        <div className="tdb-side">
            <div className="tdb-card tdb-profile">
            <div className="tdb-profile-avatar" />
            {editMode ? (
                <div className="tdb-profile-edit">
                <input
                    name="name"
                    value={profileInput.name}
                    onChange={handleProfileChange}
                    placeholder="Name"
                />
                <input
                    name="role"
                    value={profileInput.role}
                    onChange={handleProfileChange}
                    placeholder="Role"
                />
                <input
                    name="status"
                    value={profileInput.status}
                    onChange={handleProfileChange}
                    placeholder="Status"
                />
                <button onClick={handleProfileSave}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
                </div>
            ) : (
                <>
                <div className="tdb-profile-name">{profile.name}</div>
                <div className="tdb-profile-role">{profile.role}</div>
                <div className="tdb-profile-status">{profile.status}</div>
                <button className="tdb-edit-btn" onClick={() => setEditMode(true)}>
                    Edit Profile
                </button>
                </>
            )}
            </div>
            <div className="tdb-card tdb-clients">
            <h3>Contact Clients</h3>
            <ul>
                {clients.map((c, i) => (
                <li key={i}>{c}</li>
                ))}
            </ul>
            </div>
        </div>
        </div>
        <div className="tdb-empty-card"></div>
    </div>
    </div>
);
}

export default TherapistDashboard;
