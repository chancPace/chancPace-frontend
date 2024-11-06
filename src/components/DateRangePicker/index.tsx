import React, { useState } from 'react';
import { DatePicker, Button, Space } from 'antd';
import { DateRangePickerStyled } from './styled';
const { RangePicker } = DatePicker;
import dayjs, { Dayjs } from 'dayjs';

const DateRangePicker = () => {
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const onChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDates(dates);
    console.log('Selected Dates:', dates); // 선택한 날짜를 콘솔에 출력
  };

  return (
    <DateRangePickerStyled>
      <div className="date-btn">
        <Button onClick={() => setDates([dayjs().subtract(7, 'day'), dayjs()])}>
          1주일
        </Button>
        <Button
          onClick={() => setDates([dayjs().subtract(1, 'month'), dayjs()])}
        >
          1개월
        </Button>
        <Button
          onClick={() => setDates([dayjs().subtract(6, 'month'), dayjs()])}
        >
          6개월
        </Button>
        <Button
          onClick={() => setDates([dayjs().subtract(1, 'year'), dayjs()])}
        >
          1년
        </Button>
      </div>
      <RangePicker value={dates} onChange={onChange} format="YYYY/MM/DD" />
    </DateRangePickerStyled>
  );
};
export default DateRangePicker;
