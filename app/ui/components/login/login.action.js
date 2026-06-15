// login.action.js
import axios from 'axios';

// Use only the configured BASE_URL from environment
const API_PREFIX = '/api/v1/auth';

export async function loginUser(email, password) {
  if (!email || !password) throw new Error('Email and password are required');
  try {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    params.append('grant_type', 'password');

    const response = await axios.post(`${API_PREFIX}/login`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data;
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await axios.post(`${API_PREFIX}/logout`);
  } catch (error) {
    console.error('Error logging out', error);
    throw error;
  }
}

export async function getProfile(accessToken) {
  if (!accessToken) throw new Error('Access token required');
  try {
    const response = await axios.get(`/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile', error);
    throw error;
  }
}
