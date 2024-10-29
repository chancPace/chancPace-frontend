import axios from 'axios';

const API_URL = 'http://localhost:4000/api/user';

export const getUser = async (token: string) => {
    try {
        const response = await axios.post(
            `${API_URL}/get-user`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('API 요청 실패: ', error);
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 404:
                    throw new Error('404:요청한 리소스를 찾을 수 없습니다');
                case 401:
                    throw new Error(
                        '401: 인증에 실패했습니다. 다시 로그인하세요'
                    );
                case 500:
                    throw new Error(
                        '500: 서버 오류가 발생했습니다. 나중에 다시 시도하세요'
                    );
                default:
                    throw new Error('알 수 없는 오류가 발생했습니다. ');
            }
        } else {
            throw new Error('네트워크 문제로 요청을 완료할 수 없습니다.');
        }
    }
};
