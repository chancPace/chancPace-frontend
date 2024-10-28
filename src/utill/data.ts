import { Space } from '@/pages/types';
import s1_1 from '../assets/image/s1-1.jpg';
import s1_2 from '../assets/image/s1-2.jpg';
import s1_3 from '../assets/image/s1-3.jpg';
import s1_4 from '../assets/image/s1-4.jpg';
import s1_5 from '../assets/image/s1-5.jpg';
import s1_6 from '../assets/image/s1-6.jpg';
import exp from 'constants';
const space: Space[] = [
    {
        id: 1,
        spaceName: '별의순간 홍대1분',
        spaceLocation: '서울시 서초구 잠원동 164',
        description: '반짝이는 순간을 위한 모임공간, 별의순간',
        spacePrice: 100000,
        discount: 10000,
        amenities: [
            '책상,의자,TV,소파,칠판 등 모든 가구가 이동식으로 설계되어 모임의 성격에 맞게 변형이 가능',
            '삼성 스마트TV 모니터, 모듈 소파/ 책상 및 의자, 얼음정수기, 공기청정기,블루투스 스피커, 이동식 칠판, 노트북 ,행거,보조의자2개',
            '[내부시설]내부 단독 화장실, 별도 손세정용 세면대,',
            '[주차] 1시간 무료, 초과시 시간당 3000원',
        ],
        cleanTime: 30,
        spaceStatus: 'AVAILABLE',
        isOpen: true,
        guidelines: [
            '대여 시간보다 적게 사용 하더라도 대관비는 환불되지 않습니다.',
            '- 기물 파손 및 청소 등의 사유로 보증금을 호스트에게 입금하여야 합니다.',
        ], //주의사항
        categoryId: '1',
        Minimum: 3, //최소인원
        Maximum: 6, //최대인원
        spaceImg: [s1_4, s1_1, s1_5, s1_2, s1_3, s1_1, s1_2], //공간사진
        businessStartTime: 4,
        businessEndTime: 20,
    },
];

export { space };
