import axios from 'axios';
import Cookies from 'js-cookie'; // 쿠키 라이브러리 추가

const isLocal = process.env.NODE_ENV === 'development';

const API_URL = `${
  isLocal
    ? `http://${process.env.NEXT_PUBLIC_LOCAL_HOST}:${process.env.NEXT_PUBLIC_LOCAL_PORT}`
    : `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
}/api/booking/`;

export const getMySpaceBooking = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}get-my-booking`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching space bookings:', error);
    throw error;
  }
};
