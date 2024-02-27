import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import base64 from 'base-64';
import { Button } from '@/components/ui/button';
import { ReactComponent as KakaoLogo } from 'img/kakao-logo.svg';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { replace } from 'stylis';
import swal from 'sweetalert';

const kakaoLoginLink = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_LOGIN_REDIRECT_URI}&response_type=code&prompt=login`;

function Login() {
    const [idValue, setIdValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDisable, setIsDisble] = useState(true);
    const idRef = useRef('');

    const navigate = useNavigate();

    const handleIdValue = (e) => {
        setIdValue(e.target.value);
    };

    const handlePwValue = (e) => {
        setPasswordValue(e.target.value);
    };

    // 맨 처음 마운트 될 때 autofocus
    useEffect(() => {
        if (idRef.current) {
            idRef.current.focus();
        }
    }, []);

    // 아이디 값이 바뀔 때마다 유효성 검사
    // 아이디가 유효하고 비밀번호가 빈값이 아닌 경우에만 로그인 버튼 활성화
    useEffect(() => {
        const idRegExp = /^[a-z0-9]+$/;

        if (idValue.length < 4) {
            setErrorMessage('4자 이상 입력해주세요');
            setIsDisble(true);
        } else if (!idRegExp.test(idValue)) {
            setErrorMessage('영문 소문자, 숫자만 입력 가능해요');
            setIsDisble(true);
        } else {
            setErrorMessage(null);

            if (passwordValue !== '') {
                setIsDisble(false);
            } else {
                setIsDisble(true);
            }
        }
    }, [idValue, passwordValue]);

    // 로그인 함수
    const onLogin = () => {
        const loginInfo = {
            memberId: idValue,
            memberPass: passwordValue,
            memberPlatform: 'origin',
        };

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/member/login/origin`,
                    loginInfo
                );

                if (response.status === 200) {
                    swal({
                        title: '로그인 성공!',
                        icon: 'success',
                    });
                    const token = `Bearer ${response.headers.accesstoken}`;

                    sessionStorage.setItem('token', token);

                    // JWT 디코딩
                    let payload = token.substring(
                        token.indexOf('.') + 1,
                        token.lastIndexOf('.')
                    );

                    let dec = JSON.parse(base64.decode(payload));
                    sessionStorage.setItem('auth', dec.auth);
                    sessionStorage.setItem('memberIndex', dec.sub);
                    getUserIndex();
                    if (dec.sub) {
                        navigate(`/space/${dec.sub}`, { replace: true });
                    }
                }
            } catch (error) {}
        };

        // 유저 정보 가져오기
        const getUserIndex = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/member/info/mine`,
                    {
                        headers: {
                            token: sessionStorage.getItem('token'),
                        },
                    }
                );

                sessionStorage.setItem(
                    'nickname',
                    response.data.memberNickname
                );
            } catch (error) {
                console.log('회원정보 가져오기 실패', error);
            }
        };

        fetchData();
    };

    // 카카오 로그인 함수
    const onKakaoLogin = () => {
        window.location.href = kakaoLoginLink;
    };

    // 로그인 엔터 이벤트
    const onEnterLogin = (e) => {
        if (e.key === 'Enter' && !isDisable) {
            onLogin();
        }
    };

    return (
        <div>
            <Card className="w-96 px-6 h-login card-contain-style">
                <CardHeader>
                    <CardTitle className="text-6xl text-center font-['Star'] py-4">
                        별일
                    </CardTitle>
                    <CardDescription className="font-['Pre-Bold'] text-2xl mb-8">
                        로그인
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 font-['Pre-Bold']">
                    <div className="grid gap-1 mt-2 ">
                        <Label htmlFor="email">아이디</Label>
                        <Input
                            type="text"
                            name="ID"
                            ref={idRef}
                            value={idValue}
                            onChange={handleIdValue}
                            maxLength="20"
                            className="regist-input border border-white-sub focus:ring-1 focus:ring-white-sub h-input "
                        />
                        <p
                            className={`text-xs h-5 ${
                                errorMessage ? 'text-red-500' : ''
                            }`}
                        >
                            {errorMessage || ''}
                        </p>
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            type="password"
                            name="PW"
                            value={passwordValue}
                            onChange={handlePwValue}
                            onKeyPress={onEnterLogin}
                            className="regist-input border border-white-sub focus:ring-1 focus:ring-white-sub h-input"
                        />
                    </div>
                </CardContent>

                <div className="font-['Pre-Bold'] relative flex place-content-evenly text-s my-3">
                    <div>
                        <Link to={'/landing/findId'}>아이디 찾기</Link>
                    </div>
                    <div>
                        <Link to={'/landing/findPw'}>비밀번호 찾기</Link>
                    </div>
                    <div>
                        <Link to={'/landing/regist'}>회원가입</Link>
                    </div>
                </div>
                <CardFooter className="font-['Pre-Bold'] ">
                    <div className="loginButton">
                        <Button
                            onClick={onLogin}
                            disabled={isDisable}
                            className={`w-full h-button my-1 ${
                                isDisable ? 'opacity-50' : ''
                            }`}
                        >
                            로그인
                        </Button>
                    </div>
                    <div className="kakaoLoginButton align-middle">
                        <Button
                            onClick={onKakaoLogin}
                            className="w-full h-button my-1 no-hover-effect text-kakao-label flex justify-center items-center gap-2"
                        >
                            <KakaoLogo className="w-6 h-6 p-0.5 " />
                            <div>카카오 로그인</div>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Login;
