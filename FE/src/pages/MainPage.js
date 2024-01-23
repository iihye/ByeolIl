import React from "react";
import {atom, useRecoilState} from "recoil";
import Login from '../components/login/Login'
import Regist from '../components/login/Regist'

// - 로그인 전
//  - 우측 상단의 로그인, 회원가입 버튼을 누를 수 있다
// - 로그인 후
//  - 개인 공간 페이지로 연결.

const loginState = atom({
    key: 'loginState',
    default: false,
});

export default function MainPage() {
    const isLogin = useRecoilState(loginState);
    if(isLogin){
        return // 내공간 컴포넌트
    }else {
        return (
        <div className="MainPage">
            <div className="mainContainer">
                {/* 내공간에서 모든 기능을 제외하고 3D 배경만을 가져와?*/}
                {/* 아니면 적절한 이미지 내지 짧은 영상을 배경으로?*/}
                <h2>서비스이름</h2>
                <h3>감성적인 짧은 설명</h3>
            </div>
            <div className="sideContainer">
                <Login/>
                <Regist/>
            </div> 
        </div>
    )
    }
}