import React from 'react';
import { Link } from 'react-router-dom';
import { userIndexState } from './atom';
import { useRecoilValue } from 'recoil';

function Header() {
    const userIndexValue = useRecoilValue(userIndexState);
    return (
        <div className="Header">
            <div>고정된 헤더입니다!!</div>
            <Link to="/landing/login">
                <button>로그인</button>
            </Link>
            <Link to={`/space/${userIndexValue}/settings`}>환경설정</Link>
        </div>
    );
}

export default Header;
