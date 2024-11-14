import { getAllPayment } from '@/pages/api/paymentApi';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Chart } from 'react-chartjs-2';
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

const SalesDayPage = () => {
  const currentMonth = (dayjs().month() + 1).toString();
  const [sales, setSales] = useState<any[]>([]);
  const [data, setData] = useState();
  const [selectedDateTime, setSelectedDateTime] = useState<dayjs.Dayjs | null>(dayjs()); // 선택된 연도 또는 월
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 결제 내역을 가져오는 함수
  const fetchPayments = async () => {
    const response = await getAllPayment();
    console.log('🚀 ~ fetchPayments ~ response:', response);
    const result = response?.data?.filter((x: any, i: number) => {
      return dayjs(x.createdAt).format('YYYY-MM') === dayjs(selectedDateTime).format('YYYY-MM');
    });
    setData(result);
    const dailySales: { [date: string]: { totalPaymentPrice: number; count: number } } = {};

    // 결제 내역을 월별 또는 일별로 처리
    response.data.forEach((x: any) => {
      if (typeof x.paymentPrice === 'number' && !isNaN(x.paymentPrice)) {
        const date = dayjs(x.createdAt); // dayjs로 날짜를 처리
        const month = date.month() + 1; // month()는 0부터 시작하므로 +1
        const day = date.date();
        const formattedDay = `${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
        // 선택된 월과 일자가 일치하는 데이터만 필터링
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

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth]);

  // // 차트에 표시할 데이터
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
        type: 'bar', // 매출액은 막대그래프
        label: '매출액',
        data: totalPaymentPrices,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        yAxisID: 'y-left', // 왼쪽 Y축에 매핑
      },
      {
        type: 'line', // 매출건수는 선그래프
        label: '매출건수',
        data: counts,
        fill: false, // 선 그래프의 내부 채우지 않음
        borderColor: 'rgb(255, 99, 132)', // 선의 색상
        tension: 0.1,
        yAxisID: 'y-right', // 오른쪽 Y축에 매핑
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
          text: '매출액 (원)', // 왼쪽 Y축 제목
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
          text: '매출건수', // 오른쪽 Y축 제목
        },
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            return `${Math.floor(value)}`; // 숫자를 그대로 문자열로 반환
          },
        },
        grid: {
          display: false, // 오른쪽 Y축 그리드는 숨김
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

  return <Chart data={chartData} options={chartOptions} type={'bar'} />;
};

export default SalesDayPage;
