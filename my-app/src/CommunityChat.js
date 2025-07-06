import React, { useState, useEffect, useRef } from "react";
import {
MainContainer,
ChatContainer,
MessageList,
MessageInput,
Message
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Change if needed

function CommunityChat({ user }) {
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");
const socketRef = useRef();

useEffect(() => {
    // 1. Fetch chat history
    axios.get(`${SOCKET_SERVER_URL}/api/community/messages`)
    .then(res => setMessages(res.data))
    .catch(err => console.error(err));

    // 2. Connect to Socket.IO server
    socketRef.current = io(SOCKET_SERVER_URL);

    // 3. Listen for incoming messages
    socketRef.current.on("receiveMessage", (msg) => {
    setMessages(prev => [...prev, msg]);
    });

    // Debug: log connection
    socketRef.current.on("connect", () => {
    console.log("Connected to Socket.IO server:", socketRef.current.id);
    });

    // Cleanup on unmount
    return () => {
    socketRef.current.disconnect();
    };
}, []);

  // 4. Send message to backend via Socket.IO
const handleSend = () => {
    if (input.trim() !== "") {
    const msg = {
        sender: user?.name || "Anonymous",
        message: input,
        sentTime: new Date()
    };
    socketRef.current.emit("sendMessage", msg);
    setInput("");
    }
};

return (
    <div style={{ height: "350px", width: "350px" }}>
    <MainContainer>
        <ChatContainer>
        <MessageList>
            {messages.map((msg, idx) => (
            <Message
                key={msg._id || idx}
                model={{
                message: msg.message,
                sentTime: new Date(msg.sentTime).toLocaleTimeString(),
                sender: msg.sender,
                direction: msg.sender === (user?.name || "Anonymous") ? "outgoing" : "incoming"
                }}
            />
            ))}
        </MessageList>
        <MessageInput
            placeholder="Type message here"
            value={input}
            onChange={val => setInput(val)}
            onSend={handleSend}
            attachButton={false}
            sendButton={true}
        />
        </ChatContainer>
    </MainContainer>
    </div>
);
}

export default CommunityChat;
