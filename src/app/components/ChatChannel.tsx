"use client";
import { socket } from "@/socket";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Message {
  sender: string;
  text: string;
}

export default function ChatChannel() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const { user } = useUser();
  //   const [roomId, setRoomId] = useState<string>("");
  const roomId = "General Room";
  useEffect(() => {
    fetch("/api/rooms")
      // fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched initial messages", data);
        const firstRoom = data[0];
        setMessages(firstRoom?.messages || []);
      })
      .catch((error) => console.error("Error fetching messages", error));
  }, []);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function handleMessageObject(msg: unknown) {
      //   let messageObj: Message;
      //   if (typeof msg === "string") {
      //     messageObj = { sender: user?.firstName || "unknown", text: msg };
      //     console.log(messageObj);
      //   } else {
      //     messageObj = msg as Message;
      //   }
      //   setMessages((prevMessages) => [...prevMessages, messageObj]);
      const messageObj = msg as Message;
      setMessages((prevMessages) => [...prevMessages, messageObj]);
    }
    // return () => {
    //   socket.on("connect", onConnect);
    //   socket.on("disconnect", onDisconnect);
    //   socket.on("message", (message: string) => {
    //     setMessages((prevMessages) => [...prevMessages, message]);
    //   });
    // };

    //register event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", handleMessageObject);
    socket.on("room_message", handleMessageObject);

    //Clean up event listeners on component unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", handleMessageObject);
      socket.off("room_message", handleMessageObject);
    };
  }, []);

  const handleJoinRoom = () => {
    if (roomId) {
      socket.emit("join_room", roomId);
    }
  };
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Create a message object with sender info frozen at send time
    const messageData: Message = {
      sender: user?.firstName || user?.id || "unknown",
      text: newMessage,
    };

    // Emit the message object to the server
    // socket.emit("send_message", messageData);

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <>
      <h2>Channel Name</h2>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      {/* Users */}
      <div
        style={{
          padding: "24px 24px 24px 0",
        }}
      >
        <h2>Welcome, {user?.firstName}</h2>
        {/* <p>Your User ID {user?.id}</p> */}
      </div>
      {/* Room Id Input >>>>>  */}
      <input
        type="text"
        value={roomId}
        readOnly //remove once adding onChange
        //will need to add onChange once roomId isn't hard coded
        placeholder="Enter Room ID"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleJoinRoom();
          }
        }}
      />
      <button type="submit" onClick={handleJoinRoom}>
        Join Room
      </button>

      {/* Message: */}
      <div>
        <div>Message BOX</div>
        {messages.map((message, index) => (
          <div
            style={{
              border: "2px solid #fff",
              padding: "24px",
              margin: "24px 0",
            }}
            key={index}
          >
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>

      {/* Inputs */}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        placeholder="Type a message..."
      />

      <button type="submit" onClick={handleSendMessage}>
        Send Message
      </button>
    </>
  );
}
