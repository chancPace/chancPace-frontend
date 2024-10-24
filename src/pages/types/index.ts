export interface Space {
    // id: number;
    spaceName: string;
    spaceLocation: string;
    description: string;
    spacePrice: number;
    discount: number;
    amenities: string; // 편의시설 목록 (문자열 배열)
    cleanTime: number;
    spaceStatus: string; // 공간의 상태 ('AVAILABLE' 또는 'UNAVAILABLE')
    isOpen: boolean; // 공간이 열려 있는지 여부
    caution: string; // 주의사항 (문자열 배열)
    category: string; // 카테고리
    minGuests: number; // 최소 인원
    maxGuests: number; // 최대 인원
    spaceImg: { src: string }[]; // 공간 이미지 배열
    businessStartTime: string;
    businessEndTime:string;
}

export interface Category {
    id: number;
    categoryName: string;
    pId: number | null
}

