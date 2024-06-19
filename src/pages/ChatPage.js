import { Box } from "@mui/material";
import Chat from "../components/Chat";
import ContactList from "../components/ContactList";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getContacts } from "../api/Contacts";
import { Route, Routes } from "react-router-dom";
import Welcome from "../components/Welcome";
import useConversation from "../zustand/useConversation";


const ChatPage = () => {
  // const [contacts, setContacts] = useState();
  const { setContacts } = useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    getContacts(authUser.token, setContacts);
  }, [authUser]);

  return (
    <Box>
      <ContactList />
      <div className="w-[calc(100vw-255px)] h-[calc(100vh-57px)] absolute left-[255px]">
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/:username/*" element={<Chat />} />
        </Routes>
      </div>
    </Box>
  );
};

export default ChatPage;
