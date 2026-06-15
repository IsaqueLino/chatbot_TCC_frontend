import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? '';
const API_BASE = API_URL.replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or invalid. Signing out...");
      if (typeof window !== 'undefined') {
        await signOut({ callbackUrl: '/login' });
      }
    }
    return Promise.reject(error);
  }
);

export async function fetchUserProfile() {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile', error);
    return null;
  }
}

export async function fetchChats(userId) {
  if (!userId) throw new Error('User ID not found');
  try {
    const response = await apiClient.get(`/chats/get_chats/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chats', error);
    throw error;
  }
}

export async function createChat(userId, title) {
  try {
    const response = await apiClient.post(`/chats/add_chat`, {
      user_id: userId,
      title,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating new chat', error);
    throw error;
  }
}

export async function deleteChat(chatId, userId) {
  try {
    await apiClient.delete(`/chats/delete_chat/${chatId}`);
  } catch (error) {
    console.error('Error deleting chat', error);
    throw error;
  }
}

export async function updateChatTitle(chatId, userId, title) {
  try {
    await apiClient.put(`/chats/update_chat_title/${chatId}`, {
      user_id: userId,
      title,
    });
  } catch (error) {
    console.error('Error updating chat title', error);
    throw error;
  }
}