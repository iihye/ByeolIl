import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage';
import Login from './components/login/Login';
import Header from './components/Header';
import ChangeInfo from 'components/user/ChangeInfo';
import StarList from 'components/star/StarList';
import { Routes, Route } from 'react-router-dom';
import KakaoLogin from './components/login/KakaoLogin';
import FindUser from 'components/user/FindUser';
import List from 'components/reusable/List';
import StarDetail from 'components/star/StarDetail';
import { Link } from 'react-router-dom';
import StarRegist from 'components/star/StarRegist';
import { useRef } from 'react';
import ErrorPage from 'pages/ErrorPage';

localStorage.setItem('isLogin', true); // 테스트용

function App() {
    const isLogin = localStorage.getItem('isLogin');
    return (
        <div className="App">
            <Header />
            <Routes>
                {/* url이 3000이 아니라서 클라이언트쪽에서 특정 페이지로 이동하게 만들지 못함 */}
                <Route
                    path="/member/join/kakao"
                    element={<KakaoLogin />}
                ></Route>
                <Route exact path="/landing/login" element={<Login />}></Route>
                <Route path="/space/:user_id" element={<MainPage />}>
                    <Route path="changeInfo" element={<ChangeInfo />} />
                    <Route path="starList" element={<StarList />} />
                    <Route path="star/:star_id" element={<StarDetail />} />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
            </Routes>

            <div>
                {' '}
                테스트 버튼들 ---------------------------------------------
            </div>

            <Link to="/space/1">
                <button>1번 유저의 메인 페이지로 이동</button>
            </Link>

            {/* <StarRegist type={"regist"} location={50} /> */}
        </div>
    );
}
export default App;
