import axios from 'axios'


const API_URL = 'http://localhost:4000/api/category';

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}`)
        return response.data
    } catch (error) {
        throw new Error('카테고리 불러오기 실패')
    }
}