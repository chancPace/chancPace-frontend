import { Review } from '@/types';
import axios from 'axios';

const isLocal = process.env.NODE_ENV === 'development';

const API_URL = `${
  isLocal
    ? `http://${process.env.NEXT_PUBLIC_LOCAL_HOST}:${process.env.NEXT_PUBLIC_LOCAL_PORT}`
    : `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
}/api/review/`;

export const updateReview = async (reviewId: number, reviewData: Partial<Review>) => {
  try {
    const response = await axios.patch(`${API_URL}update-review`, {
      reviewId,
      ...reviewData, // 필요한 데이터만 전송
    });
    return response.data;
  } catch (error) {
    console.error('리뷰 수정 실패', error);
    throw error;
  }
};
