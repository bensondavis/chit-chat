import axios from "axios";
import Toast from "../components/Toast";
const API_URI = process.env.REACT_APP_API_URI;

const sendMessage = async (to, data, token, addMessage) => {
  axios({
    method: "post",
    url: `${API_URI}/chat/send/${to}`,
    data: data,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      addMessage(res.data);
    })
    .catch((err) => {
      if (err?.response.status === 401) {
        Toast("Cannot connect to server! Try logging in again.", "error", {
          vertical: "top",
          horizontal: "center",
        });
      }
      Toast(err.message, "error", {
        vertical: "top",
        horizontal: "center",
      });
    });
};

const getMessages = (userId, token, setMessages) => {
  axios({
    method: "get",
    url: `${API_URI}/chat/${userId}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      setMessages(res.data);
    })
    .catch((err) => {
      if (err?.response.status === 401) {
        Toast("Cannot connect to server! Try logging in again.", "error", {
          vertical: "top",
          horizontal: "center",
        });
      }
      Toast(err.message, "error", {
        vertical: "top",
        horizontal: "center",
      });
    });
};

const deleteMessage = (id, token, removeMessage) => {
  axios({
    method: "delete",
    url: `${API_URI}/chat/message/${id}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      removeMessage(id);
    })
    .catch((err) => {
      if (err?.response.status === 401) {
        Toast("Cannot connect to server! Try logging in again.", "error", {
          vertical: "top",
          horizontal: "center",
        });
      }
      Toast(
        err.response.data?.message ? err.response.data.message : err.message,
        "error",
        {
          vertical: "top",
          horizontal: "center",
        }
      );
    });
};

export { sendMessage, getMessages, deleteMessage };
