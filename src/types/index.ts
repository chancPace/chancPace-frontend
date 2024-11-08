import exp from 'constants';

export interface Category {
  id: number;
  categoryName: string;
  pId: number | null;
}

export interface SpaceType {
  id: number;
  spaceName: string;
  spaceLocation: string;
  description: string;
  spacePrice: number;
  discount: number;
  amenities: string[]; // 편의시설 목록 (문자열 배열)
  cleanTime: number;
  spaceStatus: string; // 공간의 상태 ('AVAILABLE' 또는 'UNAVAILABLE')
  isOpen: boolean; // 공간이 열려 있는지 여부
  guidelines: string[]; // 주의사항 (문자열 배열)
  categoryId: number;
  minGuests: number; // 최소 인원
  maxGuests: number; // 최대 인원
  spaceImg: { src: string }[]; // 공간 이미지 배열
  businessStartTime: number;
  businessEndTime: number;
  spaceAdminName: string;
  spaceAdminPhoneNumber: string;
  // images?: {
  //   imageUrl: string;
  // }[];
  // reviews?: {
  //   user?: {
  //     userName: string;
  //   };
  //   reviewComment: string;
  //   reviewRating: number;
  //   createdAt: string;
  //   reviewStatus: string;
  //   updatedAt: string;
  //   id: number;
  // }[];
  // bookings?: {
  //   startDate: string;
  //   startTime: string;
  //   endTime: string;
  //   bookingStatus: string;
  //   user?: {
  //     userName: string;
  //     phoneNumber: string;
  //     payments?: {
  //       paymentAmount: string;
  //       id: number;
  //     };
  //   };
  // };
  images?: Image[];
  reviews?: Review[];
  bookings?: Booking[];
  user?: User[];
}

export interface Image {
  id: number;
  imageUrl: string;
  spaceId: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  accountStatus: string;
  payment?: Payment[];
}

export interface Review {
  id: number;
  reviewComment: string;
  reviewRating: number | null;
  reviewStatus: string;
  spaceId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    userName: string;
  };
}

export interface Booking {
  id: number;
  startDate: string;
  startTime: number;
  endTime: number;
  bookingStatus: string;
  paymentId: number;
  user?: {
    userName: string;
    phoneNumber: string;
    payments: { id: number; paymentPrice: number }[];
  };
}

export interface Payment {
  id: number;
  paymentPrice: number;
  couponPrice: number;
  booking?: {
    space?: {
      spaceName: string;
    };
  };
  user?: {
    userName: string;
    phoneNumber: string;
  };
}

export interface Reservation {
  bookingStatus: string;
  key: number;
  name: string;
  date: string;
  paymentAmount: number;
  paymentId: number;
  phoneNumber: string;
  spaceName: string;
  time: string;
}
