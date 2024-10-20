import WithAuth from '@/hoc/withAuth';

const sales = () => {
    return <div>매출조회</div>;
};
export default WithAuth(sales, { roleRequired: 'host' });
