import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { atom, useRecoilState } from 'recoil';

// export const tokenState = atom({
//     key: 'tokenState',
//     default: ' ',
// });

function KakaoLogin() {
    const location = useLocation();
    const params = new URL(document.URL).searchParams;
    const code = params.get('code');

    //const [tokenValue, setTokenValue] = useRecoilState(tokenState);

    const getKakaoToken = () => {
        // fetch(`https://kauth.kakao.com/oauth/token`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //     body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&code=${code}`,
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         if (data.access_token) {
        //             localStorage.setItem('token', data.access_token);
        //             setTokenValue(localStorage.getItem('token'));
        //         } else {
        //             console.log(data);
        //             console.log('로그인 실패');
        //         }
        //     });
        // axios
        //     .get(`${process.env.REACT_APP_API_URL}/member/login/kakao/${code}`)
        //     .then((response) => console.log(response));
    };

    useEffect(() => {
        if (!location.search) return;
        getKakaoToken();
    }, []);

    // 로그인 시도 (실패)
    // useEffect(() => {
    //     fetch(`https://kapi.kakao.com/v2/user/me`, {
    //         method: 'GET',
    //         headers: { Authorization: `Bearer ${tokenValue}` },
    //     }).then((res) => console.log('응답', res));
    // }, [tokenValue]);

    return <div>{code}</div>;
}

export default KakaoLogin;
