import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";
import { SessionChatMessage } from "teleparty-websocket-lib";

// Inside ChatRoom component
interface ChatRoomProps {
  roomId: string;
  nickname: string;
  userIcon?: string;
  sendMessage: (body: string) => void;
  messages: SessionChatMessage[];
  isRoomCreator: boolean;
  anyoneTyping: boolean;
  sendTypingPresence: (typing: boolean) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  nickname,
  isRoomCreator,
  sendMessage,
  sendTypingPresence,
  anyoneTyping,
  messages,
}) => {
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const roomLink = `${window.location.origin}${window.location.pathname}?roomId=${roomId}`;
  window.history.pushState({}, "", roomLink);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.log("reached typing", isTyping);
    sendTypingPresence(isTyping);

    return () => {
      sendTypingPresence(false);
    };
  }, [isTyping, sendTypingPresence]);

  // for saving the session in local storage
  //useEffect(() => {
  //  localStorage.setItem("roomId", roomId);
  //  localStorage.setItem("nickname", nickname);
  //}, [roomId, nickname]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!isTyping) {
      console.log("user started typing");
      setIsTyping(true);
    }
  };

  const handleBlur = () => {
    setIsTyping(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLeaveRoom = () => {
    localStorage.removeItem("roomId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("userIcon");

    // Clear the roomId from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("roomId");
    window.history.replaceState({}, "", url.pathname);

    // Reload to reset the app state
    window.location.reload();
  };

  return (
    <div>
      <h3>Chat Room: {roomId}</h3>
      <h3>User Name: {nickname}</h3>
      {isRoomCreator ? <h3>Room Creator</h3> : null}
      <button onClick={handleLeaveRoom} className="leave-room-button">
        Leave Room
      </button>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleCopyLink}>Copy Room Link</button>
        {copied && (
          <span style={{ marginLeft: "10px", color: "green" }}>Copied!</span>
        )}
      </div>
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.permId}
            className={`chat-bubble ${msg.userNickname === nickname ? "self-message" : "other-message"}`}
          >
            <div className="chat-meta">
              {msg.userIcon && <img src={msg.userIcon} alt="User Icon" />}
              <strong>{msg.userNickname}</strong>
            </div>
            <div className="message-text">{msg.body}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="send-message-parent">
        <div className="typing-indicator">
          {anyoneTyping && <p>💬 Someone is typing...</p>}
        </div>
        <div className="send-message-child">
          <div className="input-area">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};
