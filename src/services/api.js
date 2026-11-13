
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://packet-backend-1.onrender.com",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

// Get all packets
export const getPackets = () =>
  API.get("/packets");

// Add packet
export const addPacket = (packet) =>
  API.post("/packets", packet);

// Delete packet
export const deletePacket = (id) =>
  API.delete(`/packets/${id}`);

// Get packet by ID
export const getPacketById = (id) =>
  API.get(`/packets/${id}`);

export default API;
