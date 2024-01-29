import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import base64 from 'base-64';
import { useSetRecoilState } from 'recoil';
import { userIndexState, userInfoState } from '../atom';

// + 아이디 찾기, 비밀번호 찾기, 회원가입 navigate

const kakaoLoginLink = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;

function Login() {
    const [idValue, setIdValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDisable, setIsDisble] = useState(true);
    const setUserIndexState = useSetRecoilState(userIndexState);
    const setUserInfoState = useSetRecoilState(userInfoState);
    const idRef = useRef('');

    const navigate = useNavigate();

    const handleIdValue = (e) => {
        setIdValue(e.target.value);
    };

    const handlePwValue = (e) => {
        setPasswordValue(e.target.value);
    };

    const onLogOut = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    // 맨 처음 마운트 될 때 autofocus
    useEffect(() => {
        if (localStorage.getItem('isLogin') === 'false' && idRef.current) {
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
            memberPass: idRef.current.value,
            memberPlatform: 'origin',
        };

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/member/login/origin`,
                    loginInfo
                );

                if (response.status === 200) {
                    const token = `Bearer ${response.headers.accesstoken}`;

                    localStorage.setItem('token', token);

                    axios.defaults.headers.common[
                        'Authorization'
                    ] = `Bearer ${response.headers.accesstoken}`;

                    // JWT 디코딩
                    let payload = token.substring(
                        token.indexOf('.') + 1,
                        token.lastIndexOf('.')
                    );

                    let dec = JSON.parse(base64.decode(payload));
                    setUserIndexState(dec.sub);
                    getUserIndex();
                    navigate(`/space/${dec.sub}`);
                }
            } catch (error) {
                if (error.response.status === 400) {
                    alert(error.response.data.message);
                }
            }
        };

        // 유저 정보 가져오기
        const getUserIndex = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/member/info/mine`,
                    {
                        headers: {
                            token: localStorage.getItem('token'),
                        },
                    }
                );
                console.log(response.data);
                setUserInfoState(response.data);
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

    return (
        <div>
            {localStorage.getItem('token') ? (
                <div className="LogOut">
                    <button onClick={onLogOut}>로그아웃</button>
                </div>
            ) : (
                <div className="Login">
                    <div className="inputForm">
                        <input
                            type="text"
                            name="ID"
                            ref={idRef}
                            value={idValue}
                            onChange={handleIdValue}
                            maxLength="20"
                        />
                        {errorMessage && (
                            <p className="idErrorMessage">{errorMessage}</p>
                        )}
                        <input
                            type="password"
                            name="PW"
                            value={passwordValue}
                            onChange={handlePwValue}
                        />
                    </div>

                    <div className="loginOption">
                        <p>아이디 찾기</p>
                        <p>비밀번호 찾기</p>
                        <p>회원가입</p>
                    </div>
                    <div className="loginButton">
                        <button onClick={onLogin} disabled={isDisable}>
                            로그인
                        </button>
                    </div>
                    <div className="kakaoLoginButton">
                        <button onClick={onKakaoLogin}>
                            카카오로 로그인하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
