import video from '../video/background3.mp4';
import { useEffect, useState, useRef } from 'react';
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
import { Container } from "./styled";

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
    //스크롤페이지 상태관리
    const [isInViewport, setIsInViewport] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
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

    useEffect(() => {
        if (!ref.current) return; // 요소가 아직 준비되지 않은 경우 중단
      
        const callback = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 요소가 뷰포트에 나타났을 경우
              setIsInViewport(true);
            } else {
              // 요소가 뷰포트를 벗어난 경우
              setIsInViewport(false);
            }
          });
        };
      
        const options = { root: null, rootMargin: "0px", threshold: 0 };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(ref.current); // 요소 관찰 시작
      
        return () => {
          observer.disconnect(); // 컴포넌트 언마운트 시 관찰 중단
        };
      }, []);
      
    return (<>
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
                </div>
            </div>
            </Container>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">나만의 3D 우주에서 별 일기 쓰기.</h1>
            </ScrollAnimationContainer>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">학교종이 쌩쌩쌩</h1>
            </ScrollAnimationContainer>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">선생님이 워리를 </h1>
            </ScrollAnimationContainer>
            <ScrollAnimationContainer>
                <h1 className=" text-6xl text-center font-['Star'] py-4">waiting 하신다.</h1>
            </ScrollAnimationContainer>

            </>
    );
}