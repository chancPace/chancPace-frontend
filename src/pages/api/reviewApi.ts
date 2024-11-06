import { Review } from '@/types';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/review';

export const updateReview = async (
  reviewId: number,
  reviewData: Partial<Review>
) => {
  try {
    const response = await axios.patch(`${API_URL}/update-review`, {
      reviewId,
      ...reviewData, // 필요한 데이터만 전송
    });
    return response.data;
  } catch (error) {
    console.error('리뷰 수정 실패', error);
    throw error;
  }
};
