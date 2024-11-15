import { Button, Form, Input } from 'antd';
import { ReservationInquiryStyled } from './styled';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Link from 'next/link';
import { getMySpace } from '@/pages/api/spaceApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { SpaceType } from '@/types';

interface DataType {
  key: React.Key;
  bookingStatus: string;
  createdAt: string;
  endTime: number;
  id: number;
  spaceId: number;
  startData: string;
  startTime: number;
  updatedAt: string;
  userId: number;
  paymentId: number;
}

const ReservationInquiry = () => {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.user.userInfo?.id); // 리덕스에서 userId 가져옴
  const [data, setData] = useState<DataType[]>([]); // 예약 데이터를 저장할 상태
  const [filteredData, setFilteredData] = useState<DataType[]>([]); // 검색 결과용 상태
  const [searchText, setSearchText] = useState(''); // 검색어 상태

  //내 공간의 예약가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const transformedData = response.data
            .map((space: SpaceType) => {
              return space.bookings?.map((booking) => {
                const user = booking.user;
                const payment = user?.payments.find((p) => p.id === booking.paymentId);
                return {
                  key: booking.id,
                  paymentId: booking.paymentId,
                  spaceName: space.spaceName,
                  name: user?.userName,
                  date: booking.startDate,
                  time: `${booking.startTime}:00 - ${booking.endTime}:00`,
                  phoneNumber: user?.phoneNumber,
                  paymentAmount: payment ? payment.paymentPrice : '정보 없음',
                };
              });
            })
            .flat();
          setData(transformedData);
          setFilteredData(transformedData);
        } catch (error) {
          console.error('예약 데이터 불러오기 실패:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      searchText: '',
    },
    onSubmit: (values) => {
      const filtered = data.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(values.searchText.toLowerCase()))
      );
      setFilteredData(filtered);
    },
  });

  //검색 초기화
  const handleReset = () => {
    formik.resetForm(); // 검색어 입력 필드와 필터링 결과 초기화
    setFilteredData(data);
  };

  //리스트 클릭 시 상세 페이지로 이동
  const handleRowClick = (record: DataType) => {
    router.push(`/reservation/details/${record.paymentId}`);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: '공간명',
      dataIndex: 'spaceName',
    },
    {
      title: '예약자',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '방문일자',
      dataIndex: 'date',
    },
    {
      title: '방문시간',
      dataIndex: 'time',
    },
    {
      title: '전화번호',
      dataIndex: 'phoneNumber',
    },
    {
      title: '금액',
      dataIndex: 'paymentAmount',
      render: (value) => `${value.toLocaleString()}원`,
    },
    {
      title: '상세 페이지',
      dataIndex: 'action',
      render: (_: any, record: any) => <a onClick={() => handleRowClick(record)}>상세 보기</a>,
    },
  ];

  return (
    <ReservationInquiryStyled>
      <p>예약 목록</p>
      {/* <form className="search-section" onSubmit={formik.handleSubmit}>
        <Input
          name="searchText"
          placeholder="검색어를 입력해주세요"
          value={formik.values.searchText}
          onChange={formik.handleChange}
          // allowClear
        />
        <Button htmlType="submit">검색</Button>
        <Button onClick={handleReset} style={{ marginLeft: 8 }}>
          전체 보기
        </Button>
      </form> */}
      <div className="inquiry-section">
        <Table<DataType> columns={columns} dataSource={filteredData} />
      </div>
    </ReservationInquiryStyled>
  );
};
export default ReservationInquiry;
