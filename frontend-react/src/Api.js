// src/api.js
// ─── Configuration Axios centralisée ──────────────────────────────────────
// Un seul endroit pour changer l'URL du backend
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8085/api',
  headers: { 'Content-Type': 'application/json' }
});

export default API;