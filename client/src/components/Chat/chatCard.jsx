import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { incrementCount } from "../../api/ads";
import { incrementProfileViews } from "../../api/user.api";

const ChatCard = ({
  selected,
  newMessages,
  role,
  selectChat,
  name,
  avatar,
  lastMessage,
  openProfile,
}) => {
  const navigate = useNavigate();

  const handleOpenProfile = async() => {
    await incrementProfileViews(openProfile);
    navigate(`/profile/${openProfile}`);
  };

  return (
    <div
      className={`flex items-stretch gap-2 h-16 p-2 rounded-md cursor-pointer ${
        selected
          ? "bg-primary text-white"
          : newMessages > 0
          ? "bg-chatNotification hover:bg-chatCardBg"
          : "bg-white hover:bg-chatCardBg"
      }`}
      onClick={() => {
        if (openProfile) {
          handleOpenProfile();
        } else {
          selectChat && selectChat();
        }
      }}
    >
      <div className={"chat-image " + (avatar ? "p-0" : null)}>
        <img
          src={avatar || "/icons/profile.svg"}
          alt=""
          className="h-full object-cover max-w-none w-full"
        />
      </div>
      <div className="text-sm h-full flex flex-col justify-center">
        <h3 className="mb-auto">{name}</h3>
        <div className="flex items-center h-full">
          <p
            className={`text-xs leading-tight line-clamp-2 ${
              newMessages > 0 || (role && "text-primary italic font-semibold")
            }`}
          >
            {newMessages > 0 ? "New Message" : role ? role : lastMessage}
          </p>
        </div>
      </div>
      <div
        className={`ml-auto flex items-center pr-3 ${!newMessages && "hidden"}`}
      >
        <p className="text-sm bg-primary rounded-full w-5 grid place-content-center text-white">
          {newMessages}
        </p>
      </div>
    </div>
  );
};

export default ChatCard;
