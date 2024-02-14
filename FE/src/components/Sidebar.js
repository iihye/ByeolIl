import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useVideoTexture } from "@react-three/drei";
import { IoMdMenu } from "react-icons/io";
import { useSetRecoilState } from "recoil";
import {
    isChangeInfoOpenState,
    isFavorListOpenState,
    isFindUserOpenState,
    isFollowListOpenState,
    isMyStarListOpenState,
    isSettingOpenState,
    isTagSearchOpenState,
} from "./atom";

function SidebarList(props) {
    const setIsChangeInfoOpen = useSetRecoilState(isChangeInfoOpenState);
    const setIsMyStarListOpen = useSetRecoilState(isMyStarListOpenState);
    const setIsFavorListOpen = useSetRecoilState(isFavorListOpenState);
    const setIsFollowListOpen = useSetRecoilState(isFollowListOpenState);
    const setIsFindUserOpen = useSetRecoilState(isFindUserOpenState);
    const setIsTagSearchOpen = useSetRecoilState(isTagSearchOpenState);
    const setIsSettingOpen = useSetRecoilState(isSettingOpenState);

    const [items, setItems] = useState([]);
    const isAdmin = sessionStorage.getItem("auth");

    const navigate = useNavigate();

    const handleLogOut = () => {
        sessionStorage.removeItem("memberIndex");
        sessionStorage.removeItem("nickname");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        navigate("/landing");
    };

    useEffect(() => {
        setItems([
            {
                name: "회원정보수정",
                path: () => setIsChangeInfoOpen(true),
            },
            {
                name: "나의 별 목록",
                path: () => setIsMyStarListOpen(true),
            },
            {
                name: "좋아하는 별 목록",
                path: () => setIsFavorListOpen(true),
            },
            {
                name: "팔로우/팔로워 목록",
                path: () => setIsFollowListOpen(true),
            },
            {
                name: "다른 우주 찾기",
                path: () => setIsFindUserOpen(true),
            },
            {
                name: "태그로 별 찾기",
                path: () => setIsTagSearchOpen(true),
            },
            { name: "환경설정", path: () => setIsSettingOpen(true) },
        ]);
    }, []);

    useEffect(() => {
        if (isAdmin == "ROLE_ADMIN")
            setItems((prevItems) => [
                ...prevItems,
                {
                    name: "신고관리",
                    path: `/space/${props.memberIndex}/report`,
                },
            ]);
    }, [props.memberIndex]);

    return (
        <div className="sidebarList bg-modal-bg text-white-sub p-2 rounded-xl">
            <h2>{props.name}님의 우주</h2>
            {/* 땡땡님의 우주 옆에 연필 아이콘(닉네임 수정 모달창으로 이동) */}
            {items.map((item, index) => {
                return (
                    <div className="sidebarItem" key={index}>
                        <p className="mb-3" onClick={item.path}>
                            {item.name}
                        </p>
                    </div>
                );
            })}
            <button onClick={handleLogOut}>로그아웃</button>
        </div>
    );
}

export default function Sidebar() {
    const [viewSideBar, setViewSideBar] = useState(false);
    const [memberIndex, setMemberIndex] = useState(sessionStorage.getItem("memberIndex"));
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await axios.get(`${process.env.REACT_APP_API_URL}/member/info/mine`);
                setName(userData.data.memberNickname);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [memberIndex]);

    return (
        <div className="Sidebar">
            <button onClick={() => (viewSideBar ? setViewSideBar(false) : setViewSideBar(true))}>=</button>
            <div className="absolute top-10 right-0 font-['Pre-Bold']">
                {viewSideBar ? <SidebarList name={name} memberIndex={memberIndex} /> : <div />}
            </div>
        </div>
    );
}
