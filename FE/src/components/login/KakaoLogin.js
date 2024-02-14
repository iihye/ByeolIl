import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import base64 from 'base-64';
import swal from 'sweetalert';

function KakaoLogin() {
    console.log('/login/kakao 접근');
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URL(document.URL).searchParams;
    const code = params.get('code');

    console.log('code: ', code);

    const getKakaoToken = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/member/login/kakao?code=${code}`
            );
            if (response.status == 200) {
                const token = `Bearer ${response.headers.accesstoken}`;
                console.log('token: ', token);

                sessionStorage.setItem('token', token);

                // JWT 디코딩
                let payload = token.substring(
                    token.indexOf('.') + 1,
                    token.lastIndexOf('.')
                );

                let dec = JSON.parse(base64.decode(payload));
                sessionStorage.setItem('auth', dec.auth);
                sessionStorage.setItem('memberIndex', dec.sub);
                console.log(
                    'localStrgetoken:',
                    sessionStorage.getItem(`token`)
                );
                console.log('memberIndex: ', dec.sub);
                await getUserIndex();
                if (dec.sub) {
                    navigate(`/space/${dec.sub}`);
                }
            }
        } catch (error) {
            swal({
                title: error.response.data.message,
                text: '아이디와 비밀번호를 확인해주세요',
                icon: 'error',
            });
        }
    };

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
            console.log(response);
            sessionStorage.setItem('nickname', response.data.memberNickname);
        } catch (error) {
            console.log('회원정보 가져오기 실패', error);
        }
    };

    useEffect(() => {
        if (!location.search) return;
        getKakaoToken();
    }, []);
}

export default KakaoLogin;
