
import axios from "axios";

// Determine base URL
const rawBase =
  import.meta.env.VITE_API_URL ||
  "https://packet-backend-2.onrender.com/api";

const trimmedBase = String(rawBase).trim().replace(/\/+$/, "");

const baseURL = trimmedBase.endsWith("/api")
  ? trimmedBase
  : `${trimmedBase}/api`;

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
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
