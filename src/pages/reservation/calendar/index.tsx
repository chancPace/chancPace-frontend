import SalesCalendar from '@/components/SalesCalendar';
import WithAuth from '@/hoc/withAuth';

const calendar = () => {
    return (
        <>
            <SalesCalendar />
        </>
    );
};
export default WithAuth(calendar, { roleRequired: 'HOST' });
