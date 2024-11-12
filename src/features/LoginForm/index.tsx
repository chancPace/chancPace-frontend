import { LoginStyled } from './styled';
import { Input, message } from 'antd';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { postLogin } from '@/pages/api/userApi';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { loginSuccess } from '@/redux/slices/userSlice';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Buttons from '../Buttons';

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: 'test@daum.net',
      password: 'password1234!',
    },
    validate: (values) => {
      const errors: { email?: string; password?: string } = {};
      if (!values.email) {
        errors.email = '아이디를 입력해주세요';
      }
      if (!values.password) {
        errors.password = '비밀번호를 입력해주세요';
      }
      return errors;
    },
    onSubmit: async (values) => {
      const { email, password } = values;
      try {
        console.log('Calling postLogin...');

        const response = await postLogin({ email, password });
        console.log('Login response:', response);

        if (response.token) {
          setEmailError(null);
          setPasswordError(null);
          Cookies.set('token', response.token, { expires: 1 });
          message.success('로그인 성공');

          dispatch(
            loginSuccess({
              email: response.data.email,
              userName: response.data.userName,
              role: response.data.role,
              token: response.token,
              id: response.data.id,
              phoneNumber: response.data.phoneNumber,
            })
          );
          router.push('/');
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        console.log('Axios Error:', axiosError);
        if (axiosError.response) {
          if (axiosError.response.status === 404) {
            setEmailError('존재하지 않는 회원입니다.');
          } else if (axiosError.response.status === 401) {
            setPasswordError('비밀번호가 틀렸습니다');
          } else {
            message.error('로그인에 실패했습니다.');
          }
        } else {
          message.error('서버와의 연결에 실패했습니다.');
        }
      }
    },
  });

  return (
    <LoginStyled>
      <form onSubmit={formik.handleSubmit} className="form">
        <p className="formLogo">ChancePace</p>

        <Input
          name="email"
          placeholder="이메일"
          onChange={formik.handleChange}
          value={formik.values.email}
          onBlur={formik.handleBlur}
        />
        <p className="error">
          {(formik.touched.email && formik.errors.email) || emailError || ''}
        </p>

        <Input.Password
          name="password"
          placeholder="비밀번호"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
        />
        <p className="error">
          {(formik.touched.password && formik.errors.password) ||
            passwordError ||
            ''}
        </p>
        <Buttons text="로그인"></Buttons>
        <div>
          <Link href="/signup" passHref>
            <span className="span1">아직 회원이 아니신가요?</span>
          </Link>
          <Link href="/signup" passHref>
          </Link>
        </div>
      </form>
    </LoginStyled>
  );
};

export default LoginForm;
