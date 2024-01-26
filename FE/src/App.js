import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage';
import Login from './components/login/Login';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import KakaoLogin from './components/login/KakaoLogin';

localStorage.setItem('isLogin', true); // 테스트용

function App() {
    const isLogin = localStorage.getItem('isLogin');

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route
                    path="/member/login/kakao"
                    element={<KakaoLogin />}
                ></Route>
                <Route path="/landing/login" element={<Login />}></Route>
            </Routes>
        </div>
    );
}
export default App;
