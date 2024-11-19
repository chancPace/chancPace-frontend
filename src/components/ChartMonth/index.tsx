import { Chart } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  BarController,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

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

interface ChartMonthProps {
  filteredData: { date: string; totalAmount: number; settlementAmount: number }[];
  selectDate: string;
}

const ChartMonth = ({ filteredData, selectDate }: ChartMonthProps) => {
  const currentYear = dayjs().year().toString();
  const [sales, setSales] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  // 월별 매출 데이터를 계산하는 함수
  useEffect(() => {
    const monthlySales: { [month: string]: { totalPaymentPrice: number; count: number; settlementAmount: number } } =
      {};

    filteredData.forEach((x: any) => {
      const date = dayjs(x.date);
      const year = date.year();
      const month = date.month() + 1;
      const formattedMonth = `${month < 10 ? `0${month}` : month}`;

      // 선택된 연도에 해당하는 데이터만 필터링
      if (year.toString() === selectedYear) {
        monthlySales[formattedMonth] = monthlySales[formattedMonth] || {
          totalPaymentPrice: 0,
          count: 0,
          settlementAmount: 0,
        };

        const totalAmount = x.totalAmount;
        const settlementAmount = x.settlementAmount;

        monthlySales[formattedMonth].totalPaymentPrice += totalAmount;
        monthlySales[formattedMonth].count += 1;
        monthlySales[formattedMonth].settlementAmount += settlementAmount;
      }
    });

    // 월별 매출 데이터 배열로 변환
    const salesData = Object.keys(monthlySales).map((month) => ({
      month: month,
      totalPaymentPrice: monthlySales[month].totalPaymentPrice || 0,
      count: monthlySales[month].count || 0,
      settlementAmount: monthlySales[month].settlementAmount || 0,
    }));

    setSales(salesData);
  }, [selectedYear, filteredData]);

  // 차트에 사용할 데이터 준비
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1 < 10 ? `0${i + 1}` : i + 1}`);
  const formattedSales = sales.reduce((acc, item) => {
    acc[item.month] = {
      totalPaymentPrice: item.totalPaymentPrice,
      count: item.count,
      settlementAmount: item.settlementAmount,
    };
    return acc;
  }, {});

  const totalPaymentPrices = months.map((month) => formattedSales[month]?.totalPaymentPrice || 0);
  const counts = months.map((month) => formattedSales[month]?.count || 0);
  const settlementAmounts = months.map((month) => formattedSales[month]?.settlementAmount || 0);

  const chartData: ChartData = {
    labels: months,
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
          text: '기간 (월)',
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
        text: '월별 매출 분석',
      },
    },
  };

  return <Chart data={chartData} options={chartOptions} type={'bar'} />;
};

export default ChartMonth;
