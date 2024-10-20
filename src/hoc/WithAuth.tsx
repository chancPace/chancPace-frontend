import { useSelector, UseSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AuthProps {
    roleRequired: string;
}

const WithAuth = (
    Component: React.ComponentType,
    { roleRequired }: AuthProps
) => {
    return (props: any) => {
        const role = useSelector((state: RootState) => state.user.role);
        const router = useRouter();
        if (role !== roleRequired) {
            return (
                <div>
                    권한이 없습니다.
                    <br />
                    이용을 원하시면 공간을 등록해주세요
                </div>
            );
        }
    };
};
export default WithAuth;
