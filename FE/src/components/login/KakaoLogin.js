import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

function KakaoLogin() {
    const location = useLocation();
    const params = new URL(document.URL).searchParams;
    const code = params.get('code');

    console.log(code);

    const getKakaoToken = () => {
        console.log('들어왔따');
        // fetch(`https://kauth.kakao.com/oauth/token`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //     body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&code=${code}`,
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         if (data.access_token) {
        //             console.log('됨');
        //             localStorage.setItem('token', data.access_token);
        //         } else {
        //             console.log(data);
        //             console.log('로그인 실패');
        //         }
        //     });
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/member/join/kakao?code=${code}`
            )
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        if (!location.search) return;

        getKakaoToken();
    }, []);
}

export default KakaoLogin;
