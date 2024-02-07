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
            ) : (<div>
                    <Link to="/landing/login">
                        <button>로그인</button>
                    </Link>
                    <Link to="/regist">
                        <button>회원가입</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Header;
