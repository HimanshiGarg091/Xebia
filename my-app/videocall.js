import React, { useEffect, useRef } from 'react';

const VideoCall = ({ roomName, displayName, onClose }) => {
    const jitsiContainerRef = useRef(null);
    let api = null;

    useEffect(() => {
        // Load Jitsi when component mounts
        const domain = 'meet.jit.si';
        const options = {
            roomName: roomName,
            parentNode: jitsiContainerRef.current,
            width: '100%',
            height: '100%',
            userInfo: {
                displayName: displayName,
            },
        };

        api = new window.JitsiMeetExternalAPI(domain, options);

        // Optionally handle Jitsi events
        api.addEventListener('readyToClose', () => {
            onClose();
        });

        return () => api?.dispose(); // Cleanup on unmount
    }, [roomName, displayName, onClose]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    cursor: 'pointer',
                }}
            >
                End Call
            </button>
            <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default VideoCall;