import React, { useState, useEffect } from "react";
import "./ChatRoom.css";
import { SessionChatMessage } from "teleparty-websocket-lib";
import { useTelepartyClient } from "../hooks/useTelepartySockets";

interface ChatRoomProps {
  roomId: string;
  nickname: string;
  userIcon?: string;
  sendMessage: (body: string) => void;
  messages: SessionChatMessage[];
  isRoomCreator: boolean;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  nickname,
  isRoomCreator,
  sendMessage,
  messages,
}) => {
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { sendTypingPresence, anyoneTyping } = useTelepartyClient();

  const roomLink = `${window.location.origin}${window.location.pathname}?roomId=${roomId}`;

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Send typing status when typing changes
    console.log("reached typing", isTyping);
    sendTypingPresence(isTyping);
  }, [isTyping, sendTypingPresence]);

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
  return (
    <div>
      <h3>Chat Room: {roomId}</h3>
      <h3>User Name: {nickname}</h3>
      {isRoomCreator ? <h3>Room Creator</h3> : null}
      {anyoneTyping && <p>Someone is typing...</p>}

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleCopyLink}>Copy Room Link</button>
        {copied && (
          <span style={{ marginLeft: "10px", color: "green" }}>Copied!</span>
        )}
      </div>
      <div className="messages">
        {messages.map((msg) => {
          console.log("msg");
          return (
            <div key={msg.permId}>
              <div>
                {msg.userIcon && <img src={msg.userIcon} alt="User Icon" />}
                <strong>{msg.userNickname}</strong>:
              </div>
              <div>{msg.body}</div>
            </div>
          );
        })}
      </div>
      <div className="send-message-parent">
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          onBlur={handleBlur}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
