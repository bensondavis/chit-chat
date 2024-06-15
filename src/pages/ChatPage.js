import { Box } from "@mui/material";
import Chat from "../components/Chat";
import ContactList from "../components/ContactList";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { getContacts } from "../api/Contacts";


const ChatPage = () => {
  const [contacts, setContacts] = useState();
  const { authUser } = useAuthContext();
  const API_URI = process.env.REACT_APP_API_URI;

  useEffect(() => {
    getContacts(authUser.token, setContacts);
  }, []);

  return (
    <Box>
      <ContactList contacts={contacts} setContacts={setContacts} />
      <Chat />
    </Box>
  );
};

export default ChatPage;
