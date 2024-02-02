import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';
function Header() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [memberIndex, setMemberIndex] = useState(
        localStorage.getItem('memberIndex')
    );

    useEffect(() => {
        setMemberIndex(localStorage.getItem('memberIndex'));
    }, [token]);

    return (
        <div className="Header">
            <div>고정된 헤더입니다!!</div>

            {token ? (
                <>
                    <nav className="sideContainer">
                        <Sidebar
                            props={localStorage.getItem('memberNickname')}
                        />
                        <Link to={`/space/${memberIndex}/alarm`}>
                            <button>알림창</button>
                        </Link>
                    </nav>
                </>
            ) : (
                <Link to="/landing/login">
                    <button>로그인</button>
                </Link>
            )}
        </div>
    );
}

export default Header;
