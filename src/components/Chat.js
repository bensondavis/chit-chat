import { useState, useEffect } from "react";
import { Button, Divider, IconButton, Stack, TextField } from "@mui/material";
import MessageCard from "./MessageCard";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { getMessages, sendMessage } from "../api/Messages";
import { useAuthContext } from "../context/AuthContext";

const Chat = () => {
  const [input, setInput] = useState("");
  const { socket } = useSocketContext();
  const {
    selectedConversation,
    messages,
    addMessage,
    setMessages,
    removeMessage,
  } = useConversation();
  const { authUser } = useAuthContext();

  console.log({ selectedConversation });
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
      console.log({ message });
      addMessage(message);
    });
    socket?.on("deleteMessage", (messageId) => {
      removeMessage(messageId);
    });
  }, [socket]);

  useEffect(() => {
    if (selectedConversation)
      getMessages(selectedConversation, authUser.token, setMessages);
    console.log({ messages });
  }, [selectedConversation]);

  return (
    <div className="w-[calc(100vw-255px)] h-[calc(100vh-57px)] absolute left-[255px]">
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
          <IconButton>
            <CallIcon />
          </IconButton>
          <IconButton>
            <VideocamIcon />
          </IconButton>
          <TextField
            className="w-[calc(50vw-120px)]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleSendMessage} variant="contained">
            Send
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default Chat;
