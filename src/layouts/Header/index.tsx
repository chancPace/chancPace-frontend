import { HeaderStyled } from './styled';
import Link from 'next/link';

const Header = () => {
    return (
        <HeaderStyled>
            <nav>
                <Link href="/">
                    <span className='logo'>ChancePace</span>
                </Link>

                <div className="userBar">
                    <Link href='http://localhost:3000/login' passHref>
                        <span>로그인</span>
                    </Link>
                </div>
            </nav>
        </HeaderStyled>
    );
};
export default Header;
