import { SalesStyled } from './styled';
import { Button, DatePicker, Input, Table, TableColumnsType } from 'antd';
const { RangePicker } = DatePicker;
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { getMySpace } from '@/pages/api/spaceApi';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Booking, Payment, SpaceType } from '@/types';

dayjs.extend(isBetween); // 플러그인 확장

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
  date: string;
  spaceName: string;
  totalAmount: number;
  feeAmount: number;
  settlementAmount: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: '결제일',
    dataIndex: 'date',
  },
  {
    title: '공간명',
    dataIndex: 'spaceName',
  },
  {
    title: '매출액',
    dataIndex: 'totalAmount',
    render: (value) => value.toLocaleString(),
  },
  {
    title: '수수료',
    dataIndex: 'feeAmount',
    render: (value) => value.toLocaleString(),
  },
  {
    title: '정산액',
    dataIndex: 'settlementAmount',
    render: (value) => value.toLocaleString(),
  },
];

const Sales = () => {
  const router = useRouter();
  //모든 예약 정보 데이터
  const [data, setData] = useState<DataType[]>([]);
  //검색어 및 날짜 필터링 기반 데이터
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const userId = useSelector((state: RootState) => state.user.id);
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);

          const transformedData = response.data
            .map((space: SpaceType) => {
              return space.bookings?.map((booking: Booking) => {
                const user = booking.user;
                const payment = user?.payments.find(
                  (p: Payment) => p.id === booking.paymentId
                );
                const paymentAmount = payment ? payment.paymentPrice : 0;
                const couponAmount = payment ? payment.couponPrice : 0;
                const totalAmount = paymentAmount + couponAmount;
                const feeAmount = totalAmount * 0.05; // 수수료 (매출액의 5%)
                const settlementAmount = totalAmount - feeAmount; // 정산 금액

                return {
                  key: booking.id,
                  paymentId: booking.paymentId,
                  date: booking.startDate,
                  spaceName: space.spaceName,
                  totalAmount,
                  feeAmount,
                  settlementAmount,
                };
              });
            })
            .flat();

          setData(transformedData);
          setFilteredData(transformedData); // 전체 데이터를 초기 상태로 설정
        } catch (error) {
          console.error('예약 데이터 불러오기 실패:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      searchText: '', //검색어
      dateRange: [] as [string, string] | [], //날짜범위
    },
    onSubmit: (values) => {
      const { searchText, dateRange } = values;
      const filtered = data.filter((item) => {
        //공간이름과 동일한 항목이 있는지
        const matchesSearch = searchText
          ? item.spaceName.toLowerCase().includes(searchText.toLowerCase())
          : true;

        const matchesDate =
          //2개의 날짜 (start / end)
          dateRange.length === 2
            ? //item.data가 dateRange의 시작 날짜(dateRange[0])와 끝 날짜(dateRange[1]) 사이에 있는지 확인
              dayjs(item.date).isBetween(
                dayjs(dateRange[0]),
                dayjs(dateRange[1]),
                //day단위로 비교하고 시작 및 끝 날짜를 범위에 포함시키는 옵션
                'day',
                '[]'
              )
            : true;

        return matchesSearch && matchesDate;
      });
      setFilteredData(filtered);
      formik.setFieldValue('searchText', '');
    },
  });

  const handleDateFilter = (rangeType: 'week' | 'month' | 'year') => {
    //현재 날짜
    const start = dayjs();
    //시작날짜와 종료날짜
    let dateRange: [string, string];

    if (rangeType === 'week') {
      dateRange = [
        start.startOf('week').format('YYYY-MM-DD'),
        start.endOf('week').format('YYYY-MM-DD'),
      ];
    } else if (rangeType === 'month') {
      dateRange = [
        start.startOf('month').format('YYYY-MM-DD'),
        start.endOf('month').format('YYYY-MM-DD'),
      ];
    } else {
      dateRange = [
        start.startOf('year').format('YYYY-MM-DD'),
        start.endOf('year').format('YYYY-MM-DD'),
      ];
    }

    formik.setFieldValue('dateRange', dateRange);
    // formik.handleSubmit(); // 필터링 수행
    formik.setFieldValue('dateRange', dateRange);
  };

  const handleReset = () => {
    formik.resetForm();
    setFilteredData(data); // 전체 데이터를 다시 설정
  };

  const handleRowClick = (record: DataType) => {
    router.push(`/sales/details?id=${record.paymentId}`);
  };

  return (
    <SalesStyled>
      <form onSubmit={formik.handleSubmit} className="filter-section">
        <Input
          name="searchText"
          placeholder="검색어를 입력하세요"
          onChange={formik.handleChange}
          value={formik.values.searchText}
          allowClear
        />
        <RangePicker
          onChange={(dates) => {
            const dateRange =
              dates && dates[0] && dates[1]
                ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]
                : [];
            formik.setFieldValue('dateRange', dateRange);
          }}
          value={
            formik.values.dateRange.length === 2
              ? [
                  dayjs(formik.values.dateRange[0]),
                  dayjs(formik.values.dateRange[1]),
                ]
              : undefined
          }
        />
        <Button htmlType="submit" style={{ marginLeft: 8 }}>
          검색
        </Button>
        <Button onClick={handleReset} style={{ marginLeft: 8 }}>
          전체보기
        </Button>
      </form>
      <div className="filter-buttons">
        <Button onClick={() => handleDateFilter('week')}>일주일</Button>
        <Button onClick={() => handleDateFilter('month')}>월별</Button>
        <Button onClick={() => handleDateFilter('year')}>연도별</Button>
      </div>
      <Table<DataType>
        columns={columns}
        dataSource={filteredData} // 필터링된 데이터를 데이터 소스로 설정
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </SalesStyled>
  );
};

export default Sales;
