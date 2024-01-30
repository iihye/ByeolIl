import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="Header">
            <div>고정된 헤더입니다</div>
            <Link to="/landing/login">
                <button>로그인</button>
            </Link>
            <Link to="/member/search/list">유저 검색</Link>
        </div>
    );
}

export default Header;
