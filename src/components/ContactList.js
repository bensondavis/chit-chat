import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Fragment, useState } from "react";
import { addContact as addContactApi } from "../api/Contacts";
import { useAuthContext } from "../context/AuthContext";
import "@fontsource/ibm-plex-mono";
import useConversation from "../zustand/useConversation";
import { useNavigate } from "react-router-dom";
import VoiceAndVideoCall from "./VoiceAndVideoCall";

const ContactList = () => {
  const { contacts, addContact } = useConversation();
  const [userId, setUserId] = useState("");
  const { authUser } = useAuthContext();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const navigate = useNavigate();

  const handleAddContact = () => {
    addContactApi(userId, authUser.token, addContact);
    setUserId("");
  };

  return (
    <section className="w-64 h-[calc(100vh-57px)] absolute top-[57px] left-0 border-r border-gray-500">
      {contacts?.map((contact, index) => (
        <Fragment key={index}>
          <div
            className="p-4 uppercase text-left cursor-pointer hover:bg-gray-50 active:bg-gray-100 relative z-0"
            style={{
              fontFamily: "IBM Plex Mono",
              backgroundColor:
                selectedConversation === contact ? "rgb(243 244 246)" : "",
            }}
            onClick={() => {
              setSelectedConversation(contact);
              navigate(`/chat/${contact}`);
            }}
          >
            <h3>{contact}</h3>
            <VoiceAndVideoCall />
          </div>
          <Divider />
        </Fragment>
      ))}

      <Box className="absolute bottom-0 left-0 w-full p-2">
        <OutlinedInput
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddContact();
          }}
          className="text-gray-500"
          placeholder="Search users"
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleAddContact}>
                <AddIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </section>
  );
};

export default ContactList;
