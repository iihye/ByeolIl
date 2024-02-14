import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { TfiMenu } from 'react-icons/tfi';
import { FaUserCircle } from 'react-icons/fa';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import * as SiIcons from 'react-icons/si';
import * as RiIcons from 'react-icons/ri';
import * as WiIcons from 'react-icons/wi';
import * as LuIcons from 'react-icons/lu';
import * as AiIcons from 'react-icons/ai';
import * as PiIcons from 'react-icons/pi';
import * as HiIcons from 'react-icons/hi2';
import * as IoIcons from 'react-icons/io5';
import { useSetRecoilState } from 'recoil';
import {
    isChangeInfoOpenState,
    isFavorListOpenState,
    isFindUserOpenState,
    isFollowListOpenState,
    isMyStarListOpenState,
    isSettingOpenState,
    isTagSearchOpenState,
} from './atom';

function SidebarList(props) {
    const setIsChangeInfoOpen = useSetRecoilState(isChangeInfoOpenState);
    const setIsMyStarListOpen = useSetRecoilState(isMyStarListOpenState);
    const setIsFavorListOpen = useSetRecoilState(isFavorListOpenState);
    const setIsFollowListOpen = useSetRecoilState(isFollowListOpenState);
    const setIsFindUserOpen = useSetRecoilState(isFindUserOpenState);
    const setIsTagSearchOpen = useSetRecoilState(isTagSearchOpenState);
    const setIsSettingOpen = useSetRecoilState(isSettingOpenState);

    const [items, setItems] = useState([]);
    const isAdmin = sessionStorage.getItem('auth');
    const nickname = sessionStorage.getItem('nickname');

    const navigate = useNavigate();

    const handleLogOut = () => {
        sessionStorage.removeItem('memberIndex');
        sessionStorage.removeItem('nickname');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auth');
        navigate('/landing');
    };

    const handleNickname = () => {};

    useEffect(() => {
        setItems([
            {
                type: 'PiIcons',
                icon: 'PiStarAndCrescent',
                name: '내 우주가기',
                path: () => navigate(`space/${props.memberIndex}`),
            },
            {
                type: 'RiIcons',
                icon: 'RiLockPasswordLine',
                name: '회원정보수정',
                path: () => setIsChangeInfoOpen(true),
            },
            {
                type: 'WiIcons',
                icon: 'WiStars',
                name: '나의 별 목록',
                path: () => setIsMyStarListOpen(true),
            },
            {
                type: 'LuIcons',
                icon: 'LuFolderHeart',
                name: '좋아하는 별 목록',
                path: () => setIsFavorListOpen(true),
            },
            {
                type: 'AiIcons',
                icon: 'AiOutlineUserAdd',
                name: '팔로우/팔로워 목록',
                path: () => setIsFollowListOpen(true),
            },
            {
                type: 'PiIcons',
                icon: 'PiShootingStarLight',
                name: '다른 우주 찾기',
                path: () => setIsFindUserOpen(true),
            },
            {
                type: 'HiIcons',
                icon: 'HiMiniHashtag',
                name: '태그로 별 찾기',
                path: () => setIsTagSearchOpen(true),
            },
            {
                type: 'IoIcons',
                icon: 'IoSettingsOutline',
                name: '환경설정',
                path: () => setIsSettingOpen(true),
            },
        ]);
    }, []);

    useEffect(() => {
        if (isAdmin == 'ROLE_ADMIN')
            setItems((prevItems) => [
                ...prevItems,
                {
                    type: 'PiIcons',
                    icon: 'PiSiren',
                    name: '신고관리',
                    path: `/space/${props.memberIndex}/report`,
                },
            ]);
    }, [props.memberIndex]);

    return (
        <div className="sidebarList bg-modal-bg text-white-sub p-3 rounded-xl">
            <div className="flex justify-left">
                <FaUserCircle size="24" className="pr-2 text-btn-bg-hover" />
                <h2 className="mb-2 text-btn-bg-hover">{nickname}</h2>
                <HiOutlinePencilAlt
                    size="24"
                    className="pl-2"
                    onClick={() => handleNickname}
                />
            </div>
            {/* 땡땡님의 우주 옆에 연필 아이콘(닉네임 수정 모달창으로 이동) */}
            {items.map((item, index) => {
                let IconComponent;

                if (item.type === 'RiIcons') {
                    IconComponent = RiIcons[item.icon];
                } else if (item.type === 'WiIcons') {
                    IconComponent = WiIcons[item.icon];
                } else if (item.type === 'LuIcons') {
                    IconComponent = LuIcons[item.icon];
                } else if (item.type === 'AiIcons') {
                    IconComponent = AiIcons[item.icon];
                } else if (item.type === 'PiIcons') {
                    IconComponent = PiIcons[item.icon];
                } else if (item.type === 'HiIcons') {
                    IconComponent = HiIcons[item.icon];
                } else if (item.type === 'IoIcons') {
                    IconComponent = IoIcons[item.icon];
                } else if (item.type === 'SiIcons') {
                    IconComponent = SiIcons[item.icon];
                }

                return (
                    <div
                        className="flex justyfy-center sidebarItem mb-2"
                        key={index}
                    >
                        <div
                            className="flex justyfy-center items-center hover:cursor-pointer hover:text-white"
                            onClick={item.path}
                        >
                            {IconComponent && (
                                <IconComponent className="mr-2" />
                            )}
                            {item.name}
                        </div>
                    </div>
                );
            })}
            <button className="w-full" onClick={handleLogOut}>
                로그아웃
            </button>
        </div>
    );
}

export default function Sidebar() {
    const [viewSideBar, setViewSideBar] = useState(false);
    const [memberIndex, setMemberIndex] = useState(
        Number(sessionStorage.getItem('memberIndex'))
    );
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
    }, [memberIndex]);

    return (
        <div className="Sidebar m-2">
            <TfiMenu
                className="Sidebar-Menu"
                onClick={() =>
                    viewSideBar ? setViewSideBar(false) : setViewSideBar(true)
                }
                size="28"
                color="white"
            />

            <div className="absolute top-10 right-2 font-['Pre-Bold']">
                {viewSideBar ? (
                    <SidebarList name={name} memberIndex={memberIndex} />
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}
