import React, { useState } from "react";
import { useTelepartyClient } from "./hooks/useTelepartySockets";
import { ChatRoom } from "./components/ChatRoom";
import { UserSettings } from "./components/UserSettings";

const App: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);
  const [roomId, setRoomId] = useState<string>("");
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false);
  const { createRoom, joinRoom, sendMessage, messages } = useTelepartyClient();

  const handleCreateRoom = async () => {
    if (nickname) {
      const newRoomId = await createRoom(nickname, userIcon);
      setRoomId(newRoomId);
      setIsRoomCreator(true);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinRoom(nickname, roomId, userIcon);
      setRoomId(roomId);
      setIsRoomCreator(false);
    } catch (error) {
      console.error("Failed to join room:", error);
      alert("Enter Nickname or Invalid room ID or connection error.");
    }
  };

  return (
    <div className="App">
      {roomId ? (
        <ChatRoom
          isRoomCreator={isRoomCreator}
          roomId={roomId}
          nickname={nickname}
          userIcon={userIcon}
          sendMessage={sendMessage}
          messages={messages}
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
