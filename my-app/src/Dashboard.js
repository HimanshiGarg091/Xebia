import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const meetingId = queryParams.get('room') || 'MindMendDefaultRoom';

return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h2>Video Call Session</h2>
    <iframe
        src={`https://meet.jit.si/${meetingId}`}
        style={{ height: '600px', width: '100%', border: '0px' }}
        allow="camera; microphone; fullscreen; display-capture"
        title={`Jitsi Meeting - ${meetingId}`}
    />
    </div>
);
};

export default Dashboard;
