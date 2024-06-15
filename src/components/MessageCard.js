import { Card, IconButton } from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteMessage } from "../api/Messages";
import useConversation from "../zustand/useConversation";

const MessageCard = ({ id, message, sender }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { authUser } = useAuthContext();
  const { removeMessage } = useConversation();
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDelete = () => {
    deleteMessage(id, authUser.token, removeMessage);
  };

  return (
    <div style={{ ml: sender === authUser.username ? "auto" : "" }}>
      <div
        className="flex gap-2 align-center"
        style={{
          flexDirection: sender === authUser.username ? "row-reverse" : "",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="w-fit max-w-[40%] p-2 m-2 text-left relative">
          <p>{message}</p>
        </Card>
        {isHovered ? (
          <IconButton color="error" className="w-12 h-12" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
};

export default MessageCard;
