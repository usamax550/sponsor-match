import React, { useState } from "react";
import Modal from "../modal";

const Message = ({ message, sent, ai, avatar }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!message) return null;

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messageAlignment = sent ? "flex-row-reverse" : "flex-row";
  const timeAlignment = sent ? "self-start" : "self-end";

  const getBubbleClasses = () => {
    if (sent) return "bg-primary text-white rounded-br-none";
    if (ai) return "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-300";
    return "bg-white text-black rounded-bl-none";
  };

  return (
    <div className={`flex items-end gap-4 ${messageAlignment}`}>
      <div className={`chat-image w-12 h-12 bg-white ${avatar ? "p-0" : ""}`}>
        <img
          src={avatar || "/icons/profile.svg"}
          alt=""
          className="h-12 object-cover rounded-md"
        />
      </div>




      <div className="text-sm h-full flex flex-col justify-center gap-2 max-w-[45%] max-sm:max-w-[65%]">
        <p className={`text-xs text-gray-500 ${timeAlignment}`}>
          {formattedTime}
        </p>

        {!message.attachment &&  (
          <div className={`flex items-center h-full min-h-12 p-2 rounded-lg ${getBubbleClasses()}`}>
            <p className="leading-tight">{message.content}</p>
          </div>
        )}

        {message.attachment && (
          <img
            onClick={() => setIsImageOpen(true)}
            src={message.attachment}
            alt="attachment"
            className="max-w-full rounded-lg cursor-pointer"
          />
        )}

        <Modal
          isOpen={isImageOpen}
          onClose={() => setIsImageOpen(false)}
          imageModal={true}
        >
          <div className="py-2">
            <img src={message.attachment} alt="" className="w-full h-full" />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Message;
