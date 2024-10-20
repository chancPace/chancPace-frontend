import WithAuth from "@/hoc/withAuth";

const qa = () => {
    return <div>q&a</div>;
};
export default WithAuth(qa, { roleRequired: 'host' });
