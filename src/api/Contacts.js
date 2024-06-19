import axios from "axios";
import Toast from "../components/Toast";

const API_URI = process.env.REACT_APP_API_URI;

const addContact = (id, token, addNewContact) => {
  axios({
    method: "post",
    url: `${API_URI}/contacts/${id}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(() => {
      addNewContact(id);
    })
    .catch((err) => {
      if (err?.response.status === 401) {
        Toast("Cannot connect to server! Try logging in again.", "error", {
          vertical: "top",
          horizontal: "center",
        });
      }
      Toast(
        err.response.data.message ? err.response.data.message : err.message,
        "error",
        {
          vertical: "top",
          horizontal: "center",
        }
      );
    });
};

const getContacts = (token, setContacts) => {
  axios({
    method: "get",
    url: `${API_URI}/contacts`,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      setContacts(res.data);
    })
    .catch((err) => {
      if (err?.response.status === 401) {
        Toast("Cannot connect to server! Try logging in again.", "error", {
          vertical: "top",
          horizontal: "center",
        });
      }
    });
};

export { addContact, getContacts };
