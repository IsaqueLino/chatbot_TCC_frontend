import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? '';
const API_BASE = API_URL.replace(/\/$/, '');

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
});

// Interceptor to inject Token
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Interceptor to catch 401s
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or invalid. Signing out...");
      // Força o logout e redireciona para a página de login
      if (typeof window !== 'undefined') {
        await signOut({ callbackUrl: '/login' });
      }
    }
    return Promise.reject(error);
  }
);

export async function fetchMessages(chatId) {
  if (!chatId) return [];
  try {
    const res = await apiClient.get(`/chats/${chatId}/messages`);
    return res.data;
  } catch (e) {
    console.error('Error fetching messages', e);
    throw e;
  }
}

export async function postMessage(chatId, payload) {
  try {
    const res = await apiClient.post(`/chats/${chatId}/messages`, payload);
    return res.data; // returns [userMsg, assistantMsg]
  } catch (e) {
    console.error('Error posting message', e);
    throw e;
  }
}