import WithAuth from '@/hoc/WithAuth';

const sales = () => {
    return <div>매출조회</div>;
};
export default WithAuth(sales, { roleRequired: 'HOST' });
