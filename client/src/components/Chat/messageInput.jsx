import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sendMessage } from "../../api/chats.api";
import queryKeys from "../../utils/queryKeys";
import uploadImage from "../../utils/uploadImage";
import Modal from "../modal";



const MessageInput = ({ recipientId , messages,setText,role}) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (data) =>
      await sendMessage(data.recipientId, data.content, data.attachment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getChatKey(recipientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getAllChatsKey(),
      });
      setMessage("");
      setAttachment(null);
    },
  });

  const handleSend = async () => {
    if (role == "ai-id") {
      setText(message);
      setMessage("");
      await sendMessageMutation.mutateAsync({
        recipientId,
        content: message.trim(),
        attachment: null,
      });
      return;
    }
    if (!message.trim() && !attachment) return;

    try {
      let attachmentUrl = null;
      if (attachment) {
        attachmentUrl = await uploadImage(attachment);
      }

      await sendMessageMutation.mutateAsync({
        recipientId,
        content: message.trim(),
        attachment: attachmentUrl,
      });
      setShowConfirmation(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  const handleAttachmentSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
      setShowConfirmation(true);
    }
    e.target.value = "";
  };



  return (
    <>
      <div className="relative">
        <label htmlFor="message" className="sr-only">
          Type a Message
        </label>

        <span className="absolute inset-y-0 start-3 grid w-8 place-content-center">
          <input
            type="file"
            id="attachment"
            className="hidden"
            onChange={handleAttachmentSelect}
          />
          <button
            type="button"
            onClick={() => document.getElementById("attachment").click()}
          >
            <span className="sr-only">Upload Image</span>
            {role!="ai-id" && <img src="/icons/tdesign_attach.svg" alt="" />}
          </button>
        </span>

        <input
          type="text"
          id="message"
          placeholder="Type a Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSend()}
          className="w-full rounded-md border-gray-200 p-3 px-14 shadow-xs sm:text-sm"
        />

        <span className="absolute inset-y-0 end-3 grid w-8  place-content-center ">
          <button type="button" onClick={handleSend}>
            <span className="sr-only">Send</span>
            <img src="/icons/tabler_send.svg" alt="" />
          </button>
        </span>
      </div>
      <Modal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setAttachment(null);
        }}
        title="Send Image"
        saveText="Send"
        onSubmit={handleSend}
      >
        <div className="text-center space-y-4">
          <img
            src={attachment ? URL.createObjectURL(attachment) : ""}
            alt="Selected attachment"
            className="max-w-full h-auto mx-auto rounded-lg"
          />
        </div>
      </Modal>
    </>
  );
};

export default MessageInput;
