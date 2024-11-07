import axios from 'axios';

const isLocal = process.env.NODE_ENV === 'development';

const API_URL = `${
  isLocal
    ? `http://${process.env.NEXT_PUBLIC_LOCAL_HOST}:${process.env.NEXT_PUBLIC_LOCAL_PORT}`
    : `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
}/api/category`;


export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-category`);
    return response.data;
  } catch (error) {
    throw new Error('카테고리 불러오기 실패');
  }
};
