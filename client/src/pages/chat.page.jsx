import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
  getAIResponse,
  useGetAllChats,
  useGetChat,
  useGetChatCardInfo,
} from "../api/chats.api";
import ChatCard from "../components/Chat/chatCard";
import Message from "../components/Chat/message";
import MessageInput from "../components/Chat/messageInput";
import Search from "../components/search";
import { useAuth } from "../context/auth.context";
import useRedirectAuth from "../hooks/useRedirectAuth";
import axiosInstance from "../utils/axiosInstance";
import queryKeys from "../utils/queryKeys";
const ChatPage = () => {
  useRedirectAuth();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const recipientId = searchParams.get("recipientId");

  const [loadingAI, setLoadingAI] = useState(false);

  const { data: currentChat } = useGetChat(recipientId);
let { data: chats } = useGetAllChats();

  const [messages, setMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);

  const [hasMore, setHasMore] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [text, setText] = useState("");
  

  const addUserMessage = async () => {
    try {
      if (recipientId !== "ai-id") return;
  
      const userMessage = {
        _id: Date.now().toString() + "-user",
        sender: user._id,
        content: text,
        timestamp: new Date().toISOString(),
      };
  
      // Add user's message 
      setAiMessages((prev) => [...prev, userMessage]);
    } catch (error) {
      console.error("Error generating AI content:", error);
    }
  };

const fetchAIResponse = async () => {

  try {
    const cleanText = (text) => {
      return text.replace(/\*/g, "").trim(); // removes all * from string
    };
    if (recipientId !== "ai-id") return;
    setLoadingAI(true);
    const response = await getAIResponse(text);

    const aiMessage = {
      _id: Date.now().toString() + "-ai",
      sender: "ai-id",
      content: cleanText(response),
      timestamp: new Date().toISOString(),
    };

    // add AI's response
    setAiMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error("Error generating AI content:", error);
  }
  finally{
    setLoadingAI(false);
  }
};

 // Add user message and fetch ai response upon text change by user 
  useEffect(() => {
    const run = async () => {
      await addUserMessage();
      if(!text) return
      await fetchAIResponse();
    };
    run();
 }, [text]);

 // Add welcome message
 useEffect(() => {
  if (recipientId === "ai-id" && aiMessages.length === 0) {
    const welcomeMessage = {
      _id: Date.now().toString() + "-ai",
      sender: "ai-id",
      content: "Hi! I’m your AI assistant. Ask me anything 😊",
      timestamp: new Date().toISOString(),
    };

    setAiMessages([welcomeMessage]);
  }
}, [recipientId]);

  

  useEffect(() => {
    if (recipientId !== "ai-id" && currentChat) {
      setLastMessageId(currentChat.messages[0]?._id);
      setMessages(currentChat.messages);
      setHasMore(true);
    }
  }, [currentChat, recipientId]);
  


  useEffect(() => {
    console.log(chats);
  }, [chats]);

  const loadMoreMessages = async () => {
    if (!hasMore || !recipientId || !currentChat) return;

    try {
      const response = await axiosInstance.get(
        `/chat/${currentChat._id}/messages?lastMessageId=${lastMessageId}`
      );
      setMessages((prev) => [...response.data.data, ...prev]);
      setHasMore(response.data.hasMore);
      setLastMessageId(response.data.data[0]?._id);
    } catch (error) {
      toast.error("Failed to load more messages");
    }
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-10">
        {/* Left */}
        <div
          className={`col-span-3 max-md:col-span-10 h-screen p-4 pt-0 pl-0 max-md:px-2 ${
            recipientId ? "max-md:hidden" : ""
          } `}
        >
          <Left
            selectedChat={recipientId}
            setSearchParams={setSearchParams}
            chats={chats}
          />
        </div>
        {/* Right */}
        <div
          className={`col-span-7 max-md:col-span-10 h-screen flex flex-col ${
            recipientId ? "max-md:flex" : "max-md:hidden"
          }`}
        >


<Right
loadingAI={loadingAI}
  setSelectedChat={setSearchParams}
  selectedChat={recipientId}
  messages={recipientId === "ai-id" ? aiMessages : messages}
  loadMoreMessages={loadMoreMessages}
  hasMore={hasMore}
  currentChat={currentChat}
  setText={setText}
  role={user?.role}
/>

        </div>
      </div>
    </div>
  );
};

const Left = ({ selectedChat, setSearchParams, chats }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Define AI chat
  const aiChat = {
    _id: "ai-chat-id",
    messages: [{ content: "Hi, I’m your AI assistant!" }],
    influencer: user?.role === "brand" ? { name: "Gemini", avatar:"/images/gemini.png", _id: "ai-id" } : undefined,
    brand: user?.role !== "brand" ? { name: "Gemini", avatar: "/images/gemini.png", _id: "ai-id" } : undefined,
    unreadBrand: 0,
    unreadInfluencer: 0,
  };

  // Separate user chats
  const filteredUserChats = (chats || []).filter((el) => {
    const chatUser = user?.role === "brand" ? el.influencer : el.brand;
    return chatUser?.name.toLowerCase().includes(search.toLowerCase());
  });

  // Filter AI chat based on search
  const showAIChat = aiChat && (
    (user?.role === "brand" ? aiChat.influencer : aiChat.brand)?.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectChat = (chat) => {
    const recipientId = user?.role === "brand" ? chat?.influencer?._id : chat?.brand?._id;
    setSearchParams({ recipientId });

    if ((user?.role === "brand" ? chat.unreadBrand : chat.unreadInfluencer) > 0) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getAllChatsKey(),
      });
    }
  };

  return (
    <>
      <h2 className="h-[9%] text-2xl font-bold uppercase">Chats</h2>

      <Search
        isChat={true}
        placeholder={"Search Chats"}
        search={search}
        handleSearch={(val) => setSearch(val)}
      />

      <div className="space-y-2 mt-2 overflow-y-auto scrollbar scrollbar-hidden h-[81%]">

        {/* AI Chat Section */}
        {showAIChat && (
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-1">AI Assistant</p>
            <ChatCard
              key={aiChat._id}
              name={
                user?.role === "brand"
                  ? aiChat.influencer.name
                  : aiChat.brand.name
              }
              avatar={
                user?.role === "brand"
                  ? aiChat.influencer.avatar
                  : aiChat.brand.avatar
              }
              lastMessage={aiChat.messages[0].content}
              selectChat={() => selectChat(aiChat)}
              selected={selectedChat === "ai-id"}
              newMessages={0}
            />
          </div>
        )}

        {/* User Chat Section */}
        {filteredUserChats.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-400 mt-4 mb-1">Conversations</p>
            {filteredUserChats.map((el) => {
              const chatUser = user.role === "brand" ? el.influencer : el.brand;

              return (
                <ChatCard
                  key={el._id}
                  name={chatUser.name}
                  avatar={chatUser.avatar}
                  lastMessage={
                    el.messages.at(-1).attachment
                      ? "image"
                      : el.messages.at(-1).content
                  }
                  selectChat={() => selectChat(el)}
                  selected={
                    selectedChat === el?.influencer?._id ||
                    selectedChat === el?.brand?._id
                  }
                  newMessages={
                    user.role === "brand" ? el.unreadBrand : el.unreadInfluencer
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};


const Right = ({
  currentChat,
  setSelectedChat,
  selectedChat,
  messages,
  loadMoreMessages,
  hasMore,
  setText,
  role,
  loadingAI,
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [scrollHeight, setScrollHeight] = useState(0);

let cardInfo;

if (role !== "ai-id") {
  const { data } = useGetChatCardInfo(selectedChat);
  cardInfo = data;
}

  useEffect(() => {
    if (isInitialLoad && messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    setIsInitialLoad(true);
  }, [selectedChat]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (container.scrollTop === 0 && hasMore) {
      // Save current scroll height before loading more messages
      setScrollHeight(container.scrollHeight);
      loadMoreMessages();
    }
  };

  useEffect(() => {
    if (scrollHeight > 0 && messagesContainerRef.current) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - scrollHeight;
      messagesContainerRef.current.scrollTop = scrollDiff;
      setScrollHeight(0);
    }
  }, [messages, scrollHeight]);

  if (!selectedChat && !currentChat) {
    return <>Select a Chat</>;
  }

  return (
    <>
      <div className="h-[9%] flex items-center gap-4 max-md:px-4">
        <button className="md:hidden" onClick={() => setSelectedChat({})}>
          ⬅
        </button>
        <ChatCard
          name={cardInfo?.name || "Gemini"}
          role={cardInfo?.role || "AI Assistant"}
          avatar={cardInfo?.avatar || "/images/gemini.png"} 
          openProfile={cardInfo?._id}
        />
      </div>

      <section className="h-[91%] flex flex-col justify-between bg-chatBg rounded-l-lg">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex flex-col gap-4 p-4 overflow-y-auto scrollbar scrollbar-hidden"
        >

{/* Gemini typing overlay */}
{loadingAI && (
  <div className="absolute bottom-30 left-[45] bg-white/80 p-3 rounded-lg shadow-md z-10 w-[40%]">
    <div className="text-sm font-medium text-gray-800">Gemini is typing</div>
    <div className="flex space-x-1 mt-1">
      <div
        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
      <div
        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "600ms" }}
      ></div>
    </div>
  </div>
)}


          {messages && messages.map((el, ind) => {
    const isUser = el.sender === user?._id;
    const isAI = el.sender === "ai-id";

    return (    
      <Message
        key={ind}
        message={el}
        sent={isUser}
        ai={isAI}
        avatar={
          isUser
            ? user.avatar
            : isAI
            ? "/images/gemini.png"
            : cardInfo?.avatar
        }
      />

    );
  })}

          <div ref={messagesEndRef} />
        </div>
        <div className="p-4">
          <MessageInput recipientId={selectedChat}  setText={setText} role={selectedChat}/>
        </div>
      </section>
    </>
  );
};

export default ChatPage;
