import { SalesCalendarStyled } from './styled';
import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

const SalesCalendar = () => {
    const onPanelChange = (
        value: Dayjs,
        mode: CalendarProps<Dayjs>['mode']
    ) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };
    return (
        <SalesCalendarStyled>
            <Calendar onPanelChange={onPanelChange} />
        </SalesCalendarStyled>
    );
};
export default SalesCalendar;
