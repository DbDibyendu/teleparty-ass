import React, { useEffect, useState } from "react";
import { useTelepartyClient } from "./hooks/useTelepartySockets";
import { ChatRoom } from "./components/ChatRoom";
import { UserSettings } from "./components/UserSettings";

const App: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);
  const [roomId, setRoomId] = useState<string>("");
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false);
  const [isTryingRejoin, setIsTryingRejoin] = useState<boolean>(true); // for loader

  const {
    createRoom,
    joinRoom,
    sendMessage,
    messages,
    sendTypingPresence,
    anyoneTyping,
    isConnected,
  } = useTelepartyClient();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomFromQuery = queryParams.get("roomId");

    const tryRejoin = async () => {
      const savedRoomId = roomFromQuery || sessionStorage.getItem("roomId");
      const savedNickname = sessionStorage.getItem("nickname");

      if (savedRoomId && savedNickname && isConnected) {
        const joined = await joinRoom(savedNickname, savedRoomId, "");
        if (joined) {
          setNickname(savedNickname);
          setRoomId(savedRoomId);
          setIsRoomCreator(false);
        } else {
          sessionStorage.clear();
        }
      }
      setIsTryingRejoin(false);
    };

    if (isConnected) {
      setTimeout(() => tryRejoin(), 1200);
    }
  }, [isConnected]);

  const handleCreateRoom = async () => {
    if (nickname) {
      const newRoomId = await createRoom(nickname, userIcon);
      setRoomId(newRoomId as string);
      setIsRoomCreator(true);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    const ableToJoin = await joinRoom(nickname, roomId, userIcon);
    if (ableToJoin) {
      setRoomId(roomId);
      setIsRoomCreator(false);
    }
  };

  return (
    <div className="App">
      {isTryingRejoin ? (
        <div className="text-center mt-10 text-lg">Connecting...</div>
      ) : roomId ? (
        <ChatRoom
          isRoomCreator={isRoomCreator}
          roomId={roomId}
          nickname={nickname}
          userIcon={userIcon}
          sendMessage={sendMessage}
          messages={messages}
          sendTypingPresence={sendTypingPresence}
          anyoneTyping={anyoneTyping}
        />
      ) : (
        <UserSettings
          nickname={nickname}
          setNickname={setNickname}
          userIcon={userIcon}
          setUserIcon={setUserIcon}
          handleCreateRoom={handleCreateRoom}
          handleJoinRoom={handleJoinRoom}
        />
      )}
    </div>
  );
};

export default App;
