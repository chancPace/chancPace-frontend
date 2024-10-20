import { HeaderStyled } from './styled';
import Link from 'next/link';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';

const Header = () => {
    const dispatch = useDispatch();
    const { isLoggedIn} = useSelector(
        (state: RootState) => state.user
    );
    return (
        <HeaderStyled>
            <nav>
                <Link href="/">
                    <span className="logo">ChancePace</span>
                </Link>

                <div className="userBar">
                    {isLoggedIn ? (
                        <Link href="http://localhost:3000/login" passHref>
                            <span>로그인</span>
                        </Link>
                    ) : (
                        <></>
                    )}
                </div>
            </nav>
        </HeaderStyled>
    );
};
export default Header;
