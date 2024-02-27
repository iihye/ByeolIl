import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

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

                if (!res) {
                    swal({
                        title: '네트워크 에러 발생',
                        text: '관리자에게 문의하세요',
                        icon: 'error',
                    });

                    return res;
                }

                if (res.status === 400 && res.data.message) {
                    swal({
                        title: res.data.message,
                        icon: 'error',
                    });

                    return res;
                } else if (res.status === 401 || res.status === 403) {
                    sessionStorage.removeItem('memberIndex');
                    sessionStorage.removeItem('nickname');
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('auth');
                    swal({
                        title: '재로그인이 필요해요',
                        icon: 'info',
                    }).then(() => {
                        navigate('/landing/login');
                    });
                } else if (res.status === 404) {
                    return navigate('/not-found');
                } else if (res.status === 500) {
                    swal({
                        title: '서버에 문제가 있어요',
                        text: '잠시 기다려주세요!',
                        icon: 'error',
                    });
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
