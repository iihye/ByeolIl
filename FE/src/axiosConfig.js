import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        const token = response.data.accessToken;
        if (token) {
            localStorage.setItem('token', token);
        }
        return response;
    },
    async (error) => {
        if (error.response.status === 400 && error.response.data.message) {
            alert(error.response.data.message);
            return error.response;
        }
    }
);

export default axios;
