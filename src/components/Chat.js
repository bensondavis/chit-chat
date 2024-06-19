import { useState, useEffect } from "react";
import { Button, Divider, Stack, TextField } from "@mui/material";
import MessageCard from "./MessageCard";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { getMessages, sendMessage } from "../api/Messages";
import { useAuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const Chat = () => {
  const [input, setInput] = useState("");
  const { socket } = useSocketContext();
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    addMessage,
    setMessages,
    removeMessage,
  } = useConversation();
  const { authUser } = useAuthContext();
  const { username } = useParams();

  const handleSendMessage = () => {
    sendMessage(
      selectedConversation,
      { text: input },
      authUser.token,
      addMessage
    );
    setInput("");
  };

  useEffect(() => {
    socket?.on("message", (message) => {
      addMessage(message);
    });
    socket?.on("deleteMessage", (messageId) => {
      removeMessage(messageId);
    });
  }, [socket]);

  useEffect(() => {
    if (selectedConversation)
      getMessages(selectedConversation, authUser.token, setMessages);
  }, [selectedConversation]);

  useEffect(() => {
    if (username) {
      setSelectedConversation(username);
    }
  }, [username]);

  return (
    <>
      <div className="h-[calc(100%-70px)] w-full overflow-y-auto scroll-smooth block-end">
        {messages.map((message) => (
          <MessageCard
            key={message._id}
            id={message._id}
            message={message.text}
            sender={message.sender}
          />
        ))}
      </div>
      <Divider />
      <div className=" h-[68px] flex justify-center">
        <Stack
          direction={"row"}
          gap={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <TextField
            className="w-[calc(50vw-120px)]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === "Enter") handleSendMessage();
            }}
          />
          <Button onClick={handleSendMessage} variant="contained">
            Send
          </Button>
        </Stack>
      </div>
    </>
  );
};

export default Chat;
