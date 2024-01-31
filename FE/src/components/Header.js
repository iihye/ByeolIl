import React from 'react';
import { Link } from 'react-router-dom';
import { userIndexState } from 'components/atom';
import { useRecoilValue } from 'recoil';

function Header() {
    const userIndex = useRecoilValue(userIndexState);
    return (
        <div className="Header">
            <div>고정된 헤더입니다!!</div>
            <Link to="/landing/login">
                <button>로그인</button>
            </Link>
            <Link to="/member/search/list">유저 검색</Link>
            <Link to={`/space/${userIndex}/starMine`}>내 일기목록</Link>
        </div>
    );
}

export default Header;
