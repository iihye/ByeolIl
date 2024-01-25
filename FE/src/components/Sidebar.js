import React, { useState } from 'react';
// import StarFavoList from './star/StarFavorList'
// import FollowList from './user/FollowList'
// import FindUser from './user/FindUser'
// import StarTagSearch from './star/StarTagSearch'
// 환경설정 컴포넌트..?
// import Alarm from './user/Alarm'
import { Link } from 'react-router-dom';

const items = [
    { name: '회원정보수정', path: '/ChangeInfo' },
    { name: '별리스트', path: '/StarList' },
    { name: '좋아하는별리스트', path: '/StarFavoList' },
];

// 관리자라면 사이드바 메뉴에 신고 관리가 추가됨
const isAdmin = localStorage.getItem('memberId') === 'admin';

const menuItems = isAdmin
    ? [...items, { name: '신고 관리', path: '/Report' }]
    : items;

// 로그아웃
const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
};

function SideBarItem({ item }) {
    return (
        <div className="sidebar-item">
            <p>{item.name}</p>
        </div>
    );
}

function SidebarList(props) {
    return (
        <div className="SidebarList">
            <ul>
                <h2>{props.name}님의 우주</h2>
                {menuItems.map((item, index) => {
                    return (
                        <Link to={item.path} key={index}>
                            <SideBarItem item={item} />
                        </Link>
                    );
                })}
                <button onClick={handleLogout}>로그아웃</button>
            </ul>
        </div>
    );
}

export default function Sidebar(props) {
    const [viewSideBar, setViewSideBar] = useState(false);

    const toggleSidebar = () => {
        setViewSideBar(!viewSideBar);
    };

    return (
        <div className="Sidebar">
            <button onClick={toggleSidebar}>=</button>
            <div>{viewSideBar && <SidebarList name={props.name} />}</div>
        </div>
    );
}
