import axios from "axios";

// Determine base URL, ensuring /api is included
const rawBase =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

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
