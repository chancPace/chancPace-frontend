import { Chart } from 'react-chartjs-2';
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { useRouter } from 'next/router';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

const ChartDay = ({ filteredData }: { filteredData: any[] }) => {
  const router = useRouter();
  const page = router.pathname;
  const currentMonth = (dayjs().month() + 1).toString();
  const [sales, setSales] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

  // 해당 월의 일 (윤년, 2월, 31일 등 고려)
  const generateDailyDates = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(day.toString());
    }
    return dates;
  };

  // 선택된 월에 대한 필터링된 데이터를 바탕으로 매출 데이터를 처리하는 함수
  useEffect(() => {
    const dailySales: {
      [date: string]: { totalPaymentPrice: number; count: number; feeAmount: number; settlementAmount: number };
    } = {};

    filteredData.forEach((x: any) => {
      const date = dayjs(x.date);
      const month = date.month() + 1;
      const day = date.date();
      const formattedDay = day.toString();

      if (month.toString() === selectedMonth) {
        dailySales[formattedDay] = dailySales[formattedDay] || {
          totalPaymentPrice: 0,
          count: 0,
          feeAmount: 0,
          settlementAmount: 0,
        };

        const totalAmount = x.totalAmount;
        const feeAmount = x.feeAmount;
        const settlementAmount = x.settlementAmount;

        dailySales[formattedDay].totalPaymentPrice += totalAmount;
        dailySales[formattedDay].count += 1;
        dailySales[formattedDay].feeAmount += feeAmount;
        dailySales[formattedDay].settlementAmount += settlementAmount;
      }
    });

    // 일별 매출 데이터 배열로 변환
    const salesData = Object.keys(dailySales).map((key) => ({
      day: key,
      totalPaymentPrice: dailySales[key].totalPaymentPrice || 0,
      count: dailySales[key].count || 0,
      feeAmount: dailySales[key].feeAmount || 0,
      settlementAmount: dailySales[key].settlementAmount || 0,
    }));

    setSales(salesData);
  }, [selectedMonth, filteredData]);

  // 선택된 월의 일별 날짜들
  const days = generateDailyDates(parseInt(selectedMonth), dayjs().year());
  const formattedSales = sales.reduce((acc, item) => {
    acc[item.day] = {
      totalPaymentPrice: item.totalPaymentPrice,
      count: item.count,
      settlementAmount: item.settlementAmount,
    };
    return acc;
  }, {});

  const totalPaymentPrices = days.map((day) => formattedSales[day]?.totalPaymentPrice || 0);
  const counts = days.map((day) => formattedSales[day]?.count || 0);
  const settlementAmounts = days.map((day) => formattedSales[day]?.settlementAmount || 0);

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
      {
        type: 'bar',
        label: '정산액',
        data: settlementAmounts,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
        yAxisID: 'y-left',
      },
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
          text: '금액 (원)',
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
          callback: (value: any) => `${Math.floor(value)}`,
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
      {page !== '/' ? (
        <div style={{ marginBottom: 20 }}>
          <DatePicker.MonthPicker
            value={dayjs(`${dayjs().year()}-${selectedMonth}`)}
            onChange={handleMonthChange}
            style={{ width: 200 }}
            placeholder="월을 선택하세요"
          />
        </div>
      ) : (
        <></>
      )}
      <Chart data={chartData} options={chartOptions} type={'bar'} />
    </>
  );
};

export default ChartDay;
