import axios from 'axios';
import { User } from '../types/User';
const API_URL = 'http://192.168.1.17:3000/api/v1/users'; // Replace with your backend API URL


export const registerUser = async (user: User) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { user });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (phoneNumber: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { phoneNumber });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};