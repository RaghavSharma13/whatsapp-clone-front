import axios from "axios";

const instance = axios.create({
  baseURL: "https://rs-whatsapp-clone-backend.herokuapp.com/",
  withCredentials: true,
});

export default instance;
