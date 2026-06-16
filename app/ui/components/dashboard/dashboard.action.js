import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? '').replace(/\/$/, '');

const apiClient = axios.create({ baseURL: API_BASE });

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export async function fetchAllSensorData(limit = 200) {
  try {
    const res = await apiClient.get(`/sensors/data?limit=${limit}`);
    return res.data;
  } catch (e) {
    console.error('Error fetching sensor data', e);
    return [];
  }
}

export async function fetchSensorDevices() {
  try {
    const res = await apiClient.get('/sensors/devices');
    return res.data;
  } catch (e) {
    console.error('Error fetching devices', e);
    return [];
  }
}
