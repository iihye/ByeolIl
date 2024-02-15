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
import * as SlICons from 'react-icons/sl';

import { useSetRecoilState } from 'recoil';
import {
    isChangeInfoOpenState,
    isFavorListOpenState,
    isFindUserOpenState,
    isFollowListOpenState,
    isMyStarListOpenState,
    isSettingOpenState,
    isTagSearchOpenState,
    isReportOpenState,
    isOpinionOpenState,
} from './atom';
import swal from 'sweetalert';

function SidebarList(props) {
    const setIsChangeInfoOpen = useSetRecoilState(isChangeInfoOpenState);
    const setIsMyStarListOpen = useSetRecoilState(isMyStarListOpenState);
    const setIsFavorListOpen = useSetRecoilState(isFavorListOpenState);
    const setIsFollowListOpen = useSetRecoilState(isFollowListOpenState);
    const setIsFindUserOpen = useSetRecoilState(isFindUserOpenState);
    const setIsTagSearchOpen = useSetRecoilState(isTagSearchOpenState);
    const setIsSettingOpen = useSetRecoilState(isSettingOpenState);
    const setIsReportOpen = useSetRecoilState(isReportOpenState);
    const setIsOpinionOpen = useSetRecoilState(isOpinionOpenState);

    const [items, setItems] = useState([]);
    const [isModifying, setIsModifying] = useState(false);
    const [nickname, setNickname] = useState(
        sessionStorage.getItem('nickname')
    );
    const isAdmin = sessionStorage.getItem('auth');
    const token = sessionStorage.getItem('token');
    const memberIndex = Number(sessionStorage.getItem('memberIndex'));

    const navigate = useNavigate();

    const handleLogOut = () => {
        sessionStorage.removeItem('memberIndex');
        sessionStorage.removeItem('nickname');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auth');
        navigate('/landing');
    };

    const handleNickname = async (e) => {
        if (e.code === 'Enter') {
            if (e.target.value === '') {
                setIsModifying(false);
                return;
            }
            e.preventDefault();
            const newName = e.target.value;
            const nickNameRegExp = /^[가-힣a-zA-Z0-9_]{2,10}$/;

            if (!nickNameRegExp.test(newName)) {
                swal({
                    title: `${newName}은 사용이 불가능해요`,
                    text: "2~10자 사이 한글, 영문, 숫자, '_' 만 입력해주세요",
                    icon: 'error',
                });
                return;
            }

            // 닉네임 중복 체크
            try {
                const response = await axios.get(
                    `${
                        process.env.REACT_APP_API_URL
                    }/member/dup-check/nickname?nickname=${encodeURIComponent(
                        newName
                    )}`
                );

                if (response.data.message === '사용 가능한 닉네임입니다.') {
                    // 닉네임 변경 로직
                    try {
                        const updateResponse = await axios.put(
                            `${process.env.REACT_APP_API_URL}/member`,
                            {
                                memberIndex: memberIndex,
                                memberNickname: newName,
                            },
                            { headers: { token: token } }
                        );

                        if (updateResponse.status === 200) {
                            swal({
                                title: '닉네임 변경 완료!',
                                icon: 'success',
                            }).then(() => {
                                sessionStorage.setItem('nickname', newName);
                                setNickname(newName);
                            });
                        }
                    } catch (error) {
                        swal({
                            title: '닉네임 변경 실패',
                            text: '다시 시도해주세요',
                            icon: 'error',
                        });
                    }
                } else {
                    swal({
                        title: `중복된 닉네임이에요`,
                        icon: 'error',
                    });
                }
            } catch (error) {}
            setIsModifying(false);
        }
    };

    function goMySpace() {
        swal({
            title: `나의 우주로 이동합니다🚀`,
            icon: 'success',
        }).then(() => navigate(`space/${props.memberIndex}`));
    }

    useEffect(() => {
        setItems([
            {
                type: PiIcons,
                icon: 'PiStarAndCrescent',
                name: '내 우주가기',
                path: goMySpace,
            },
            {
                type: WiIcons,
                icon: 'WiStars',
                name: '나의 별 목록',
                path: () => setIsMyStarListOpen(true),
            },
            {
                type: LuIcons,
                icon: 'LuFolderHeart',
                name: '좋아하는 별 목록',
                path: () => setIsFavorListOpen(true),
            },
            {
                type: HiIcons,
                icon: 'HiMiniHashtag',
                name: '태그로 별 찾기',
                path: () => setIsTagSearchOpen(true),
            },
            {
                type: AiIcons,
                icon: 'AiOutlineUserAdd',
                name: '팔로우/팔로워 목록',
                path: () => setIsFollowListOpen(true),
            },
            {
                type: PiIcons,
                icon: 'PiShootingStarLight',
                name: '다른 우주 찾기',
                path: () => setIsFindUserOpen(true),
            },
            {
                type: IoIcons,
                icon: 'IoSettingsOutline',
                name: '환경설정',
                path: () => setIsSettingOpen(true),
            },
            {
                type: RiIcons,
                icon: 'RiLockPasswordLine',
                name: '회원정보수정',
                path: () => setIsChangeInfoOpen(true),
            },
            {
                type: SlICons,
                icon: 'SlSpeech',
                name: '의견 보내기',
                path: () => setIsOpinionOpen(memberIndex),
            },
        ]);
    }, []);

    useEffect(() => {
        if (isAdmin == 'ROLE_ADMIN')
            setItems((prevItems) => [
                ...prevItems,
                {
                    type: PiIcons,
                    icon: 'PiSiren',
                    name: '신고관리',
                    path: () => setIsReportOpen(true),
                },
            ]);
    }, [props.memberIndex]);

    return (
        <div className="sidebarList bg-modal-bg text-white-sub p-3 rounded-xl">
            <div className="flex justify-left">
                {isModifying ? (
                    <>
                        <input
                            placeholder="변경할 닉네임 입력 후 엔터"
                            // value={nickname}
                            onChange={handleNickname}
                            onKeyPress={(e) => handleNickname(e)}
                            className="mb-2"
                        />
                    </>
                ) : (
                    <>
                        <FaUserCircle
                            size="24"
                            className="pr-2 text-btn-bg-hover"
                        />
                        <h2 className="mb-2 text-btn-bg-hover">{nickname}</h2>
                        <div
                            onClick={() => setIsModifying(true)}
                            className="pl-2 hover:cursor-pointer hover:text-white"
                        >
                            <HiOutlinePencilAlt size="24" />
                        </div>
                    </>
                )}
            </div>
            {/* 땡땡님의 우주 옆에 연필 아이콘(닉네임 수정 모달창으로 이동) */}
            {items.map((item, index) => {
                const IconItem = item.type[item.icon];
                const IconComponent = IconItem;

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
