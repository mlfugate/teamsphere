"use client";
import "./globals.css";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { socket } from "../socket"; // Import socket from socket.js

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      // Monitor transport upgrades
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    // Listen for connection and disconnection events
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const handleSendMessage = () => {
    //Emit the message to the server
    socket.emit("send_message", newMessage);
    setNewMessage(""); //Clear the input field
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>TeamSphere</h1>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>

        {/* Display messages  */}
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}

          {/* Input field for messages */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </main>
    </div>
  );
}
