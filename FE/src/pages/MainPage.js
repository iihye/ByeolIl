import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import Login from '../components/login/Login'
// import Regist from '../components/login/Regist'
import Sidebar from '../components/Sidebar';
import ChangeInfo from '../components/user/ChangeInfo';
import StarList from '../components/star/StarList';
// import StarFavoList from './star/StarFavorList'
// import FollowList from './user/FollowList'
// import FindUser from './user/FindUser'
// import StarTagSearch from './star/StarTagSearch'
// 환경설정 컴포넌트..?
// import Alarm from './user/Alarm'

// - 로그인 전
//  - 우측 상단의 로그인, 회원가입 버튼을 누를 수 있다
// - 로그인 후
//  - 개인 공간 페이지로 연결.

const loginState = atom({
    key: 'loginState',
    default: false,
});

export default function MainPage() {
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    if (isLogin) {
        return; // 나의공간 컴포넌트
    } else {
        return (
            <div className="MainPage">
                <BrowserRouter>
                    <div className="mainContainer">
                        {/* 내공간에서 모든 기능을 제외하고 3D 배경만을 가져와?*/}
                        {/* 아니면 적절한 이미지 내지 짧은 영상을 배경으로?*/}
                        <h2>별무리</h2>
                        <h3>밤하늘의 별을 보며 쓰는 왕멋진일기</h3>
                        <Routes>
                            <Route
                                path="/ChangeInfo"
                                element={<ChangeInfo />}
                            />
                            <Route path="/StarList" element={<StarList />} />
                        </Routes>
                    </div>
                    <div className="sideContainer">
                        {/* <Login/>
                    <Regist/> */}
                        <Sidebar />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
