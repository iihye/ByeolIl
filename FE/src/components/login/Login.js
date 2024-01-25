import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// + 아이디 찾기, 비밀번호 찾기, 회원가입 navigate
// + cors 에러 해결 예정
// + JWT 디코더

// const kakaoLoginLink=`https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP}&redirect_uri=${REDIRECT_URI}&response_type=code`;

function Login() {
    const [idValue, setIdValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const idRef = useRef('');
    const passwordRef = useRef('');

    const handleIdValue = (e) => {
        setIdValue(e.target.value);
    };

    const handlePwValue = (e) => {
        passwordRef.current.value = e.target.value;
    };

    // 맨 처음 마운트 될 때 autofocus
    useEffect(() => {
        idRef.current.focus();
    }, []);

    // 아이디 값이 바뀔 때마다 유효성 검사
    useEffect(() => {
        const idRegExp = /^[a-z0-9]+$/;

        idValue.length < 4
            ? setErrorMessage('4자 이상 입력해주세요')
            : idRegExp.test(idValue)
            ? setErrorMessage(null)
            : setErrorMessage('영문 소문자, 숫자만 입력 가능해요');
    }, [idValue]);

    // 로그인 함수
    const onLogin = () => {
        const loginInfo = {
            memberId: idValue,
            memberPass: idRef.current.value,
            memberPlatform: 'origin',
        };

        console.log(process.env.REACT_APP_API_URL);

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/member/login/origin`,
                    loginInfo
                );
                const token = `Bearer ${response.data.token}`;
                localStorage.setItem('token', token);
                axios.defaults.headers.common[
                    'token'
                ] = `Bearer ${response.data.token}`;
                // navigate('/');
            } catch (error) {
                console.log('로그인 요청 실패', error);
            }
        };

        // JWT 디코딩
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
            } catch (error) {
                console.log('회원정보 가져오기 실패', error);
            }
        };

        fetchData();
        // getUserIndex();
    };

    // 카카오 로그인 함수
    // const onKakaoLogin = () => {
    //     window.location.href = kakaoLoginLink;
    // };

    return (
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
                    ref={passwordRef}
                    onChange={handlePwValue}
                />
            </div>
            <div className="loginOption">
                <p>아이디 찾기</p>
                <p>비밀번호 찾기</p>
                <p>회원가입</p>
            </div>
            <div className="loginButton">
                <button onClick={onLogin}>로그인</button>
            </div>
            <div className="kakaoLoginButton">
                {/* <button onClick={onKakaoLogin}>카카오로 로그인하기</button> */}
            </div>
        </div>
    );
}

export default Login;
