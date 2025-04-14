import React, { useState } from "react";
import { useTelepartyClient } from "./hooks/useTelepartySockets";
import { ChatRoom } from "./components/ChatRoom";
import { UserSettings } from "./components/UserSettings";

const App: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);
  const [roomId, setRoomId] = useState<string>("");
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false);
  const {
    createRoom,
    joinRoom,
    sendMessage,
    messages,
    sendTypingPresence,
    anyoneTyping,
  } = useTelepartyClient();

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
      {roomId ? (
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
