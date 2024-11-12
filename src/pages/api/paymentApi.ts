import axios from 'axios';

const isLocal = process.env.NODE_ENV === 'development';

const API_URL = `${
  isLocal
    ? `http://${process.env.NEXT_PUBLIC_LOCAL_HOST}:${process.env.NEXT_PUBLIC_LOCAL_PORT}`
    : `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
}/api/payment`;

export const getOnePayment = async (paymentId: number) => {
  try {
    const response = await axios.get(`${API_URL}/get-one-payment`, {
      params: { paymentId },
    });
    return response.data;
  } catch (error) {
    console.error('결제내역 불러오기 실패', error);
    throw error;
  }
};
