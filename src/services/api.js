
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getPackets = () =>
  API.get("/packets");

export const addPacket = (packet) =>
  API.post("/packets", packet);

export const deletePacket = (id) =>
  API.delete(`/packets/${id}`);

export const getPacketById = (id) =>
  API.get(`/packets/${id}`);

export default API;
