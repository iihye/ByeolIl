import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

function KakaoLogin() {
    const location = useLocation();
    const params = new URL(document.URL).searchParams;
    const code = params.get('code');

    const getKakaoToken = () => {
        fetch(`https://kauth.kakao.com/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&code=${code}`,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                } else {
                    console.log(data);
                    console.log('로그인 실패');
                }
            });
    };

    useEffect(() => {
        if (!location.search) return;
        getKakaoToken();
    }, []);

    return <div>{code}</div>;
}

export default KakaoLogin;
