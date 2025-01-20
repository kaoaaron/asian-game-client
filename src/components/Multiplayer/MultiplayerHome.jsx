import React, { useState } from "react";
import { io } from "socket.io-client";

const MultiplayerRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const sendMessage = () => {
    if (socket && message.trim()) {
      const chatMessage = {
        playerName,
        message,
        roomId,
      };
      socket.emit("chatMessage", chatMessage);
      setMessage("");
    }
  };

  const createRoom = async () => {
    if (!roomId || !playerName) {
      alert("Please enter both room ID and player name");
      return;
    }

    try {
      const response = await fetch("/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, playerName }),
      });
      const data = await response.json();
      console.log("Room Created:", data);

      // Initialize the socket connection
      const newSocket = io("wss://ws.guesstheasian.com", {
        query: { roomId, playerName },
        transports: ["websocket"], // Ensure WebSocket is the only transport
      });
      setSocket(newSocket);

      // Listen for incoming messages
      newSocket.on("chatMessage", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async () => {
    if (!roomId || !playerName) {
      alert("Please enter both room ID and player name");
      return;
    }

    try {
      const response = await fetch("/room/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, playerName }),
      });
      const data = await response.json();
      console.log("Joined Room:", data);

      // Initialize the socket connection
      const newSocket = io("wss://ws.guesstheasian.com", {
        query: { roomId, playerName },
        transports: ["websocket"], // Ensure WebSocket is the only transport
      });
      setSocket(newSocket);

      // Listen for incoming messages
      newSocket.on("chatMessage", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        newSocket.close();
      };
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div>
      <h1>Work in Progress. Not available yet.</h1>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>

      <div>
        <h3>Chat</h3>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.playerName}:</strong> {msg.message}
            </p>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MultiplayerRoom;
