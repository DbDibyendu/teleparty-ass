import { useEffect, useState, useRef } from "react";
import {
  TelepartyClient,
  SocketEventHandler,
  SocketMessageTypes,
  SessionChatMessage,
  MessageList,
} from "teleparty-websocket-lib";

interface SetTypingMessageData {
  typing: boolean;
}

interface TypingMessageData {
  anyoneTyping: boolean;
  usersTyping: string[];
}

export const useTelepartyClient = () => {
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [anyoneTyping, setAnyoneTyping] = useState<boolean>(false);

  const clientRef = useRef<TelepartyClient | null>(null);

  const connectClient = () => {
    if (clientRef.current !== null) return; // Already connected

    const handler: SocketEventHandler = {
      onConnectionReady: () => {
        setIsConnected(true);
      },
      onClose: () => {
        setIsConnected(false);
        connectClient();
        console.warn("Socket closed.");
      },
      onMessage: (message) => {
        console.log("show message", message);
        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          setMessages((prev) => [...prev, message.data]);
        } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const typingData: TypingMessageData = message.data;
          setAnyoneTyping(typingData.anyoneTyping);
        }
      },
    };

    const newClient = new TelepartyClient(handler);
    clientRef.current = newClient;
  };

  useEffect(() => {
    connectClient(); // Initial connection on mount

    return () => {
      clientRef.current = null;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Checking connection.. ");
      if (!clientRef.current) {
        console.log("Client is null. Reconnecting...");
        setIsConnected(false);
        connectClient();
      }
    }, 5000); // check every 5s

    return () => clearInterval(interval);
  }, []);

  // All utilities are written below
  const sendTypingPresence = (typing: boolean) => {
    if (clientRef.current) {
      const typingData: SetTypingMessageData = { typing };
      clientRef.current.sendMessage(
        SocketMessageTypes.SET_TYPING_PRESENCE,
        typingData,
      );
    }
  };

  const createRoom = async (nickname: string, userIcon?: string) => {
    if (!isConnected || !clientRef.current) {
      alert("Connection failed, please reload page");
      return;
    }
    if (!nickname) {
      alert("Please enter username");
      return;
    }
    const roomId = await clientRef.current.createChatRoom(nickname, userIcon);
    return roomId;
  };

  const joinRoom = async (
    nickname: string,
    roomId: string,
    userIcon?: string,
  ) => {
    if (!nickname) {
      alert("Please enter username");
      return false;
    } else if (!isConnected || !clientRef.current) {
      alert("Connection failed, Please reload");
      return false;
    } else if (!roomId) {
      alert("Wrong Room Id");
      return false;
    }

    try {
      const sessionData: MessageList = await clientRef.current.joinChatRoom(
        nickname,
        roomId,
        userIcon,
      );

      setMessages(sessionData.messages);
    } catch {
      alert("No active Session");
      return false;
    }
    return true;
  };

  const sendMessage = (body: string) => {
    if (clientRef.current) {
      const msg = { body };
      clientRef.current.sendMessage(SocketMessageTypes.SEND_MESSAGE, msg);
    }
  };

  return {
    sendTypingPresence,
    createRoom,
    joinRoom,
    sendMessage,
    messages,
    isConnected,
    anyoneTyping,
  };
};
