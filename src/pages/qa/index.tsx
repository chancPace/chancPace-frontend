import WithAuth from '@/hoc/WithAuth';

const qa = () => {
    return <div>q&a</div>;
};
export default WithAuth(qa, { roleRequired: 'HOST' });
