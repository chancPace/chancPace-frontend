import WithAuth from '@/hoc/WithAuth';

const review = () => {
    return <div>review</div>;
};
export default WithAuth(review, { roleRequired: 'HOST' });
