import axios from "axios";
import Toast from "../components/Toast";

const API_URI = process.env.REACT_APP_API_URI;

const Login = (data, setAuthUser) => {
  axios({
    method: "post",
    url: `${API_URI}/auth/login`,
    data: data,
  })
    .then((res) => {
      setAuthUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      Toast(
        "Login successfull",
        "success",
        {
          vertical: "top",
          horizontal: "center",
        }
      );
    })
    .catch((err) => {
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

const Register = (data) => {
  axios({
    method: "post",
    url: `${API_URI}/auth/register`,
    data: data,
  }).then((res) => {
    Toast(
        res.data.message,
        "success",
        {
          vertical: "top",
          horizontal: "center",
        }
      );
  }).catch((err) => {
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

export { Login, Register };
