import axios from 'axios';

export async function checkAuthStatus() {
  try {
    const response = await axios.get('/api/auth/status');
    return response.data.authenticated;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
}
