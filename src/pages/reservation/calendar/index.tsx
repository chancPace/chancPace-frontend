import SalesCalendar from '@/components/SalesCalendar';
import WithAuth from '@/hoc/WithAuth';

const calendar = () => {
    return (
        <>
            <SalesCalendar />
        </>
    );
};
export default WithAuth(calendar, { roleRequired: 'HOST' });
