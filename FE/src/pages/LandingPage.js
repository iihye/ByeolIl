// import video from "../video/background1.mp4"
// import video from "../video/background2.mp4"
import video from '../video/background3.mp4';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import {
    isChangeInfoOpenState,
    isFavorListOpenState,
    isFindUserOpenState,
    isFollowListOpenState,
    isMyStarListOpenState,
    isSettingOpenState,
    isTagSearchOpenState,
} from 'components/atom';
import { Button } from '@/components/ui/button';


export default function LandingPage() {
    const resetIsChangeInfoOpen = useResetRecoilState(isChangeInfoOpenState);
    const resetIsMyStarListOpen = useResetRecoilState(isMyStarListOpenState);
    const resetIsFavorListOpen = useResetRecoilState(isFavorListOpenState);
    const resetIsFollowListOpen = useResetRecoilState(isFollowListOpenState);
    const resetIsFindUserOpen = useResetRecoilState(isFindUserOpenState);
    const resetIsTagSearchOpen = useResetRecoilState(isTagSearchOpenState);
    const resetIsSettingOpen = useResetRecoilState(isSettingOpenState);

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname.split('/').length === 3);
        if (location.pathname.split('/').length > 2) setIsOpen(true);
        else setIsOpen(false);
    }, [location]);

    // 모달 상태 초기화
    useEffect(() => {
        resetIsChangeInfoOpen();
        resetIsMyStarListOpen();
        resetIsFavorListOpen();
        resetIsFollowListOpen();
        resetIsFindUserOpen();
        resetIsTagSearchOpen();
        resetIsSettingOpen();
    }, []);

    return (
        <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden bg-black">
            <div>
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute top-0 left-0 w-full h-full object-cover"
                >
                    <source src={video} type="video/mp4"></source>
                </video>
            </div>
            <div className="content absolute">
                {!isOpen && (
                    <div className="font-['Pre-Bold'] w-56">
                        <h1 className="text-white text-6xl text-center font-['Star'] py-4">
                            별일
                        </h1>   
                        <Link to="/landing/login">
                            <Button className="w-full h-button my-1">시작하기</Button>
                        </Link>
                    </div>
                )}
                <Outlet />
            </div>
        </div>
    );
}