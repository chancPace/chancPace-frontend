import axios from 'axios';

const API_URL = 'http://localhost:4000/api/space';
interface registData {
    spaceName: string;
    spaceLocation: string;
    description: string;
    spacePrice: number;
    discount: number;
    amenities: string;
    cleanTime: number;
    spaceStatus: 'AVAILABLE' | 'UNAVAILABLE';
    isOpen: boolean;
}
export const addNewSpace = async (spaceData: registData) => {
    try {
        const response = await axios.post(
            `${API_URL}/add-new-space`,
            spaceData
        );
        return response.data;
    } catch (error: any) {
        console.error('공간 등록 실패', error.response?.data || error.message);
    }
};
