import Report from './components/admin/Report';
import Alarm from './components/user/Alarm';
import MainPage from './pages/MainPage';
import Login from './components/login/Login';
import Header from './components/Header';
import ChangeInfo from 'components/user/ChangeInfo';
import ErrorPage from 'pages/ErrorPage';
import FindUser from 'components/user/FindUser';
import KakaoLogin from './components/login/KakaoLogin';
import KakaoRegist from 'components/login/KakaoRegist';
import List from 'components/reusable/List';
import StarFavorList from 'components/star/StarFavorList';
import FollowList from 'components/user/FollowList';
import Settings from 'components/user/Settings';
import FindID from 'components/login/FindID';
import FindPW from 'components/login/FindPW';
import Regist from 'components/login/Regist';
import StarTagSearch from 'components/star/StarTagSearch';
import Radio from 'components/radio/Radio';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from 'pages/LandingPage';
import { useEffect } from 'react';
import { RecoilEnv } from 'recoil';

function App() {
    RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
    // 로그인 ? mainpage : landingpage
    const navigate = useNavigate();
    const rendering = () => {
        sessionStorage.getItem('token')
            ? navigate(`/space/${sessionStorage.getItem('memberIndex')}`)
            : navigate('/landing');
    };
    useEffect(() => {
        rendering();
    }, []);
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/regist/kakao" element={<KakaoRegist />}></Route>
                <Route path="/login/kakao" element={<KakaoLogin />}></Route>
                <Route path="/landing" element={<LandingPage />}>
                    <Route path="login" element={<Login />}></Route>
                    <Route path="regist" element={<Regist />}></Route>
                    <Route path="findId" element={<FindID />} />
                    <Route path="findPw" element={<FindPW />} />
                </Route>
                <Route path="/space/:user_id" element={<MainPage />}>
                    <Route path="radio" element={<Radio />} />
                </Route>{' '}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
}
export default App;
