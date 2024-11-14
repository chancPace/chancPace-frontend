import { getAllPayment } from '@/pages/api/paymentApi';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Chart } from 'react-chartjs-2';
import { DatePicker } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const SalesDayPage2 = ({ filteredData }: { filteredData: any[] }) => {
  const currentMonth = (dayjs().month() + 1).toString();
  const [sales, setSales] = useState<any[]>([]); // 매출 데이터를 저장
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth); // 선택된 월
  const [data, setData] = useState<any[]>([]); // 결제 내역 데이터를 저장

  // 결제 내역을 가져오는 함수
  const fetchPayments = async () => {
    try {
      const response = await getAllPayment();
      const result = response?.data?.filter((x: any) => {
        return dayjs(x.createdAt).format('YYYY-MM') === dayjs(`${dayjs().year()}-${selectedMonth}`).format('YYYY-MM');
      });
      setData(result);
      const dailySales: { [date: string]: { totalPaymentPrice: number; count: number } } = {};

      // 결제 내역을 일별로 처리
      result.forEach((x: any) => {
        if (typeof x.paymentPrice === 'number' && !isNaN(x.paymentPrice)) {
          const date = dayjs(x.createdAt);
          const month = date.month() + 1;
          const day = date.date();
          const formattedDay = `${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
          if (month.toString() === selectedMonth) {
            // 일별 매출 처리
            dailySales[formattedDay] = dailySales[formattedDay] || { totalPaymentPrice: 0, count: 0 };
            dailySales[formattedDay].totalPaymentPrice += x.paymentPrice;
            dailySales[formattedDay].count += 1;
          }
        }
      });

      // 일별 매출 데이터 배열로 변환
      const salesData = Object.keys(dailySales).map((key) => ({
        day: key,
        totalPaymentPrice: dailySales[key].totalPaymentPrice || 0,
        count: dailySales[key].count || 0,
      }));
      setSales(salesData);
    } catch (error) {
      console.error('결제 내역 불러오기 오류:', error);
    }
  };

  // 월별 날짜를 일별로 나누는 함수 (윤년, 2월, 31일 등 고려)
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const generateDailyDates = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const dates: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(`${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`);
    }
    return dates;
  };

  // 선택된 월에 대해 데이터를 다시 가져오기
  useEffect(() => {
    fetchPayments();
  }, [selectedMonth]);

  // 차트에 표시할 데이터
  const formattedSales = sales.reduce((acc, item) => {
    const formattedDate = dayjs(item.day).format('MM-DD');
    acc[formattedDate] = { totalPaymentPrice: item.totalPaymentPrice, count: item.count };
    return acc;
  }, {});

  // 선택된 월의 일별 날짜들
  const days = generateDailyDates(parseInt(selectedMonth), dayjs().year());
  const totalPaymentPrices = days.map((day) => formattedSales[day]?.totalPaymentPrice || 0);
  const counts = days.map((day) => formattedSales[day]?.count || 0);

  const chartData: ChartData = {
    labels: days,
    datasets: [
      {
        type: 'bar',
        label: '매출액',
        data: totalPaymentPrices,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        yAxisID: 'y-left',
      },
      // {
      //   type: 'bar', // 정산금액 - 막대 그래프
      //   label: '정산금액',
      //   data: settlementAmounts,
      //   backgroundColor: 'rgba(153, 102, 255, 0.2)', // 정산금액 색상 (라벤더 색상)
      //   borderColor: 'rgb(153, 102, 255)',
      //   borderWidth: 1,
      //   yAxisID: 'y-left', // 왼쪽 Y축
      // },
      {
        type: 'line',
        label: '매출건수',
        data: counts,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        yAxisID: 'y-right',
      },
    ],
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: '기간 (일)',
        },
      },
      'y-left': {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: '매출액 (원)',
        },
        grid: {
          display: true,
        },
      },
      'y-right': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: '매출건수',
        },
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            return `${Math.floor(value)}`;
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: '일별 매출 분석',
      },
    },
  };

  // 월 선택을 위한 MonthPicker
  const handleMonthChange = (date: any) => {
    if (date) {
      setSelectedMonth(date.format('MM'));
    }
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <DatePicker.MonthPicker
          value={dayjs(`${dayjs().year()}-${selectedMonth}`)}
          onChange={handleMonthChange}
          style={{ width: 200 }}
          placeholder="월을 선택하세요"
        />
      </div>
      <Chart data={chartData} options={chartOptions} type={'bar'} />
    </>
  );
};

export default SalesDayPage2;
