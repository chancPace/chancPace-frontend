import WithAuth from '@/hoc/withAuth';

const inquiry = () => {
    return <div>예약조회</div>;
};
export default WithAuth(inquiry, { roleRequired: 'HOST' });