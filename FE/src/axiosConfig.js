import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AxiosInterceptor() {
    const navigate = useNavigate();

    useEffect(() => {
        const reqInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = sessionStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const resInterceptor = axios.interceptors.response.use(
            (response) => {
                const token = response.data.accessToken;
                if (token) {
                    sessionStorage.setItem('token', token);
                }
                return response;
            },
            (error) => {
                const res = error.response;
                if (res.status === 400 && res.data.message) {
                    alert(res.data.message);
                    return res;
                } else if (
                    res.status === 401 ||
                    res.status === 403 ||
                    res.status === 400
                ) {
                    sessionStorage.removeItem('memberIndex');
                    sessionStorage.removeItem('nickname');
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('auth');
                    alert('재로그인이 필요해요');
                    navigate('/landing/login');
                } else if (res.status === 404) {
                    return navigate('/not-found');
                } else if (res.status === 500) {
                    alert('서버에 문제가 있어요 잠시 기다려주세요!');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
        };
    }, [navigate]);

    return null;
}

export default AxiosInterceptor;
