import video from '../video/background3.mp4';
import create from "../img/create.gif"
import hover from "../img/hover.gif"
import move from "../img/move.gif"
import scrollDown from "../img/scrollDownImg.png"
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
import ScrollAnimationContainer from "./ScrollAnimationContainer";
import { Container, DownArrow } from "./styled";

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
        if (location.pathname.split("/").length > 2) setIsOpen(true);
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
      
    return (<div className="bg-slate-900 text-white">
        <Container>
            <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden">
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
                                <Button className="w-full h-button my-1">
                                    시작하기
                                </Button>
                            </Link>
                        </div>
                    )}
                    <Outlet />
                    {!isOpen &&
                    <div className='fixed bottom-0 m-2.5 ml-[60px]'>
                        <DownArrow src={scrollDown} />
                    </div>}
                </div>
            </div>
            </Container>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">나만의 3D 우주에서 별 일기 쓰기.</h1>
            </ScrollAnimationContainer>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">마우스로 내 우주를 드래그 해보아요.</h1>
                <img className="w-3/5" src={move} />
            </ScrollAnimationContainer>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">마우스를 별위에 올리면 어떤 별자리인지 알려줘요.</h1>
                <img className="w-3/5" src={hover} />
            </ScrollAnimationContainer>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">별자리의 모든 별을 채워서 별자리를 완성해보아요.</h1>
                <img className="w-3/5" src={create} />
            </ScrollAnimationContainer>

            </div>
    );
}