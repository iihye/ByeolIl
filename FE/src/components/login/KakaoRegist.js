import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';

function KakaoRegist() {
    console.log("/regist/kakao접근");
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URL(document.URL).searchParams;
    const code = params.get('code');

    console.log("code: ",code);

    const getKakaoToken = async () => {
        try{
        const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/member/join/kakao?code=${code}`
                );
                console.log("response: ",response);
                if(response.status==200){
                    navigate('/landing/regist', 
                    { state: 
                        { social_id: response.data.id, 
                            social_platform: response.data.platform 
                        } 
                    }
                    );
                }
        }catch(error){
            alert(error.response.data.message);
        }
    };


    useEffect(() => {
        if (!location.search) return;
        getKakaoToken();
    }, []);
}

export default KakaoRegist;
