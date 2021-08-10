import axios from "axios";
//baseURL: "http://localhost:5000","http://192.168.15.18:5000"
export default axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-type": "application/json"
  },
});