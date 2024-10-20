import WithAuth from "@/hoc/withAuth";

const review = () => {
    return <div>review</div>;
};
export default WithAuth(review, { roleRequired: 'host' });
