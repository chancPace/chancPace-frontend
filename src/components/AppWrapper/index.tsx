import Template from '@/layouts/Template';
import { Component, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, UseDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { getUserDataByToken } from '@/api/api';
import { setUser } from '@/utill/redux/slices/userSlice';

const AppWrapper = ({
    Component,
    pageProps,
}: {
    Component: any;
    pageProps: any;
}) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            // console.log('Fetching user data...');
            const token = Cookies.get('token');
            // console.log('Token: ', token);

            if (token) {
                try {
                    const userData = await getUserDataByToken(token);
                    console.log('User Data: ', userData);

                    if (userData.result) {
                        dispatch(
                            setUser({
                                email: userData.data.email,
                                name: userData.data.name,
                                role: userData.data.role,
                            })
                        );
                    }
                    setLoading(false);
                } catch (error: any) {
                    console.error('에러발생');
                    // router.push('http://localhost:3000/login');
                }
            } else {
                console.error('토큰이 없습니다');
                // router.push('http://localhost:3000/login');
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return <div> Loading...</div>;
    }

    return (
        <Template>
            <Component {...pageProps} />
        </Template>
    );
};
export default AppWrapper;
