<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useVideoTexture } from '@react-three/drei';

function SidebarList(props) {
    const [memberIndex, setMemberIndex] = useState(
        localStorage.getItem('memberIndex')
    );
    const [items, setItems] = useState([]);
    const isAdmin = localStorage.getItem('auth');

    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('memberIndex');
        localStorage.removeItem('nickname');
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        navigate('');
    };

    useEffect(() => {
        setMemberIndex(memberIndex);
        setItems([
            { name: '회원정보수정', path: `/space/${memberIndex}/editInfo` },
            { name: '나의 별 목록', path: `/space/${memberIndex}/starMine` },
            {
                name: '좋아하는 별 목록',
                path: `/space/${memberIndex}/starFavor`,
            },
            {
                name: '팔로우/팔로워 목록',
                path: `/space/${memberIndex}/follow`,
            },
            { name: '다른 우주 찾기', path: `/space/${memberIndex}/findUser` },
            { name: '태그로 별 찾기', path: `/space/${memberIndex}/tagSearch` },
            { name: '환경설정', path: `/space/${memberIndex}/settings` },
        ]);
    }, [memberIndex]);

    useEffect(() => {
        if (isAdmin == 'ROLE_ADMIN')
            setItems((prevItems) => [
                ...prevItems,
                { name: '신고관리', path: `/space/admin/report` },
            ]);
    }, []);

    return (
        <div className="sidebarList">
            <h2>{props.name}님의 우주</h2>
            {/* 땡땡님의 우주 옆에 연필 아이콘(닉네임 수정 모달창으로 이동) */}
            {items.map((item, index) => {
                return (
                    <div className="sidebarItem" key={index}>
                        <Link to={item.path}>
                            <p>{item.name}</p>
                        </Link>
                    </div>
                );
            })}
            <button onClick={handleLogOut}>로그아웃</button>
>>>>>>> 1f2ebabb4993dfdc897917f426ea257b578d5dd3
        </div>
    );
}

<<<<<<< HEAD
export default function Sidebar(props) {
    const [viewSideBar, setViewSideBar] = useState(false);

    const toggleSidebar = () => {
        setViewSideBar(!viewSideBar);
    };

    return (
        <div className="Sidebar">
            <button onClick={toggleSidebar}>=</button>
            <div>{viewSideBar && <SidebarList name={props.name} />}</div>
=======
export default function Sidebar() {
    const [viewSideBar, setViewSideBar] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await axios.get(
                    `${process.env.REACT_APP_API_URL}/member/info/mine`
                );
                setName(userData.data.memberNickname);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    });

    return (
        <div className="Sidebar">
            <button
                onClick={() =>
                    viewSideBar ? setViewSideBar(false) : setViewSideBar(true)
                }
            >
                =
            </button>
            <div>{viewSideBar ? <SidebarList name={name} /> : <div />}</div>
>>>>>>> 1f2ebabb4993dfdc897917f426ea257b578d5dd3
        </div>
    );
}
