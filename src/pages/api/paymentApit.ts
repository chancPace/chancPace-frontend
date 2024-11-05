import axios from 'axios';

const API_URL = 'http://localhost:4000/api/payment';

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

