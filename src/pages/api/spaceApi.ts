import { isSpace } from '@/types';
import axios from 'axios';
import Cookies from 'js-cookie'; // 쿠키 라이브러리 추가

const isLocal = process.env.NODE_ENV === 'development';

const API_URL = `${
  isLocal
    ? `http://${process.env.NEXT_PUBLIC_LOCAL_HOST}:${process.env.NEXT_PUBLIC_LOCAL_PORT}`
    : `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
}/api/space/`;

export const addNewSpace = async (spaceData: FormData) => {
  try {
    const token = Cookies.get('token'); // 쿠키에 저장된 'token' 이름으로 가져옴
    const response = await axios.post(`${API_URL}add-new-space`, spaceData, {
      headers: {
        'Content-Type': 'multipart/form-data', // FormData 전송을 위한 헤더 설정
        Authorization: `Bearer ${token}`, // 가져온 토큰을 Authorization 헤더에 추가
      },
    });
    return response.data || []; // undefined일 경우 빈 배열 반환
  } catch (error: any) {
    console.error('공간 등록 실패!!!!', error.response?.data || error.message);
    throw error;
  }
};

export const getMySpace = async (userId: number) => {
  try {
    const reponse = await axios.get(`${API_URL}get-my-space`, {
      params: { userId },
    });
    return reponse.data;
  } catch (error: any) {
    console.error('API 요청 실패: ', error);
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 404:
          throw new Error('404:요청한 리소스를 찾을 수 없습니다');
        case 401:
          throw new Error('401: 인증에 실패했습니다. 다시 로그인하세요');
        case 500:
          throw new Error('500: 서버 오류가 발생했습니다. 나중에 다시 시도하세요');
        default:
          throw new Error('알 수 없는 오류가 발생했습니다. ');
      }
    } else {
      throw new Error('네트워크 문제로 요청을 완료할 수 없습니다.');
    }
  }
};

export const getOneSpace = async (spaceId: string) => {
  try {
    const response = await axios.get(`${API_URL}get-one-space`, {
      params: { spaceId },
    });
    return response.data;
  } catch (error) {
    console.error('공간 정보 불러오기 실패', error);
    throw error;
  }
};

export const updateSpace = async (spaceData: FormData, spaceId: string) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.patch(`${API_URL}update-space?spaceId=${spaceId}`, spaceData, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('공간 수정 실패', error);
    throw error;
  }
};

// 공간 중단
export const stopSpace = async (value: isSpace) => {
  try {
    const response = await axios.patch(`${API_URL}update-space-status`, value);
    return response.data;
  } catch (error) {
    console.error('공간 수정 실패', error);
    throw error;
  }
};

// 공간 삭제
export const deleteSpace = async (value: isSpace) => {
  try {
    const response = await axios.patch(`${API_URL}update-space`, value);
    return response.data;
  } catch (error) {
    console.error('공간 수정 실패', error);
    throw error;
  }
};
