import React, { useState, useEffect } from "react";
import "./UserSettings.css";

interface UserSettingsProps {
  nickname: string;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  userIcon: string | undefined;
  setUserIcon: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleCreateRoom: () => void;
  handleJoinRoom: (roomId: string) => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({
  nickname,
  setNickname,
  userIcon,
  setUserIcon,
  handleCreateRoom,
  handleJoinRoom,
}) => {
  const [inputRoomId, setInputRoomId] = useState<string>("");

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomFromQuery = queryParams.get("roomId");

    if (roomFromQuery) {
      setInputRoomId(roomFromQuery);
    }
  }, []);

  return (
    <div className="user-settings-container">
      <h2>Welcome to Teleparty Chat!</h2>

      <div className="form-group">
        <label htmlFor="nickname">Nickname:</label>
        <input
          id="nickname"
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label htmlFor="userIcon">Upload User Icon:</label>
        <input
          id="userIcon"
          type="file"
          accept="image/*"
          onChange={handleIconUpload}
          className="file-input"
        />
        {userIcon && (
          <img src={userIcon} alt="User Icon" className="user-icon-preview" />
        )}
      </div>

      <div className="action-buttons">
        <button onClick={handleCreateRoom} className="btn btn-primary">
          Create Room
        </button>
        <div className="join-room">
          <label htmlFor="roomId">Or Join Room (Enter Room ID):</label>
          <div className="room-id-input">
            <input
              id="roomId"
              type="text"
              placeholder="Room ID"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              className="input-field"
            />
            <button
              onClick={() => handleJoinRoom(inputRoomId)}
              className="btn btn-secondary"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
